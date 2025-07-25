import React, {useState, useEffect, useCallback} from 'react';
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
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import z from 'zod';

import { 
  sensorDataSchema, 
  bombaStateSchema, 
  configSchema, 
  zoneSchema,
  safeParse 
} from '../controllers/zodSchema'; 

import WifiIcon from '../../assets/icons/wifi.svg';
import WaterDrop from '../../assets/icons/water_drop.svg';
import SoilMoisture from '../../assets/icons/soil-moisture.svg';
import CloudSun from '../../assets/icons/cloud-sun.svg';
import Thermometer from '../../assets/icons/thermometer-half.svg';
import Power from '../../assets/icons/power.svg';
import Water from '../../assets/icons/water.svg';

import {useZones} from '../contexts/ZonesContext';
import {useAuth} from '../contexts/AuthContext';

const {width} = Dimensions.get('window');
const CARD_MARGIN = 8;
const CONTAINER_PADDING = 16;
const CARDS_PER_ROW = 3;
const ZONE_CARD_WIDTH =
  (width - CONTAINER_PADDING * 2 - CARD_MARGIN * (CARDS_PER_ROW - 1) * 2) /
  CARDS_PER_ROW;

const MIN_UMIDADE = 40;

const InitialPageScreen = () => {
  const {zones, isLoading: loadingZones, error: errorZones} = useZones();
  const {user} = useAuth();

  const userZones = zones ? safeParse(z.array(zoneSchema), zones) ?? [] : [];

  const [switchIrrigationMode, setSwitchIrrigationMode] = useState(false);
  const [switchPauseRain, setSwitchPauseRain] = useState(false);
  const [switchMinHumidity, setSwitchMinHumidity] = useState(false);
  const [switchNotifications, setSwitchNotifications] = useState(false);

  const [soilMoisture, setSoilMoisture] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
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
      try {
        const modoAuto = await AsyncStorage.getItem('modoAuto');
        const chuva = await AsyncStorage.getItem('pausarChuva');
        const umidade = await AsyncStorage.getItem('umidadeMin');
        const notificacoes = await AsyncStorage.getItem('notificacoes');

        const config = safeParse(configSchema, {
          modoAuto: modoAuto === 'true',
          pausarChuva: chuva === 'true',
          umidadeMin: umidade === 'true',
          notificacoes: notificacoes === 'true',
        });

        if (config) {
          setSwitchIrrigationMode(config.modoAuto);
          setSwitchPauseRain(config.pausarChuva);
          setSwitchMinHumidity(config.umidadeMin);
          setSwitchNotifications(config.notificacoes);
        }
      } catch (e) {
        console.warn('Erro ao carregar configurações:', e);
      }
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

 const fetchSensorData = useCallback(async () => {
    try {
      setLoadingSensores(true);
      setSensorError(null);

      const response = await fetch('http://192.168.0.100/sensor');
      if (!response.ok) throw new Error('Resposta do sensor inválida');

      const data = await response.json();
      const validatedData = safeParse(sensorDataSchema, data);

      if (!validatedData) {
        throw new Error('Dados do sensor inválidos');
      }

      setSoilMoisture(validatedData.soilMoisture);
      setTemperature(validatedData.temperature);
      setWeather(validatedData.weather);
      setLastUpdate(
        new Date().toLocaleString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      );
    } catch (error) {
      setSensorError('Erro ao buscar dados dos sensores');
      setSoilMoisture(null);
      setTemperature(null);
      setWeather('');
    } finally {
      setLoadingSensores(false);
      setRefreshing(false);
    }
  }, []);

  const fetchEstadoBomba = useCallback(async () => {
    try {
      const response = await fetch('http://192.168.0.100/bomba');
      if (!response.ok) throw new Error('Resposta da bomba inválida');

      const data = await response.json();
      const validatedData = safeParse(bombaStateSchema, data);

      if (!validatedData) {
        throw new Error('Dados da bomba inválidos');
      }

      setBombaLigada(validatedData.ligada);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter o estado da bomba.');
      setBombaLigada(null);
    }
  }, []);

  const checkConexao = useCallback(async () => {
    try {
      const response = await fetch('http://192.168.0.100/ping');
      setIsOnline(response.ok);
    } catch (error) {
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    fetchSensorData();
    fetchEstadoBomba();
    checkConexao();
    const interval = setInterval(() => {
      fetchSensorData();
      fetchEstadoBomba();
      checkConexao();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchSensorData, fetchEstadoBomba, checkConexao]);

  useEffect(() => {
    const automatizarIrrigacao = async () => {
      if (!switchIrrigationMode) return;
      if (
        soilMoisture === null ||
        weather === '' ||
        bombaLigada === null ||
        loadingBomba
      )
        return;
      if (!isOnline) return;

      if (
        switchPauseRain &&
        weather.toLowerCase().includes('chuva') &&
        bombaLigada
      ) {
        await toggleBomba(false);
        if (switchNotifications)
          Alert.alert('Automação', 'Irrigação pausada por causa da chuva.');
        return;
      }

      if (switchMinHumidity && soilMoisture >= MIN_UMIDADE && bombaLigada) {
        await toggleBomba(false);
        if (switchNotifications)
          Alert.alert('Automação', 'Irrigação desligada - umidade suficiente.');
        return;
      }

      if (soilMoisture < MIN_UMIDADE && !bombaLigada) {
        await toggleBomba(true);
        if (switchNotifications)
          Alert.alert('Automação', 'Irrigação ligada - umidade baixa.');
        return;
      }
    };
    automatizarIrrigacao();
  }, [
    switchIrrigationMode,
    switchPauseRain,
    switchMinHumidity,
    soilMoisture,
    weather,
    bombaLigada,
    isOnline,
    loadingBomba,
    switchNotifications,
  ]);

  const toggleBomba = useCallback(
    async (forcarEstado?: boolean) => {
      if (bombaLigada === null && forcarEstado === undefined) return;

      const novoEstado = forcarEstado ?? !bombaLigada;

      if (!isOnline) {
        Alert.alert(
          'Erro',
          'Dispositivo offline. Não é possível alterar a bomba.',
        );
        return;
      }
      try {
        setLoadingBomba(true);
        const url = `http://192.168.0.100/bomba/${
          novoEstado ? 'ligar' : 'desligar'
        }`;
        const response = await fetch(url, {method: 'POST'});
        if (!response.ok) throw new Error('Falha na requisição');
        await fetchEstadoBomba();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível alterar o estado da bomba.');
      } finally {
        setLoadingBomba(false);
      }
    },
    [bombaLigada, fetchEstadoBomba, isOnline],
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSensorData();
    fetchEstadoBomba();
    checkConexao();
  };

  if (loadingZones) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#296C32" />
        <Text>Carregando zonas...</Text>
      </View>
    );
  }

  if (errorZones) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red', fontWeight: 'bold'}}>
          Erro ao carregar zonas
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.dashboard}>
        <Text style={styles.dashboardText}>DASHBOARD</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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

      <Text style={{fontSize: 12, color: 'gray', marginBottom: 5}}>
        Conexão: {isOnline ? 'Conectado' : 'Desconectado'}
      </Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status Atual</Text>
        <View style={styles.irrigationInfo}>
          <TouchableOpacity
            style={[
              styles.iconContainer,
              !isOnline && {backgroundColor: '#999'},
            ]}
            onPress={() => toggleBomba()}
            disabled={loadingBomba || bombaLigada === null || !isOnline}>
            {loadingBomba ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <WaterDrop width={40} height={40} />
            )}
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

      {sensorError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{sensorError}</Text>
        </View>
      )}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <SoilMoisture width={30} height={30} />
          <Text style={styles.cardLabel}>Umidade</Text>
          <Text style={styles.cardValue}>
            {soilMoisture !== null ? soilMoisture + '%' : '--'}
          </Text>
        </View>
        <View style={styles.card}>
          <Thermometer width={30} height={30} />
          <Text style={styles.cardLabel}>Temperatura</Text>
          <Text style={styles.cardValue}>
            {temperature !== null ? temperature + ' °C' : '--'}
          </Text>
        </View>
        <View style={styles.card}>
          <CloudSun width={30} height={30} />
          <Text style={styles.cardLabel}>Clima</Text>
          <Text style={styles.cardValue}>{weather || '--'}</Text>
        </View>
      </View>

      <View style={styles.manualContainer}>
        <TouchableOpacity
          style={[
            styles.manualButton,
            (!isOnline || loadingBomba || bombaLigada === null) && {
              backgroundColor: '#999',
            },
          ]}
          onPress={() => toggleBomba()}
          disabled={loadingBomba || bombaLigada === null || !isOnline}>
          {loadingBomba ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Power width={30} height={30} color="#fff" />
              <Text style={styles.manualText}>
                {bombaLigada ? 'DESLIGAR IRRIGAÇÃO' : 'LIGAR IRRIGAÇÃO'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.zonasContainer, {paddingHorizontal: CARD_MARGIN}]}>
        {Array.isArray(userZones) && userZones.length > 0 ? (
          <View style={styles.zonasGrid}>
            {userZones.map(zona => (
              <View
                key={zona.id}
                style={[
                  styles.zonaCard,
                  {
                    width: ZONE_CARD_WIDTH,
                    margin: CARD_MARGIN,
                  },
                ]}>
                <Text style={styles.zonaNome}>{zona.name}</Text>
                <Water width={30} height={30} color="#296C32" />
                <Text
                  style={[
                    styles.statusTextZona,
                    {color: zona.status === 'active' ? '#296C32' : '#cc4444'},
                  ]}>
                  {zona.status === 'active' ? 'Ligada' : 'Desligada'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noZonesText}>Nenhuma zona cadastrada.</Text>
        )}
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>Conectividade & Configurações</Text>

        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Modo de Irrigação</Text>
          <Switch
            value={switchIrrigationMode}
            onValueChange={setSwitchIrrigationMode}
            thumbColor={switchIrrigationMode ? '#296C32' : '#ccc'}
            trackColor={{false: '#ddd', true: '#a4d7a7'}}
          />
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Pausar se chover</Text>
          <Switch
            value={switchPauseRain}
            onValueChange={setSwitchPauseRain}
            thumbColor={switchPauseRain ? '#296C32' : '#ccc'}
            trackColor={{false: '#ddd', true: '#a4d7a7'}}
            disabled={!switchIrrigationMode}
          />
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Umidade mínima (40%)</Text>
          <Switch
            value={switchMinHumidity}
            onValueChange={setSwitchMinHumidity}
            thumbColor={switchMinHumidity ? '#296C32' : '#ccc'}
            trackColor={{false: '#ddd', true: '#a4d7a7'}}
            disabled={!switchIrrigationMode}
          />
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Notificações</Text>
          <Switch
            value={switchNotifications}
            onValueChange={setSwitchNotifications}
            thumbColor={switchNotifications ? '#296C32' : '#ccc'}
            trackColor={{false: '#ddd', true: '#a4d7a7'}}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingBottom: 30,
  },
  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 20,
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
    backgroundColor: '#F6F6F6',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
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
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    marginTop: 5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },

  zonasContainer: {
    width: '100%',
    paddingHorizontal: CONTAINER_PADDING,
    alignItems: 'center',
  },
  zonasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -CARD_MARGIN,
  },
  zonaCard: {
    width: ZONE_CARD_WIDTH,
    marginLeft: CARD_MARGIN,
    marginBottom: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  zonaNome: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  statusTextZona: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
  },
  noZonesText: {
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
    width: '100%',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  cardContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  manualContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    marginTop: 20,
  },
  manualButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#296C32',
    paddingVertical: 20,
    paddingHorizontal: 75,
    borderRadius: 10,
    width: '95%',
    gap: 10,
  },
  manualText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  zonaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderRadius: 10,
    padding: 12,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#721c24',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },

  errorText: {
    color: '#721c24',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default InitialPageScreen;
