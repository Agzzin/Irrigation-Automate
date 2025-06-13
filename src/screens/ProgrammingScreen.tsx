import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Switch} from 'react-native';
import Water from '../../assets/icons/droplet.svg';
import { useState } from 'react';
import AddCircle from '../../assets/icons/add-circle.svg'
import { useForm, Controller } from 'react-hook-form';

type FormData = {
  nome: string;
  email: string;
};

const ProgrammingScreen = () => {

  const [switch1, setSwitch1] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PROGRAMAÇÕES</Text>
      </View>

      <View style={styles.containerAtives}>
        <Text style={styles.ativesText}>Programações Ativas</Text>
        <View style={styles.caracZones}>
          <TouchableOpacity style={styles.waterAtr}>
            <Water width={30} height={30} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.atrZones}>
            <Text style={styles.titleZones}>Manhã - Zona 1</Text>

            <View style={styles.viewAtr}>
                <Text style={styles.textZones}>Seg, Qua, Sex</Text>
                <Text style={styles.textMin}>20 min</Text>
                <View style={styles.minutesZone}>
             <Switch
              value={switch1}
              onValueChange={setSwitch1}
              trackColor={{false: '#767577', true: '#276C32'}}
              thumbColor={switch1 ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}], marginLeft:50,}}
              />
            </View>
            </View>

          </View>

         
        </View>
        <View style={styles.caracZones}>
          <TouchableOpacity style={styles.waterAtr}>
            <Water width={30} height={30} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.atrZones}>
            <Text style={styles.titleZones}>Tarde - Zona 3</Text>

            <View style={styles.viewAtr}>
                <Text style={styles.textZones}>Seg, Qua, Sex</Text>
                <Text style={styles.textMin}>10 min</Text>
                <View style={styles.minutesZone}>
             <Switch
              value={switch1}
              onValueChange={setSwitch1}
              trackColor={{false: '#767577', true: '#276C32'}}
              thumbColor={switch1 ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}], marginLeft:50,}}
              />
            </View>
            </View>

          </View>

         
        </View>
        <View>
            <TouchableOpacity style={styles.novaP}>
                <AddCircle width={25} height={25}/>
                <Text style={styles.TouchNew}>Nova Programação</Text>
            </TouchableOpacity>
        </View>
      </View>

      <View style={styles.newAtributes}>
        <Text style={styles.textAtributes}>Nova Programação</Text>

        <View style={styles.newInputs}>
            
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  header: {
    width: '100%',
    paddingTop: 40,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    borderBottomWidth: 0.2,
    borderColor: 'gray',
  },

  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  containerAtives: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
  },

  ativesText: {
    fontSize: 18,
    fontWeight: '700',
    paddingBottom: 10,
  },

  caracZones: {
    paddingLeft: 10,
    marginTop: 5,
    paddingTop: 10,
    flexDirection:'row',
    width:'100%',
    borderWidth:0.2,
    borderColor:'gray',
    borderRadius:10,
    paddingBottom:10,

  },

  waterAtr: {
    backgroundColor: '#296C32',
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    
  },

  atrZones:{
    marginLeft:20,
  },

  titleZones:{
    fontWeight:'800',
    fontSize:20,
  },

  textZones:{
    fontSize:18,
    fontWeight:'500'
  },

  viewAtr:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },

  textMin:{
    fontWeight:'500',
    marginLeft:30,
    fontSize:16,
  },

  minutesZone:{
    display:'flex',
    flexDirection:'row',
    gap:20,
  },

  novaP:{
    flexDirection:'row',
    width:'95%',
    backgroundColor:'#296C32',
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
    marginTop:15,
    gap:8,
    padding:10,
  },

  TouchNew:{
    fontSize:18,
    color:'#ffffff',
  },

  newAtributes:{
    marginTop:25,
    width:'100%',
    marginLeft:20,
  },

  textAtributes:{
    fontSize:20,
    fontWeight:'bold'
  }
});

export default ProgrammingScreen;
