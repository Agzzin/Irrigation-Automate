import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BarChart} from 'react-native-chart-kit';
import {useApi} from '../services/api';
import {Zone, HistoryEvent} from '../types/history';

const HistoryScreen: React.FC = () => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<HistoryEvent[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    date: '',
    zone: 'all',
    type: 'all',
    searchTerm: '',
  });
  const [showChart, setShowChart] = useState<boolean>(false);

  const {getZones, getIrrigationHistory} = useApi();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        const zonesData = await getZones();
        setZones([{id: 'all', name: 'Todas as zonas'}, ...zonesData]);

        const historyData = await getIrrigationHistory();
        setEvents(historyData);
        setFilteredEvents(historyData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true);
        const historyData = await getIrrigationHistory(
          filters.zone === 'all' ? undefined : filters.zone,
          {
            startDate: filters.date,
            eventType: filters.type !== 'all' ? filters.type : undefined,
          },
        );

        let result = historyData;
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          result = result.filter(
            (event: HistoryEvent) =>
              event.action.toLowerCase().includes(term) ||
              event.zones.some((zone: Zone) =>
                zone.name.toLowerCase().includes(term),
              ) ||
              event.source.toLowerCase().includes(term) ||
              (event.weather && event.weather.toLowerCase().includes(term)),
          );
        }

        setFilteredEvents(result);
      } catch (error) {
        console.error('Erro ao filtrar:', error);
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const chartData = {
    labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    datasets: [
      {
        data: filteredEvents.reduce((acc, _, index) => {
          const day = new Date().getDay() - (6 - index);
          const dayEvents = filteredEvents.filter(
            (event: HistoryEvent) => new Date(event.createdAt).getDay() === day,
          );
          acc.push(
            dayEvents.reduce((sum, event) => sum + (event.duration || 0), 0),
          );
          return acc;
        }, [] as number[]),
      },
    ],
  };

  const renderEventIcon = (type: string) => {
    switch (type) {
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

  const renderWeatherIcon = (weather?: string) => {
    if (!weather) return null;
    if (weather.includes('Ensolarado'))
      return <Icon name="wb-sunny" size={20} color="#FFC107" />;
    if (weather.includes('Nublado'))
      return <Icon name="cloud" size={20} color="#9E9E9E" />;
    if (weather.includes('Chuvoso'))
      return <Icon name="grain" size={20} color="#2196F3" />;
    return <Icon name="wb-cloudy" size={20} color="#607D8B" />;
  };

  const renderItem = ({item}: {item: HistoryEvent}) => (
    <View
      style={[styles.eventItem, item.status === 'error' && styles.errorItem]}>
      <View style={styles.eventHeader}>
        {renderEventIcon(item.eventType)}
        <Text style={styles.eventDateTime}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')} -{' '}
          {new Date(item.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {renderWeatherIcon(item.weather)}
      </View>
      <Text style={styles.eventAction}>{item.action}</Text>
      <View style={styles.eventDetails}>
        <Text style={styles.eventDetail}>
          Zonas: {item.zones.map(z => z.name).join(', ')}
        </Text>
        <Text style={styles.eventDetail}>Duração: {item.duration} min</Text>
      </View>
      <View style={styles.eventDetails}>
        {item.humidity && (
          <Text style={styles.eventDetail}>Umidade: {item.humidity}%</Text>
        )}
        {item.weather && (
          <Text style={styles.eventDetail}>Clima: {item.weather}</Text>
        )}
      </View>
      <Text style={styles.eventSource}>Fonte: {item.source}</Text>
    </View>
  );

  if (loading && events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

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
            onChangeText={text => handleFilterChange('searchTerm', text)}
          />

          <View style={styles.pickerRow}>
            <Picker
              selectedValue={filters.zone}
              style={styles.picker}
              onValueChange={value => handleFilterChange('zone', value)}>
              {zones.map((zone: Zone) => (
                <Picker.Item key={zone.id} label={zone.name} value={zone.id} />
              ))}
            </Picker>

            <Picker
              selectedValue={filters.type}
              style={styles.picker}
              onValueChange={value => handleFilterChange('type', value)}>
              <Picker.Item label="Todos os tipos" value="all" />
              <Picker.Item label="Automáticos" value="automático" />
              <Picker.Item label="Manuais" value="manual" />
              <Picker.Item label="Falhas" value="falha" />
              <Picker.Item label="Notificações" value="notificação" />
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={styles.toggleChartButton}
          onPress={() => setShowChart(!showChart)}>
          <Text style={styles.toggleChartText}>
            {showChart ? 'Ocultar gráfico' : 'Mostrar gráfico de análise'}
          </Text>
          <Icon
            name={showChart ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color="#333"
          />
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
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {borderRadius: 16},
                propsForDots: {r: '4', strokeWidth: '2', stroke: '#388E3C'},
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
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.noResults}>
            Nenhum evento encontrado com os filtros atuais.
          </Text>
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  searchInput: {
    height: 48,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  toggleChartButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  toggleChartText: {
    fontSize: 16,
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  chart: {
    borderRadius: 12,
    marginTop: 8,
  },
  eventItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  errorItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    marginBottom: 4,
  },
  eventDetail: {
    fontSize: 14,
    color: '#555',
  },
  eventSource: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
    fontStyle: 'italic',
  },
  noResults: {
    textAlign: 'center',
    marginVertical: 24,
    color: '#777',
    fontSize: 16,
  },
  exportButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 2,
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default HistoryScreen;
