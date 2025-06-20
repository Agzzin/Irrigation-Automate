import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Water from '../../assets/icons/droplet.svg';
import AddCircle from '../../assets/icons/add-circle.svg';
import CheckBox from '@react-native-community/checkbox';

type Programacao = {
  nome: string;
  zonas: string[];
  dias: string[];
  horarioInicio: string;
  duracao: string;
  pausarComChuva: boolean;
};

const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

const ProgrammingScreen = () => {
  const [nomeProg, setNomeProg] = useState('');
  const [selectedZones, setSelectedZones] = useState({
    zona1: false,
    zona2: false,
    zona3: false,
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');
  const [pauseOnRain, setPauseOnRain] = useState(false);
  const [programacoesAtivas, setProgramacoesAtivas] = useState<Programacao[]>(
    [],
  );

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const handleSave = () => {
    const zonasSelecionadas = Object.entries(selectedZones)
      .filter(([_, val]) => val)
      .map(([zona]) => zona);

    if (
      !nomeProg ||
      zonasSelecionadas.length === 0 ||
      selectedDays.length === 0 ||
      !startTime ||
      !duration
    ) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const novaProg: Programacao = {
      nome: nomeProg,
      zonas: zonasSelecionadas,
      dias: selectedDays,
      horarioInicio: startTime,
      duracao: duration,
      pausarComChuva: pauseOnRain,
    };

    setProgramacoesAtivas(prev => [...prev, novaProg]);
    Alert.alert('Sucesso', 'Programação salva com sucesso!');
    handleCancel();
  };

  const handleCancel = () => {
    setNomeProg('');
    setSelectedZones({zona1: false, zona2: false, zona3: false});
    setSelectedDays([]);
    setStartTime('');
    setDuration('');
    setPauseOnRain(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PROGRAMAÇÕES</Text>
      </View>

      <View style={styles.containerAtivas}>
        <Text style={styles.ativasText}>Programações Ativas</Text>
        {programacoesAtivas.map((prog, index) => (
          <View key={index} style={styles.cardZona}>
            <View style={styles.iconeZona}>
              <Water width={30} height={30} color="#ffffff" />
            </View>
            <View style={styles.infoZona}>
              <Text style={styles.tituloZona}>{prog.nome}</Text>
              <View style={styles.infoLinha}>
                <Text style={styles.textoDias}>{prog.dias.join(', ')}</Text>
                <Text style={styles.textoDuracao}>{prog.duracao}</Text>
                <View style={styles.switchArea}>
                  <Switch
                    value={true}
                    disabled
                    trackColor={{false: '#767577', true: '#276C32'}}
                    thumbColor={'#fff'}
                    ios_backgroundColor="#3e3e3e"
                    style={styles.switch}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.botaoNovaProg}>
          <AddCircle width={25} height={25} />
          <Text style={styles.textoNovaProg}>Nova Programação</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitulo}>Nova Programação</Text>

        <View style={styles.formBox}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome da programação"
            value={nomeProg}
            onChangeText={setNomeProg}
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Zonas</Text>
          <View style={styles.checkboxContainer}>
            {Object.keys(selectedZones).map((zona, index) => (
              <View key={index} style={styles.checkboxItem}>
                <CheckBox
                  value={selectedZones[zona as keyof typeof selectedZones]}
                  onValueChange={val =>
                    setSelectedZones(prev => ({...prev, [zona]: val}))
                  }
                  tintColors={{true: '#00f', false: '#aaa'}}
                />
                <Text style={styles.checkboxLabel}>{zona}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.label}>Dias da semana</Text>
          <View style={styles.diasContainer}>
            {diasDaSemana.map((dia, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.diaBotao,
                  selectedDays.includes(dia) && styles.diaSelecionado,
                ]}
                onPress={() => toggleDay(dia)}>
                <Text style={styles.diaTexto}>{dia}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.horariosRow}>
            <Text style={styles.label}>Horário de Início</Text>
            <Text style={styles.label}>Duração</Text>
          </View>

          <View style={styles.horariosRow}>
            <TextInput
              style={styles.inputMenor}
              placeholder="Ex: 06:00"
              value={startTime}
              onChangeText={setStartTime}
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.inputMenor}
              placeholder="Ex: 15 min"
              value={duration}
              onChangeText={setDuration}
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              Pausar se tiver previsão de chuva
            </Text>
            <Switch
              value={pauseOnRain}
              onValueChange={setPauseOnRain}
              trackColor={{false: '#767577', true: '#276C32'}}
              thumbColor={pauseOnRain ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              style={styles.switch}
            />
          </View>

          <View style={styles.botoesRow}>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={handleCancel}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoSalvar} onPress={handleSave}>
              <Text style={styles.textoSalvar}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0'},
  header: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderBottomWidth: 0.2,
    borderColor: 'gray',
  },
  headerText: {fontSize: 20, fontWeight: 'bold'},

  containerAtivas: {padding: 20},
  ativasText: {fontSize: 18, fontWeight: '700', paddingBottom: 10},
  cardZona: {
    flexDirection: 'row',
    borderWidth: 0.2,
    borderColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  iconeZona: {
    backgroundColor: '#296C32',
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  infoZona: {marginLeft: 20, flex: 1},
  tituloZona: {fontWeight: '800', fontSize: 20},
  infoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'space-between',
  },
  textoDias: {fontSize: 16, fontWeight: '500'},
  textoDuracao: {fontSize: 16, fontWeight: '500'},
  switchArea: {},
  switch: {transform: [{scaleX: 1.2}, {scaleY: 1.2}]},

  botaoNovaProg: {
    flexDirection: 'row',
    backgroundColor: '#296C32',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
    marginTop: 15,
  },
  textoNovaProg: {fontSize: 18, color: '#ffffff'},

  formContainer: {marginTop: 25, paddingHorizontal: 20},
  formTitulo: {fontSize: 20, fontWeight: 'bold'},
  formBox: {
    borderWidth: 0.2,
    borderColor: 'gray',
    borderRadius: 10,
    marginTop: 15,
    padding: 15,
    backgroundColor: '#fff',
  },
  label: {fontSize: 16, fontWeight: '500', marginBottom: 5},
  input: {
    borderWidth: 0.3,
    borderRadius: 10,
    borderColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 10,
  },
  checkboxItem: {flexDirection: 'row', alignItems: 'center', marginRight: 15},
  checkboxLabel: {fontSize: 16, fontWeight: '500'},

  diasContainer: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10},
  diaBotao: {
    backgroundColor: '#296C32',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    margin: 4,
  },
  diaSelecionado: {backgroundColor: '#1e4d24'},
  diaTexto: {color: '#ffffff'},

  horariosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputMenor: {
    borderWidth: 0.3,
    borderColor: 'gray',
    borderRadius: 10,
    width: '48%',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  switchLabel: {fontSize: 16, fontWeight: '400'},

  botoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  botaoCancelar: {
    width: '48%',
    borderWidth: 0.3,
    borderColor: 'gray',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  textoCancelar: {fontWeight: 'bold', fontSize: 17},
  botaoSalvar: {
    width: '48%',
    backgroundColor: '#296C32',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  textoSalvar: {fontWeight: 'bold', fontSize: 17, color: '#ffffff'},
});

export default ProgrammingScreen;
