import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Water from '../../assets/icons/droplet.svg';
import AddCircle from '../../assets/icons/add-circle.svg';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Programacao = {
  nome: string;
  zonas: string[];
  dias: string[];
  horarioInicio: string;
  duracao: string;
  pausarComChuva: boolean;
};

const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

const STORAGE_KEY = '@programacoes_ativas';

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
  const [formVisible, setFormVisible] = useState(false);

  
  const [editIndex, setEditIndex] = useState<number | null>(null);


  const [errorNome, setErrorNome] = useState('');
  const [errorZones, setErrorZones] = useState('');
  const [errorDays, setErrorDays] = useState('');
  const [errorStartTime, setErrorStartTime] = useState('');
  const [errorDuration, setErrorDuration] = useState('');

  
  useEffect(() => {
    const loadProgramacoes = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProgramacoesAtivas(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Erro ao carregar programações', e);
      }
    };
    loadProgramacoes();
  }, []);

 
  useEffect(() => {
    const saveProgramacoes = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(programacoesAtivas),
        );
      } catch (e) {
        console.warn('Erro ao salvar programações', e);
      }
    };
    saveProgramacoes();
  }, [programacoesAtivas]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const validarFormulario = () => {
    let valid = true;
    setErrorNome('');
    setErrorZones('');
    setErrorDays('');
    setErrorStartTime('');
    setErrorDuration('');

    if (!nomeProg.trim()) {
      setErrorNome('O nome é obrigatório.');
      valid = false;
    }

    const zonasSelecionadas = Object.entries(selectedZones)
      .filter(([_, val]) => val)
      .map(([zona]) => zona);
    if (zonasSelecionadas.length === 0) {
      setErrorZones('Selecione pelo menos uma zona.');
      valid = false;
    }

    if (selectedDays.length === 0) {
      setErrorDays('Selecione pelo menos um dia.');
      valid = false;
    }

    
    if (!startTime.match(/^([01]\d|2[0-3]):([0-5]\d)$/)) {
      setErrorStartTime('Informe um horário válido (HH:mm).');
      valid = false;
    }

    
    const dur = parseInt(duration, 10);
    if (isNaN(dur) || dur <= 0) {
      setErrorDuration('Informe uma duração válida (minutos).');
      valid = false;
    }

    return valid;
  };

  const handleSave = () => {
    if (!validarFormulario()) return;

    const zonasSelecionadas = Object.entries(selectedZones)
      .filter(([_, val]) => val)
      .map(([zona]) => zona);

    const novaProg: Programacao = {
      nome: nomeProg.trim(),
      zonas: zonasSelecionadas,
      dias: selectedDays,
      horarioInicio: startTime,
      duracao: duration,
      pausarComChuva: pauseOnRain,
    };

    if (editIndex !== null) {
      setProgramacoesAtivas(prev => {
        const copy = [...prev];
        copy[editIndex] = novaProg;
        return copy;
      });
      Alert.alert('Sucesso', 'Programação atualizada com sucesso!');
    } else {
      setProgramacoesAtivas(prev => [...prev, novaProg]);
      Alert.alert('Sucesso', 'Programação salva com sucesso!');
    }
    handleCancel(true);
  };

  const handleCancel = (skipConfirm = false) => {
    if (
      !skipConfirm &&
      (nomeProg ||
        Object.values(selectedZones).some(v => v) ||
        selectedDays.length > 0 ||
        startTime ||
        duration ||
        pauseOnRain)
    ) {
      Alert.alert(
        'Confirmar',
        'Tem certeza que deseja cancelar? Os dados preenchidos serão perdidos.',
        [
          {text: 'Não', style: 'cancel'},
          {text: 'Sim', onPress: () => limparFormulario()},
        ],
      );
    } else {
      limparFormulario();
    }
  };

  const limparFormulario = () => {
    setNomeProg('');
    setSelectedZones({zona1: false, zona2: false, zona3: false});
    setSelectedDays([]);
    setStartTime('');
    setDuration('');
    setPauseOnRain(false);
    setErrorNome('');
    setErrorZones('');
    setErrorDays('');
    setErrorStartTime('');
    setErrorDuration('');
    setFormVisible(false);
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta programação?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setProgramacoesAtivas(prev => prev.filter((_, i) => i !== index));
           
            if (editIndex === index) limparFormulario();
          },
        },
      ],
    );
  };

  const handleEdit = (index: number) => {
    const prog = programacoesAtivas[index];
    setNomeProg(prog.nome);
    setSelectedZones({
      zona1: prog.zonas.includes('zona1'),
      zona2: prog.zonas.includes('zona2'),
      zona3: prog.zonas.includes('zona3'),
    });
    setSelectedDays(prog.dias);
    setStartTime(prog.horarioInicio);
    setDuration(prog.duracao);
    setPauseOnRain(prog.pausarComChuva);
    setFormVisible(true);
    setEditIndex(index);
  };

  const renderItem = ({item, index}: {item: Programacao; index: number}) => (
    <TouchableOpacity
      style={styles.cardZona}
      onPress={() => handleEdit(index)}
      activeOpacity={0.7}>
      <View style={styles.iconeZona}>
        <Water width={30} height={30} color="#ffffff" />
      </View>
      <View style={styles.infoZona}>
        <Text style={styles.tituloZona}>{item.nome}</Text>
        <View style={styles.infoLinha}>
          <Text style={styles.textoDias}>{item.dias.join(', ')}</Text>
          <Text style={styles.textoDuracao}>{item.duracao} min</Text>
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
        <TouchableOpacity
          style={styles.botaoExcluir}
          onPress={() => handleDelete(index)}>
          <Icon name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#f0f0f0'}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>PROGRAMAÇÕES</Text>
        </View>

        <View style={styles.containerAtivas}>
          <Text style={styles.ativasText}>Programações Ativas</Text>

          {programacoesAtivas.length === 0 && (
            <Text style={{textAlign: 'center', marginTop: 20, color: '#555'}}>
              Nenhuma programação cadastrada.
            </Text>
          )}

          <FlatList
            data={programacoesAtivas}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />

          <TouchableOpacity
            style={styles.botaoNovaProg}
            onPress={() => setFormVisible(true)}>
            <AddCircle width={25} height={25} />
            <Text style={styles.textoNovaProg}>Nova Programação</Text>
          </TouchableOpacity>
        </View>

        {formVisible && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitulo}>
              {editIndex !== null ? 'Editar Programação' : 'Nova Programação'}
            </Text>

            <View style={styles.formBox}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={[styles.input, errorNome ? styles.inputError : null]}
                placeholder="Nome da programação"
                value={nomeProg}
                onChangeText={setNomeProg}
                placeholderTextColor="#888"
              />
              {!!errorNome && <Text style={styles.errorText}>{errorNome}</Text>}

              <Text style={styles.label}>Zonas</Text>
              <View style={styles.checkboxContainer}>
                {Object.keys(selectedZones).map((zona, index) => (
                  <View key={index} style={styles.checkboxItem}>
                    <CheckBox
                      value={selectedZones[zona as keyof typeof selectedZones]}
                      onValueChange={val =>
                        setSelectedZones(prev => ({...prev, [zona]: val}))
                      }
                      tintColors={{true: '#276C32', false: '#aaa'}}
                    />
                    <Text style={styles.checkboxLabel}>{zona}</Text>
                  </View>
                ))}
              </View>
              {!!errorZones && (
                <Text style={styles.errorText}>{errorZones}</Text>
              )}

              <Text style={styles.label}>Dias da semana</Text>
              <View style={styles.diasContainer}>
                {diasDaSemana.map((dia, index) => {
                  const selected = selectedDays.includes(dia);
                  return (
                    <Pressable
                      key={index}
                      style={[
                        styles.diaBotao,
                        selected && styles.diaSelecionado,
                      ]}
                      onPress={() => toggleDay(dia)}
                      android_ripple={{color: '#1e4d24'}}
                      accessibilityRole="button"
                      accessibilityState={{selected}}>
                      <Text style={styles.diaTexto}>{dia}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {!!errorDays && <Text style={styles.errorText}>{errorDays}</Text>}

              <View style={styles.horariosRow}>
                <View style={{flex: 1, marginRight: 5}}>
                  <Text style={styles.label}>Horário de Início</Text>
                  <TextInput
                    style={[
                      styles.inputMenor,
                      errorStartTime ? styles.inputError : null,
                    ]}
                    placeholder="Ex: 06:00"
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  {!!errorStartTime && (
                    <Text style={styles.errorText}>{errorStartTime}</Text>
                  )}
                </View>

                <View style={{flex: 1, marginLeft: 5}}>
                  <Text style={styles.label}>Duração (minutos)</Text>
                  <TextInput
                    style={[
                      styles.inputMenor,
                      errorDuration ? styles.inputError : null,
                    ]}
                    placeholder="Ex: 15"
                    value={duration}
                    onChangeText={text => {
                      // Aceitar só números
                      if (/^\d*$/.test(text)) setDuration(text);
                    }}
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    maxLength={4}
                  />
                  {!!errorDuration && (
                    <Text style={styles.errorText}>{errorDuration}</Text>
                  )}
                </View>
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
                  onPress={() => handleCancel()}>
                  <Text style={styles.textoCancelar}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.botaoSalvar}
                  onPress={handleSave}>
                  <Text style={styles.textoSalvar}>
                    {editIndex !== null ? 'Atualizar' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f0f0f0'},
  header: {
    width: '100%',
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderBottomWidth: 0.2,
    borderColor: 'gray',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

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
  botaoExcluir: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#c62828',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  errorText: {
    color: '#c62828', 
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
  },

  inputError: {
    borderColor: '#c62828', 
  },
});

export default ProgrammingScreen;
