import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import WifiIcon from '../../assets/icons/wifi.svg';
import WaterDrop from '../../assets/icons/water_drop.svg';
import SoilMoisture from '../../assets/icons/soil-moisture.svg';
import CloudSun from '../../assets/icons/cloud-sun.svg';
import Thermometer from '../../assets/icons/thermometer-half.svg';
import Power from '../../assets/icons/power.svg'
import Water from '../../assets/icons/water.svg'



const InitialPageScreen = () => {
    return(
        <View style={styles.container}>
           <View style={styles.dashboard}>
             <Text style={styles.dashboardText}>DASHBOARD</Text>
             <WifiIcon width={24} height={24} />
           </View>
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>Status Atual</Text>
                <View style={styles.irrigationInfo}>
                    <TouchableOpacity style={styles.iconContainer}>
                        <WaterDrop width={50} height={50}/>
                    </TouchableOpacity>
                    <View style={styles.irrigationDetails}>
                        <Text style={styles.titleIrrigation}>IRRIGAÇÃO LIGADA</Text>
                        <Text style={styles.zoneText}>Zona 1</Text>
                        <Text style={styles.lastUpdateText}>Última atualização: 10/10/2023 14:30</Text>
                    </View>
                </View>
            </View>

            <View style={styles.complements}>
                <View style={styles.umidade}>
                   <Text style={styles.umidadeText}>Umidade {'\n'} do Solo</Text>
                     <SoilMoisture width={50} height={50} />
                     <Text style={styles.umidadeValue}>45%</Text>
                </View>

                <View style={styles.previsao}>
                    <Text style={styles.previsaoText}>Previsão</Text>
                    <CloudSun width={50} height={50} />
                    <Text style={styles.previsaoText}>Parcial.{'\n'}nublado</Text>
                </View>  

                <View style={styles.temperatura}>
                    <Thermometer width={50} height={50} />
                    <Text style={styles.temperaturaText}>Temperatura</Text>
                    <Text style={styles.temperaturaValue}>22°C</Text>
                </View> 
            </View>

            <TouchableOpacity style={styles.manualIrrigationButton}>
                    <Power width={40} height={40} />
                    <Text style={styles.manualIrrigationText}>IRRIGAÇÃO MANUAL</Text>
            </TouchableOpacity> 

            <View style={styles.ZonesIrrigationContainer}>
                <View>
                  <Text style={styles.ZonesIrrigationTitle}>Zonas</Text>
                  <TouchableOpacity></TouchableOpacity>
                </View>
                <View style={styles.ZonesIrrigationQuantity}>
                    <View style={styles.ZonesCaracteristics}>
                        <Text style={styles.ZonesCaracteristicsTitle}>Zona1</Text>
                         <Water width={35} height={35} />
                    </View>

                    <View style={styles.ZonesCaracteristics}>
                        <Text style={styles.ZonesCaracteristicsTitle}>Zona2</Text>
                         <Water width={35} height={35} />
                    </View>
                        
                    <View style={styles.ZonesCaracteristics}>
                        <Text style={styles.ZonesCaracteristicsTitle}>Zona3</Text>
                         <Water width={35} height={35} />
                    </View>
                </View>
            </View>
        </View>
    )
}

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
        paddingLeft:20,
        paddingRight: 20,
        marginTop:20,
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
        backgroundColor: '#F0F0F0',
    },

    statusText: {
        paddingTop:10,
        paddingLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    irrigationInfo: {
        backgroundColor: '',
        padding: 15,
        marginLeft:10,
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
        backgroundColor: '#00CB21',
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

    umidadeText : {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
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
        backgroundColor: '#00CB21',
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

    ZonesIrrigationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },

    ZonesIrrigationDescription: {
        fontSize: 14,
        color: '#555',
    },

    ZonesIrrigationQuantity:{
        display: 'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },

    ZonesCaracteristics:{
        marginTop:10,
        padding:10,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:'gray',
        borderRadius:10,
        alignItems:'center'
    },

    ZonesCaracteristicsTitle:{
        fontSize:15,
        fontWeight:'500'
    }
});


export default InitialPageScreen;