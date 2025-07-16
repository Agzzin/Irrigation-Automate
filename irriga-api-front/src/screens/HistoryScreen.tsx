import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BarChart } from 'react-native-chart-kit';
import { IrrigationEvent, FilterOptions } from '../types/History';

const HistoryScreen: React.FC = () => {
  const [events, setEvents] = useState<IrrigationEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IrrigationEvent[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    date: '',
    zone: 'all',
    type: 'all',
    searchTerm: ''
  });
  const [showChart, setShowChart] = useState<boolean>(false);

  useEffect(() => {
    const sampleEvents: IrrigationEvent[] = [
      {
        id: '1',
        date: '15/07/2025',
        time: '08:00',
        type: 'automático',
        action: 'Irrigação iniciada',
        duration: '20 min',
        zones: ['Zona 1', 'Zona 2'],
        source: 'Automático',
        humidity: '24%',
        weather: 'Ensolarado',
        status: 'success'
      },
      {
        id: '2',
        date: '15/07/2025',
        time: '08:20',
        type: 'automático',
        action: 'Irrigação concluída',
        duration: '20 min',
        zones: ['Zona 1', 'Zona 2'],
        source: 'Automático',
        humidity: '42%',
        weather: 'Ensolarado',
        status: 'success'
      },
      {
        id: '3',
        date: '14/07/2025',
        time: '07:30',
        type: 'manual',
        action: 'Irrigação manual iniciada',
        duration: '15 min',
        zones: ['Zona 3'],
        source: 'Manual',
        humidity: '28%',
        weather: 'Nublado',
        status: 'success'
      },
      {
        id: '4',
        date: '14/07/2025',
        time: '18:45',
        type: 'falha',
        action: 'Falha na irrigação',
        duration: '0 min',
        zones: ['Zona 1'],
        source: 'Automático',
        humidity: '22%',
        weather: 'Chuvoso',
        status: 'error'
      },
    ];
    setEvents(sampleEvents);
    setFilteredEvents(sampleEvents);
  }, []);

  useEffect(() => {
    let result = [...events];
    
    if (filters.date) {
      result = result.filter(event => event.date === filters.date);
    }
    
    if (filters.zone !== 'all') {
      result = result.filter(event => event.zones.includes(filters.zone));
    }
    
    if (filters.type !== 'all') {
      result = result.filter(event => event.type === filters.type);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(event => 
        event.action.toLowerCase().includes(term) || 
        event.zones.some(zone => zone.toLowerCase().includes(term)) ||
        event.source.toLowerCase().includes(term) ||
        event.weather.toLowerCase().includes(term)
      );
    }
    
    setFilteredEvents(result);
  }, [filters, events]);

  const handleFilterChange = (name: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const zones = ['all', 'Zona 1', 'Zona 2', 'Zona 3'];
  const eventTypes = ['all', 'automático', 'manual', 'falha', 'notificação'];

  const chartData = {
    labels: ['10/07', '11/07', '12/07', '13/07', '14/07', '15/07', '16/07'],
    datasets: [
      {
        data: [15, 30, 20, 25, 35, 40, 20]
      }
    ]
  };

  const renderEventIcon = (type: IrrigationEvent['type']) => {
    switch(type) {
      case 'automático':
        return <Icon name="autorenew" size={20} color="#4CAF50" />;
      case 'manual':
        return <Icon name="touch-app" size={20} color="#2196F3" />;
      case 'falha':
        return <Icon name="error" size={20} color="#F44336" />;
      case 'notificação':
        return <Icon name="notifications" size={20} color="#FFC107" />;
      default:
        return <Icon name="info" size={20} color="#9E9E9E" />;
    }
  };

  const renderWeatherIcon = (weather: string) => {
    if (weather.includes('Ensolarado')) return <Icon name="wb-sunny" size={20} color="#FFC107" />;
    if (weather.includes('Nublado')) return <Icon name="cloud" size={20} color="#9E9E9E" />;
    if (weather.includes('Chuvoso')) return <Icon name="grain" size={20} color="#2196F3" />;
    return <Icon name="wb-cloudy" size={20} color="#607D8B" />;
  };

  const renderItem = ({ item }: { item: IrrigationEvent }) => (
    <View style={[styles.eventItem, item.status === 'error' && styles.errorItem]}>
      <View style={styles.eventHeader}>
        {renderEventIcon(item.type)}
        <Text style={styles.eventDateTime}>{item.date} - {item.time}</Text>
        {renderWeatherIcon(item.weather)}
      </View>
      <Text style={styles.eventAction}>{item.action}</Text>
      <View style={styles.eventDetails}>
        <Text style={styles.eventDetail}>Zonas: {item.zones.join(', ')}</Text>
        <Text style={styles.eventDetail}>Duração: {item.duration}</Text>
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventDetail}>Umidade: {item.humidity}</Text>
        <Text style={styles.eventDetail}>Clima: {item.weather}</Text>
      </View>
      <Text style={styles.eventSource}>Acionamento: {item.source}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Filtros */}
        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>Filtros</Text>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por palavra-chave..."
            value={filters.searchTerm}
            onChangeText={(text) => handleFilterChange('searchTerm', text)}
          />
          
          <View style={styles.pickerRow}>
            <Picker
              selectedValue={filters.date}
              style={styles.picker}
              onValueChange={(itemValue) => handleFilterChange('date', itemValue)}>
              <Picker.Item label="Todas as datas" value="" />
              <Picker.Item label="15/07/2025" value="15/07/2025" />
              <Picker.Item label="14/07/2025" value="14/07/2025" />
            </Picker>
            
            <Picker
              selectedValue={filters.zone}
              style={styles.picker}
              onValueChange={(itemValue) => handleFilterChange('zone', itemValue)}>
              {zones.map(zone => (
                <Picker.Item key={zone} label={zone === 'all' ? 'Todas as zonas' : zone} value={zone} />
              ))}
            </Picker>
          </View>
          
          <Picker
            selectedValue={filters.type}
            style={styles.picker}
            onValueChange={(itemValue) => handleFilterChange('type', itemValue)}>
            {eventTypes.map(type => (
              <Picker.Item 
                key={type} 
                label={
                  type === 'all' ? 'Todos os tipos' : 
                  type === 'automático' ? 'Automáticos' :
                  type === 'manual' ? 'Manuais' :
                  type === 'falha' ? 'Falhas' : 'Notificações'
                } 
                value={type} 
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.toggleChartButton}
          onPress={() => setShowChart(!showChart)}>
          <Text>{showChart ? 'Ocultar gráfico' : 'Mostrar gráfico de análise'}</Text>
          <Icon name={showChart ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} />
        </TouchableOpacity>

        {showChart && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Minutos de irrigação por dia</Text>
            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" min"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.chart}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>
          Eventos ({filteredEvents.length})
        </Text>
        
        {filteredEvents.length > 0 ? (
          <FlatList
            data={filteredEvents}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noResults}>Nenhum evento encontrado com os filtros atuais.</Text>
        )}

        <TouchableOpacity style={styles.exportButton}>
          <Icon name="file-download" size={20} color="#FFFFFF" />
          <Text style={styles.exportButtonText}>Exportar Histórico (CSV)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  toggleChartButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
  },
  eventItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  errorItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventDateTime: {
    marginLeft: 8,
    marginRight: 'auto',
    fontSize: 14,
    color: '#666',
  },
  eventAction: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  eventDetail: {
    fontSize: 14,
    color: '#555',
  },
  eventSource: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    fontStyle: 'italic',
  },
  noResults: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#777',
  },
  exportButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    elevation: 2,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HistoryScreen;