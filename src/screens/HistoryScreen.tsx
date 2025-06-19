import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Seta from '../../assets/icons/chevron-right.svg';
import CheckBox from '@react-native-community/checkbox';

const HistoryScreen = () => {
  // Estados dos filtros
  const [period7, setPeriod7] = useState(true);
  const [period30, setPeriod30] = useState(false);
  const [zone, setZone] = useState(false);
  const [saturation, setSaturation] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [ignorado, setIgnorado] = useState(false);
  const [automatica, setAutomatica] = useState(false);
  const [umidade70, setUmidade70] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HISTÓRICO</Text>
        <Seta width={30} height={30} />
      </View>

      <View style={styles.filtrosContainer}>
        <View>
          <View style={styles.filtrosHeader}>
            <Text style={styles.filtrosTitle}>Filtros</Text>
            <Text style={styles.filtrosPeriodo}>ÚLTIMOS 7 DIAS</Text>
          </View>
        </View>
        <View style={styles.filtrosSection}>
          <Text style={styles.filtrosSectionTitle}>Periodo:</Text>
          <View style={styles.filtrosRow}>
            <CheckBox
              value={period7}
              onValueChange={setPeriod7}
              tintColors={{ true: '#296C32', false: 'gray' }}
            />
            <Text style={styles.filtrosCheckboxLabel7}>Últimos 7 dias</Text>
            <CheckBox
              value={period30}
              onValueChange={setPeriod30}
              tintColors={{ true: '#296C32', false: 'gray' }}
            />
            <Text style={styles.filtrosCheckboxLabel}>Últimos 30 dias</Text>
          </View>
          <View style={styles.filtrosRowBorder}>
            <CheckBox
              value={zone}
              onValueChange={setZone}
              tintColors={{ true: '#296C32', false: 'gray' }}
            />
            <Text style={styles.filtrosCheckboxLabelZone}>Zona</Text>
            <CheckBox
              value={saturation}
              onValueChange={setSaturation}
              tintColors={{ true: '#296C32', false: 'gray' }}
            />
            <Text style={styles.filtrosCheckboxLabel}>Saturação</Text>
          </View>
        </View>
        <View style={styles.filtrosSection}>
          <Text style={styles.filtrosSectionTitle}>Status</Text>
          <View style={styles.filtrosRow}>
            <CheckBox
              value={concluido}
              onValueChange={setConcluido}
              tintColors={{ true: '#296C32', false: 'gray' }}
            />
            <Text style={styles.filtrosCheckboxLabelConcluido}>Concluido</Text>
            <CheckBox
              value={ignorado}
              onValueChange={setIgnorado}
              tintColors={{ true: '#296C32', false: 'gray' }}
            />
            <Text style={styles.filtrosCheckboxLabel}>Ignorado</Text>
          </View>
          <View style={styles.filtrosRowBorder}>
            <CheckBox
              value={automatica}
              onValueChange={setAutomatica}
              tintColors={{ true: '#296C32', false: 'gray' }}
            />
            <Text style={styles.filtrosCheckboxLabelAutomatica}>Automática</Text>
            <CheckBox
              value={umidade70}
              onValueChange={setUmidade70}
              tintColors={{ true: '#296C32', false: 'gray' }}
            />
            <Text style={styles.filtrosCheckboxLabel}>70% Umidade</Text>
          </View>
        </View>
      </View>

      <View style={styles.resumoContainer}>
        <Text style={styles.resumoText}>Total: 12 ativações</Text>
        <Text style={styles.resumoText}>Concluidas:9 ignoradas:2</Text>
        <Text style={styles.resumoText}>Média de duração: 45 min</Text>
      </View>

      {/* Cards de histórico */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>11/06/2025 - 06:00</Text>
          <Text style={[styles.cardStatus, { color: '#296C32' }]}>Concluido</Text>
        </View>
        <View style={styles.cardRowBorder}>
          <Text style={styles.cardRowTitle}>Programação 1 - Zona 1</Text>
          <Text style={styles.cardRowTime}>203 min</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>Ver mais detalhes</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>11/06/2025 - 06:00</Text>
          <Text style={[styles.cardStatus, { color: 'orange' }]}>Ignorado</Text>
        </View>
        <View style={styles.cardRowBorder}>
          <Text style={styles.cardRowTitle}>Programação 1 - Zona 2</Text>
          <Text style={styles.cardRowTime}>203 min</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>Ver mais detalhes</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>11/06/2025 - 06:00</Text>
          <Text style={[styles.cardStatus, { color: 'red' }]}>Interrompido</Text>
        </View>
        <View style={styles.cardRowBorder}>
          <Text style={styles.cardRowTitle}>Programação 1 - Zona 3</Text>
          <Text style={styles.cardRowTime}>203 min</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardFooterText}>Ver mais detalhes</Text>
        </View>
      </View>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filtrosContainer: {
    width: '93%',
    borderWidth: 0.3,
    borderColor: 'gray',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  filtrosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderColor: 'gray',
    padding: 10,
  },
  filtrosTitle: {
    fontSize: 17,
  },
  filtrosPeriodo: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  filtrosSection: {
    marginLeft: 10,
    marginTop: 10,
  },
  filtrosSectionTitle: {
    fontSize: 17,
  },
  filtrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtrosRowBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderColor: 'gray',
  },
  filtrosCheckboxLabel7: {
    fontSize: 16,
    marginRight: 90,
  },
  filtrosCheckboxLabel: {
    fontSize: 16,
  },
  filtrosCheckboxLabelZone: {
    fontSize: 16,
    marginRight: 155,
  },
  filtrosCheckboxLabelConcluido: {
    fontSize: 16,
    marginRight: 120,
  },
  filtrosCheckboxLabelAutomatica: {
    fontSize: 16,
    marginRight: 109,
  },
  resumoContainer: {
    marginLeft: 18,
    marginTop: 10,
  },
  resumoText: {
    fontSize: 18,
  },
  card: {
    width: '93%',
    borderWidth: 0.3,
    borderColor: 'gray',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  cardHeader: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  cardHeaderTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardStatus: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardRowBorder: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
    borderBottomWidth: 0.3,
    borderColor: 'gray',
  },
  cardRowTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardRowTime: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardFooter: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
  },
  cardFooterText: {
    fontSize: 16,
    marginTop: 5,
    marginBottom: 5,
  },
});
