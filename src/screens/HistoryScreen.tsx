import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Seta from '../../assets/icons/chevron-right.svg';
import CheckBox from '@react-native-community/checkbox';

const HistoryScreen = () => {
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
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>HISTÓRICO</Text>
        <Seta width={30} height={30} />
      </View>

      <View
        style={{
          width: '93%',
          borderWidth: 0.3,
          borderColor: 'gray',
          borderRadius: 10,
          marginHorizontal: 10,
        }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottomWidth: 0.3,
              borderColor: 'gray',
              padding: 10,
            }}>
            <Text style={{fontSize: 17}}>Filtros</Text>
            <Text style={{fontWeight: 'bold', fontSize: 15}}>
              ÚLTIMOS 7 DIAS
            </Text>
          </View>
        </View>
        <View style={{marginLeft: 10, marginTop: 10}}>
          <Text style={{fontSize: 17}}>Periodo:</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox />
            <Text style={{fontSize: 16, marginRight: 90}}>Últimos 7 dias</Text>
            <CheckBox />
            <Text style={{fontSize: 16}}>Últimos 30 dias</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 0.3,
              borderColor: 'gray',
            }}>
            <CheckBox />
            <Text style={{fontSize: 16, marginRight: 155}}>Zona</Text>
            <CheckBox />
            <Text style={{fontSize: 16}}>Saturação</Text>
          </View>
        </View>
        <View style={{marginLeft: 10, marginTop: 10}}>
          <Text style={{fontSize: 17}}>Status</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox />
            <Text style={{fontSize: 16, marginRight: 120}}>Concluido</Text>
            <CheckBox />
            <Text style={{fontSize: 16}}>Ignorado</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 0.3,
              borderColor: 'gray',
            }}>
            <CheckBox />
            <Text style={{fontSize: 16, marginRight: 109}}>Automática</Text>
            <CheckBox />
            <Text style={{fontSize: 16}}>70% Umidade</Text>
          </View>
        </View>
      </View>
      <View style={{marginLeft: 18, marginTop: 10}}>
        <Text style={{fontSize: 18}}>Total: 12 ativações</Text>
        <Text style={{fontSize: 18}}>Concluidas:9 ignoradas:2</Text>
        <Text style={{fontSize: 18}}>Média de duração: 45 min</Text>
      </View>

      <View
        style={{
          width: '93%',
          borderWidth: 0.3,
          borderColor: 'gray',
          borderRadius: 10,
          marginHorizontal: 10,
          marginTop:10,
        }}>
          <View style={{marginLeft:10, flexDirection:'row', justifyContent:'space-between', marginRight:10,}}>
            <Text style={{fontWeight:'bold', fontSize:16,}}>11/06/2025 - 06:00</Text>
            <Text style={{fontWeight:'bold', fontSize:16, color:'#296C32'}}>Concluido</Text>
          </View>
          <View style={{marginLeft:10, flexDirection:'row', justifyContent:'space-between', marginRight:10, borderBottomWidth:0.3, borderColor:'gray'}}>
            <Text style={{fontWeight:'bold', fontSize:16,}}>Programação 1 - Zona 1</Text>
            <Text style={{fontWeight:'bold', fontSize:16, }}>203 min</Text>
          </View>
          <View style={{marginLeft:10, flexDirection:'row', justifyContent:'space-between', marginRight:10}}>
            <Text style={{fontSize:16,marginTop:5, marginBottom:5,}}>Ver mais detalhes</Text>
          </View>

        </View>
      <View
        style={{
          width: '93%',
          borderWidth: 0.3,
          borderColor: 'gray',
          borderRadius: 10,
          marginHorizontal: 10,
          marginTop:10,
        }}>
          <View style={{marginLeft:10, flexDirection:'row', justifyContent:'space-between', marginRight:10,}}>
            <Text style={{fontWeight:'bold', fontSize:16,}}>11/06/2025 - 06:00</Text>
            <Text style={{fontWeight:'bold', fontSize:16, color:'orange'}}>Ingernado</Text>
          </View>
          <View style={{marginLeft:10, flexDirection:'row', justifyContent:'space-between', marginRight:10, borderBottomWidth:0.3, borderColor:'gray'}}>
            <Text style={{fontWeight:'bold', fontSize:16,}}>Programação 1 - Zona 2</Text>
            <Text style={{fontWeight:'bold', fontSize:16, }}>203 min</Text>
          </View>
          <View style={{marginLeft:10, flexDirection:'row', justifyContent:'space-between', marginRight:10}}>
            <Text style={{fontSize:16,marginTop:5, marginBottom:5,}}>Ver mais detalhes</Text>
          </View>

        </View>
      <View
        style={{
          width: '93%',
          borderWidth: 0.3,
          borderColor: 'gray',
          borderRadius: 10,
          marginHorizontal: 10,
          marginTop:10,
        }}>
          <View style={{marginLeft:10, flexDirection:'row', justifyContent:'space-between', marginRight:10,}}>
            <Text style={{fontWeight:'bold', fontSize:16,}}>11/06/2025 - 06:00</Text>
            <Text style={{fontWeight:'bold', fontSize:16, color:'red'}}>Interrompido</Text>
          </View>
          <View style={{marginLeft:10, flexDirection:'row', justifyContent:'space-between', marginRight:10, borderBottomWidth:0.3, borderColor:'gray'}}>
            <Text style={{fontWeight:'bold', fontSize:16,}}>Programação 1 - Zona 3</Text>
            <Text style={{fontWeight:'bold', fontSize:16, }}>203 min</Text>
          </View>
          <View style={{marginLeft:10, flexDirection:'row', justifyContent:'space-between', marginRight:10}}>
            <Text style={{fontSize:16,marginTop:5, marginBottom:5,}}>Ver mais detalhes</Text>
          </View>

        </View>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({});
