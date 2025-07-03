import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Seta from '../../assets/icons/chevron-right.svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SwitchKey =
  | 'chuvaAtual'
  | 'previsaoChuva'
  | 'umidadeMinima'
  | 'ventoForte'
  | 'notificacaoChuva'
  | 'notificacaoErro'
  | 'notificacaoStatus'
  | 'somPersonalizado'
  | 'modoSilencioso'
  | 'biometria'
  | 'modoOffline';

const SettingsScreen = () => {
  const [switches, setSwitches] = useState<Record<SwitchKey, boolean>>({
    chuvaAtual: false,
    previsaoChuva: false,
    umidadeMinima: false,
    ventoForte: false,
    notificacaoChuva: false,
    notificacaoErro: false,
    notificacaoStatus: false,
    somPersonalizado: false,
    modoSilencioso: false,
    biometria: false,
    modoOffline: false,
  });

  const toggleSwitch = (key: SwitchKey) => {
    setSwitches(prev => ({...prev, [key]: !prev[key]}));
  };

  const renderSwitchRow = (icon: string, label: string, key: SwitchKey) => (
    <View style={styles.row} key={key}>
      <View style={styles.iconLabel}>
        <Icon name={icon} size={20} color="#276C32" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Switch
        value={switches[key]}
        onValueChange={() => toggleSwitch(key)}
        trackColor={{false: '#767577', true: '#276C32'}}
        thumbColor={switches[key] ? '#fff' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        style={styles.switch}
      />
    </View>
  );

  const renderButtonRow = (icon: string, label: string) => (
    <TouchableOpacity style={styles.row} key={label}>
      <View style={styles.iconLabel}>
        <Icon name={icon} size={20} color="#276C32" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Seta width={20} height={20} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>CONFIGURAÇÕES</Text>

      <Text style={styles.subSectionTitle}>Parâmetros Climáticos</Text>
      <View style={styles.card}>
        {renderSwitchRow(
          'weather-rainy',
          'Pausar se estiver chovendo',
          'chuvaAtual',
        )}
        {renderSwitchRow(
          'weather-cloudy-clock',
          'Pausar se tiver previsão de chuva',
          'previsaoChuva',
        )}
        {renderSwitchRow(
          'water-percent',
          'Umidade mínima de 40%',
          'umidadeMinima',
        )}
        {renderSwitchRow(
          'weather-windy',
          'Pausar baseado em vento forte',
          'ventoForte',
        )}
      </View>

      <Text style={styles.subSectionTitle}>Automação Avançada</Text>
      <View style={styles.card}>
        {renderButtonRow('clock-outline', 'Horários personalizados')}
        {renderButtonRow('timer-sand', 'Tempo mínimo entre ciclos')}
        {renderButtonRow('robot', 'Agendamento inteligente')}
      </View>

      <Text style={styles.subSectionTitle}>Conectividade</Text>
      <View style={styles.card}>
        {renderButtonRow('wifi-cog', 'Reconfigurar Wi-Fi')}
        {renderButtonRow('update', 'Atualizar firmware')}
        {renderSwitchRow('wifi-off', 'Modo offline', 'modoOffline')}
        {renderButtonRow('server-sync', 'Sincronizar com servidor')}
      </View>

      <Text style={styles.subSectionTitle}>Notificações</Text>
      <View style={styles.card}>
        {renderSwitchRow(
          'weather-pouring',
          'Previsão de chuva',
          'notificacaoChuva',
        )}
        {renderSwitchRow(
          'alert-circle-outline',
          'Falha na conexão',
          'notificacaoErro',
        )}
        {renderSwitchRow(
          'water-pump',
          'Irrigação iniciada/interrompida',
          'notificacaoStatus',
        )}
        {renderSwitchRow(
          'music-note',
          'Som de notificação personalizado',
          'somPersonalizado',
        )}
        {renderSwitchRow(
          'bell-off-outline',
          'Modo silencioso',
          'modoSilencioso',
        )}
      </View>

      <Text style={styles.subSectionTitle}>Segurança</Text>
      <View style={styles.card}>
        {renderButtonRow('account-multiple', 'Controle de usuários')}
        {renderButtonRow('lock-reset', 'Alterar senha')}
        {renderSwitchRow(
          'fingerprint',
          'Autenticação por biometria',
          'biometria',
        )}
        {renderButtonRow('file-document-outline', 'Logs de acesso')}
      </View>

      <Text style={styles.subSectionTitle}>Integrações</Text>
      <View style={styles.card}>
        {renderButtonRow('home-assistant', 'Google Home / Alexa')}
        {renderButtonRow('file-export-outline', 'Exportar para PDF')}
        {renderButtonRow('cloud-download-outline', 'API de previsão')}
      </View>

      <Text style={styles.subSectionTitle}>Dados e Backup</Text>
      <View style={styles.card}>
        {renderButtonRow('cloud-upload-outline', 'Backup manual')}
        {renderButtonRow('restore', 'Restauração de dados')}
        {renderButtonRow('delete-outline', 'Limpar cache')}
        {renderButtonRow('file-export', 'Exportar histórico')}
      </View>

      <Text style={styles.subSectionTitle}>Teste e Diagnóstico</Text>
      <View style={styles.card}>
        {renderButtonRow('shower-head', 'Testar irrigação')}
        {renderButtonRow('access-point-network', 'Diagnóstico do sistema')}
        {renderButtonRow('restart', 'Reiniciar sistema')}
      </View>

      <Text style={styles.subSectionTitle}>Extras</Text>
      <View style={styles.card}>
        {renderButtonRow('information-outline', 'Versão do app')}
        {renderButtonRow('email-outline', 'Enviar feedback')}
        {renderButtonRow('file-lock-outline', 'Termos de uso e privacidade')}
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width:'100%'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  card: {
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 15,
  },
  switch: {
    transform: [{scaleX: 1.2}, {scaleY: 1.2}],
  },
  icon: {
    marginRight: 10,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
