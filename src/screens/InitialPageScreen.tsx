import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WifiIcon from '../../assets/icons/wifi.svg';
import WaterDrop from '../../assets/icons/water_drop.svg';
import SoilMoisture from '../../assets/icons/soil-moisture.svg';
import CloudSun from '../../assets/icons/cloud-sun.svg';
import Thermometer from '../../assets/icons/thermometer-half.svg';
import Power from '../../assets/icons/power.svg';
import Water from '../../assets/icons/water.svg';
import Seta from '../../assets/icons/keyboard_arrow_right.svg';

const InitialPageScreen = () => {
  const [switchIrrigationMode, setSwitchIrrigationMode] = useState(false);
  const [switchPauseRain, setSwitchPauseRain] = useState(false);
  const [switchMinHumidity, setSwitchMinHumidity] = useState(false);
  const [switchNotifications, setSwitchNotifications] = useState(false);

  const [soilMoisture, setSoilMoisture] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [weather, setWeather] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');

  const [bombaLigada, setBombaLigada] = useState<boolean | null>(null);
  const [loadingBomba, setLoadingBomba] = useState(false);
  const [loadingSensores, setLoadingSensores] = useState(false);
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      const modoAuto = await AsyncStorage.getItem('modoAuto');
      const chuva = await AsyncStorage.getItem('pausarChuva');
      const umidade = await AsyncStorage.getItem('umidadeMin');
      const notificacoes = await AsyncStorage.getItem('notificacoes');

      setSwitchIrrigationMode(modoAuto === 'true');
      setSwitchPauseRain(chuva === 'true');
      setSwitchMinHumidity(umidade === 'true');
      setSwitchNotifications(notificacoes === 'true');
    };

    carregarConfiguracoes();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('modoAuto', switchIrrigationMode.toString());
  }, [switchIrrigationMode]);

  useEffect(() => {
    AsyncStorage.setItem('pausarChuva', switchPauseRain.toString());
  }, [switchPauseRain]);

  useEffect(() => {
    AsyncStorage.setItem('umidadeMin', switchMinHumidity.toString());
  }, [switchMinHumidity]);

  useEffect(() => {
    AsyncStorage.setItem('notificacoes', switchNotifications.toString());
  }, [switchNotifications]);

  const fetchSensorData = async () => {
    try {
      setLoadingSensores(true);
      setSensorError(null);
      const response = await fetch('http://192.168.0.100/sensor');
      const data = await response.json();
      setSoilMoisture(data.soilMoisture);
      setTemperature(data.temperature);
      setWeather(data.weather);
      setLastUpdate(
        new Date().toLocaleString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
    } catch (error) {
      setSensorError('Erro ao buscar dados dos sensores');
    } finally {
      setLoadingSensores(false);
      setRefreshing(false);
    }
  };

  const fetchEstadoBomba = async () => {
    try {
      const response = await fetch('http://192.168.0.100/bomba');
      const data = await response.json();
      setBombaLigada(data.ligada);
    } catch (error) {}
  };

  const checkConexao = async () => {
    try {
      const response = await fetch('http://192.168.0.100/ping');
      setIsOnline(response.ok);
    } catch (error) {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    fetchEstadoBomba();
    checkConexao();
    const interval = setInterval(() => {
      fetchSensorData();
      checkConexao();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      switchIrrigationMode &&
      soilMoisture !== null &&
      soilMoisture < 40 &&
      bombaLigada === false
    ) {
      toggleBomba();
    }
  }, [soilMoisture, switchIrrigationMode]);

  useEffect(() => {
    if (
      switchPauseRain &&
      weather.toLowerCase().includes('chuva') &&
      bombaLigada === true
    ) {
      toggleBomba();
    }
  }, [weather, switchPauseRain]);

  useEffect(() => {
    if (switchNotifications && bombaLigada !== null) {
      Alert.alert(
        'Status da Bomba',
        bombaLigada ? 'A bomba foi ligada.' : 'A bomba foi desligada.'
      );
    }
  }, [bombaLigada]);

  const toggleBomba = async () => {
    if (bombaLigada === null) return;
    try {
      setLoadingBomba(true);
      const url = `http://192.168.0.100/bomba/${bombaLigada ? 'desligar' : 'ligar'}`;
      await fetch(url, { method: 'POST' });
      setBombaLigada(!bombaLigada);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar o estado da bomba.');
    } finally {
      setLoadingBomba(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSensorData();
    fetchEstadoBomba();
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.dashboard}>
        <Text style={styles.dashboardText}>DASHBOARD</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <WifiIcon width={24} height={24} />
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginLeft: 5,
              backgroundColor: isOnline ? 'green' : 'red',
            }}
          />
        </View>
      </View>

      <Text style={{ fontSize: 12, color: 'gray', marginBottom: 5 }}>
        Conexão: {isOnline ? 'Conectado' : 'Desconectado'}
      </Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status Atual</Text>
        <View style={styles.irrigationInfo}>
          <TouchableOpacity style={styles.iconContainer}>
            <WaterDrop width={50} height={50} fill="#ffffff" />
          </TouchableOpacity>
          <View style={styles.irrigationDetails}>
            <Text style={styles.titleIrrigation}>
              {bombaLigada === null
                ? 'Carregando...'
                : bombaLigada
                ? 'IRRIGAÇÃO LIGADA'
                : 'IRRIGAÇÃO DESLIGADA'}
            </Text>
            <Text style={styles.zoneText}>Zona 1</Text>
            <Text style={styles.lastUpdateText}>
              Última atualização: {lastUpdate || '--/--/---- --:--'}
            </Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};
const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
  },
  dashboardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    width: '95%',
    borderRadius: 13,
    display: 'flex',
    backgroundColor: '#F6F6F6',
  },
  statusText: {
    paddingTop: 10,
    paddingLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  irrigationInfo: {
    padding: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#296C32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  irrigationDetails: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  titleIrrigation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
  },
  zoneText: {
    fontSize: 16,
    color: '#000000',
  },
  lastUpdateText: {
    fontSize: 14,
    color: '#555',
  },
  complements: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    paddingLeft: 30,
    paddingRight: 30,
  },
  umidade: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    marginRight: 10,
  },
  umidadeText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
  },
  previsao: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    marginRight: 10,
  },
  previsaoText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'center',
  },
  umidadeValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '700',
  },
  temperatura: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 9,
    borderRadius: 10,
    width: '30%',
  },
  temperaturaText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  temperaturaValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '700',
  },
  manualIrrigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#296C32',
    padding: 15,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 10,
    marginTop: 20,
    gap: 15,
  },
  manualIrrigationText: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  ZonesIrrigationContainer: {
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '90%',
  },
  ZonesHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ZonesIrrigationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  ZonesIrrigationQuantity: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ZonesCaracteristics: {
    marginTop: 10,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    alignItems: 'center',
  },
  ZonesCaracteristicsTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  Atalho: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conectividade: {
    backgroundColor: '#f8f8f8',
    width: '85%',
    borderRadius: 12,
    marginTop: 20,
    padding: 10,
  },
  conectHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conectTouchable: {
    fontSize: 15,
    color: 'gray',
  },
  conecTitle: {
    marginTop: 5,
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 22,
  },
  conectAtributes: {
    fontSize: 16,
    marginTop: 10,
    marginLeft: 5,
  },
});

export default InitialPageScreen;
