import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import {useState} from 'react';
import Seta from '../../assets/icons/chevron-right.svg';

const SettingsScreen = () => {
  const [switch1, setSwitch1] = useState(false);

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          marginTop: 60,
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
          marginHorizontal: 20,
          justifyContent: 'space-between',
          marginBottom: 15,
        }}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>CONFIGURAÇÕES</Text>
      </View>
      <View style={{marginHorizontal: 20}}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          Parâmetros Climáticos
        </Text>
        <View
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            marginTop: 12,
            borderColor: 'gray',
          }}>
          <View style={{marginHorizontal: 10, marginTop: 10}}>
            <View
              style={{
                marginBottom: 5,
                borderColor: 'gray',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15}}>Pausar se estiver chovendo</Text>
              <Switch
                value={switch1}
                onValueChange={setSwitch1}
                trackColor={{false: '#767577', true: '#276C32'}}
                thumbColor={switch1 ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={{
                  transform: [{scaleX: 1.2}, {scaleY: 1.2}],
                  marginLeft: 50,
                }}
              />
            </View>
            <View
              style={{
                marginBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15}}>
                Pausar se tiver previsão de chuva
              </Text>
              <Switch
                value={switch1}
                onValueChange={setSwitch1}
                trackColor={{false: '#767577', true: '#276C32'}}
                thumbColor={switch1 ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={{
                  transform: [{scaleX: 1.2}, {scaleY: 1.2}],
                  marginLeft: 50,
                }}
              />
            </View>
            <View
              style={{
                marginBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15}}>Umidade minima de 40%</Text>
              <Switch
                value={switch1}
                onValueChange={setSwitch1}
                trackColor={{false: '#767577', true: '#276C32'}}
                thumbColor={switch1 ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                style={{
                  transform: [{scaleX: 1.2}, {scaleY: 1.2}],
                  marginLeft: 50,
                }}
              />
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
          marginHorizontal: 20,
          justifyContent: 'space-between',
          marginBottom: 15,
        }}></View>
      <View style={{marginHorizontal: 20}}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>Automação</Text>
        <View
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            marginTop: 12,
            borderColor: 'gray',
          }}>
          <View style={{marginHorizontal: 10, marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15}}>Frequência de verificação</Text>
              <Seta width={20} height={20} />
            </View>
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15}}>Permitir notificações</Text>
              <Seta width={20} height={20} />
            </View>
          </View>
        </View>
      </View>

      <View style={{marginHorizontal: 20, marginTop: 10}}>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>
          Conectividade e integrações
        </Text>
        <View
          style={{
            borderWidth: 0.2,
            borderRadius: 10,
            marginTop: 12,
            borderColor: 'gray',
          }}>
          <View style={{marginHorizontal: 10, marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15}}>Wi-fi</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>Conectado</Text>
                <Seta width={20} height={20} />
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15}}>integrações externas</Text>
              <Seta width={20} height={20} />
            </View>
          </View>
        </View>
      </View>

      <View>
        <View style={{marginHorizontal: 20, marginTop: 10}}>
          <View style={{flexDirection:'row', gap:155}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Zonas</Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Preferências {'\n'}do Usuário</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View
              style={{
                flexDirection: 'column',
                width: '45%',
                borderWidth: 0.3,
                borderColor: 'gray',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 10,
                  marginBottom: 10,
                  marginTop: 10,
                }}>
                Gerenciar Zonas
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 10,
                  marginBottom: 10,
                  marginTop: 10,
                }}>
                Gerenciar {'\n'}programações
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 10,
                  marginBottom: 10,
                  marginTop: 10,
                }}>
                Histórico de ajustes
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                width: '45%',
                borderWidth: 0.3,
                borderColor: 'gray',
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 10,
                  marginBottom: 10,
                  marginTop: 10,
                }}>
                Rotinas inteli.
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 10,
                  marginBottom: 10,
                  marginTop: 10,
                }}>
                Controle de {'\n'}Acesso
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 10,
                  marginBottom: 10,
                  marginTop: 10,
                }}>
                Backup e {'\n'}Restauração
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
