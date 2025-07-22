import React, {useState, useEffect, useMemo, useCallback} from 'react';
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
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {BarChart} from 'react-native-chart-kit';
import {useApi} from '../services/api';
import {Zone, HistoryEvent} from '../types/history';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import {Share} from 'react-native';
import Snackbar from 'react-native-snackbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const ITEMS_PER_PAGE = 10;

const HistoryScreen: React.FC = () => {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<HistoryEvent[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<HistoryEvent[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<HistoryEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(
    null,
  );

  const [filters, setFilters] = useState({
    date: '',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    zone: 'all',
    type: 'all',
    searchTerm: '',
    minDuration: '',
    maxDuration: '',
  });

  const {getZones, getIrrigationHistory} = useApi();

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const zonesData = await getZones();
      setZones([{id: 'all', name: 'Todas as zonas'}, ...zonesData]);
      await refreshData();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      
      // Prepara os filtros para a API
      const apiFilters: {
        startDate?: string;
        endDate?: string;
        eventType?: string;
      } = {};
      
      if (filters.zone !== 'all') {
        // Se um zona específica foi selecionada, usamos o endpoint com zoneId
        const historyData = await getIrrigationHistory(filters.zone, {
          startDate: filters.startDate.toISOString(),
          endDate: filters.endDate.toISOString(),
          eventType: filters.type !== 'all' ? filters.type : undefined,
        });
        setEvents(historyData);
      } else {
        // Se "Todas as zonas" foi selecionada, usamos o endpoint geral
        if (filters.startDate) {
          apiFilters.startDate = filters.startDate.toISOString();
        }
        if (filters.endDate) {
          apiFilters.endDate = filters.endDate.toISOString();
        }
        if (filters.type !== 'all') {
          apiFilters.eventType = filters.type;
        }
        
        const historyData = await getIrrigationHistory('all', apiFilters);
        setEvents(historyData);
      }
      
      setPage(1);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico');
    } finally {
      setRefreshing(false);
    }
  };

  const applyFilters = useCallback(
    (data: HistoryEvent[]) => {
      let result = [...data];

      // Filtro de busca
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        result = result.filter(
          event =>
            event.action.toLowerCase().includes(term) ||
            event.zones.some(zone => zone.name.toLowerCase().includes(term)) ||
            event.source.toLowerCase().includes(term) ||
            (event.weather && event.weather.toLowerCase().includes(term)),
        );
      }

      // Filtro de duração
      if (filters.minDuration) {
        const min = parseInt(filters.minDuration, 10);
        result = result.filter(event => event.duration >= min);
      }

      if (filters.maxDuration) {
        const max = parseInt(filters.maxDuration, 10);
        result = result.filter(event => event.duration <= max);
      }

      setFilteredEvents(result);
      setDisplayedEvents(result.slice(0, ITEMS_PER_PAGE));
      setHasMore(result.length > ITEMS_PER_PAGE);
    },
    [filters.searchTerm, filters.minDuration, filters.maxDuration],
  );

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      applyFilters(events);
    }
  }, [events, applyFilters]);

  const loadMoreEvents = () => {
    if (!hasMore) return;

    const nextPage = page + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const newEvents = filteredEvents.slice(0, startIndex);

    setDisplayedEvents(newEvents);
    setPage(nextPage);
    setHasMore(filteredEvents.length > newEvents.length);
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(null);
    if (selectedDate) {
      const field = showDatePicker === 'start' ? 'startDate' : 'endDate';
      // Garante que a hora seja 00:00:00 para startDate e 23:59:59 para endDate
      if (field === 'startDate') {
        selectedDate.setHours(0, 0, 0, 0);
      } else {
        selectedDate.setHours(23, 59, 59, 999);
      }
      handleFilterChange(field, selectedDate);
    }
  };

  const calculateWeeklyUsage = () => {
    const days = [0, 1, 2, 3, 4, 5, 6];
    return days.map(day => {
      return filteredEvents
        .filter(event => new Date(event.createdAt).getDay() === day)
        .reduce((sum, event) => sum + event.duration, 0);
    });
  };

  const handleExportCSV = async () => {
    try {
      const headers = [
        'Data',
        'Hora',
        'Tipo',
        'Ação',
        'Zonas',
        'Duração (min)',
        'Umidade',
        'Clima',
        'Fonte',
      ];

      const data = filteredEvents.map(event => [
        new Date(event.createdAt).toLocaleDateString('pt-BR'),
        new Date(event.createdAt).toLocaleTimeString('pt-BR'),
        event.eventType,
        event.action,
        event.zones.map(z => z.name).join(', '),
        event.duration,
        event.humidity || 'N/A',
        event.weather || 'N/A',
        event.source,
      ]);

      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Histórico');

      const wbout = XLSX.write(wb, {type: 'base64', bookType: 'csv'});
      const filePath = `${
        RNFS.DocumentDirectoryPath
      }/historico_irrigacao_${Date.now()}.csv`;

      await RNFS.writeFile(filePath, wbout, 'base64');

      Share.share({
        title: 'Exportar Histórico',
        url: `file://${filePath}`,
      });

      Snackbar.show({
        text: 'Histórico exportado com sucesso!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      Alert.alert('Erro', 'Não foi possível exportar o histórico');
    }
  };

  const handleExportPDF = async () => {
    try {
      const html = `
        <h1>Histórico de Irrigação</h1>
        <table border="1">
          <tr>
            <th>Data</th>
            <th>Ação</th>
            <th>Zonas</th>
            <th>Duração (min)</th>
          </tr>
          ${filteredEvents
            .map(
              event => `
            <tr>
              <td>${new Date(event.createdAt).toLocaleString('pt-BR')}</td>
              <td>${event.action}</td>
              <td>${event.zones.map(z => z.name).join(', ')}</td>
              <td>${event.duration}</td>
            </tr>
          `,
            )
            .join('')}
        </table>
      `;

      const options = {
        html,
        fileName: `historico_irrigacao_${Date.now()}`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      Share.share({
        title: 'Exportar Histórico',
        url: `file://${file.filePath}`,
      });

      Snackbar.show({
        text: 'PDF gerado com sucesso!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      Alert.alert('Erro', 'Não foi possível gerar o PDF');
    }
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

  const MemoizedHistoryItem = React.memo(({item}: {item: HistoryEvent}) => {
    const eventDate = new Date(item.createdAt);
    const dateStr = eventDate.toLocaleDateString('pt-BR');
    const timeStr = eventDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const zonesStr = item.zones.map(z => z.name).join(', ');

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedEvent(item);
          setShowEventModal(true);
        }}>
        <View style={[styles.eventItem, item.status === 'error' && styles.errorItem]}>
          <View style={styles.eventHeader}>
            {renderEventIcon(item.eventType)}
            <Text style={styles.eventDateTime}>
              {dateStr} - {timeStr}
            </Text>
            {renderWeatherIcon(item.weather)}
          </View>
          <Text style={styles.eventAction}>{item.action}</Text>
          <View style={styles.eventDetails}>
            <Text style={styles.eventDetail}>Zonas: {zonesStr}</Text>
            <Text style={styles.eventDetail}>Duração: {item.duration} min</Text>
          </View>
          {item.humidity && (
            <Text style={styles.eventDetail}>Umidade: {item.humidity}%</Text>
          )}
          <Text style={styles.eventSource}>Fonte: {item.source}</Text>
        </View>
      </TouchableOpacity>
    );
  });

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  };

  if (loading && events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
        }>
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

          <View style={styles.dateRangeContainer}>
            <Text style={styles.filterLabel}>Intervalo de datas:</Text>
            <View style={styles.dateInputs}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker('start')}>
                <Text>{filters.startDate.toLocaleDateString('pt-BR')}</Text>
              </TouchableOpacity>
              <Text style={styles.dateSeparator}>à</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker('end')}>
                <Text>{filters.endDate.toLocaleDateString('pt-BR')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={
                showDatePicker === 'start' ? filters.startDate : filters.endDate
              }
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.durationFilter}>
            <Text style={styles.filterLabel}>Duração (min):</Text>
            <View style={styles.durationInputs}>
              <TextInput
                style={styles.durationInput}
                placeholder="Mín"
                keyboardType="numeric"
                value={filters.minDuration}
                onChangeText={text => handleFilterChange('minDuration', text)}
              />
              <Text style={styles.durationSeparator}>-</Text>
              <TextInput
                style={styles.durationInput}
                placeholder="Máx"
                keyboardType="numeric"
                value={filters.maxDuration}
                onChangeText={text => handleFilterChange('maxDuration', text)}
              />
            </View>
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
              data={{
                labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
                datasets: [{data: calculateWeeklyUsage()}],
              }}
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

        <FlatList
          data={displayedEvents}
          renderItem={({item}) => <MemoizedHistoryItem item={item} />}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          onEndReached={loadMoreEvents}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <Icon name="info-outline" size={40} color="#9E9E9E" />
              <Text style={styles.noResults}>
                Nenhum evento encontrado com os filtros atuais
              </Text>
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() =>
                  setFilters({
                    date: '',
                    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    endDate: new Date(),
                    zone: 'all',
                    type: 'all',
                    searchTerm: '',
                    minDuration: '',
                    maxDuration: '',
                  })
                }>
                <Text style={styles.clearFiltersText}>Limpar filtros</Text>
              </TouchableOpacity>
            </View>
          }
        />

        <View style={styles.exportButtonsContainer}>
          <TouchableOpacity
            style={[styles.exportButton, styles.exportButtonCSV]}
            onPress={handleExportCSV}
            disabled={filteredEvents.length === 0}>
            <Icon name="file-download" size={20} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Exportar CSV</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exportButton, styles.exportButtonPDF]}
            onPress={handleExportPDF}
            disabled={filteredEvents.length === 0}>
            <Icon name="picture-as-pdf" size={20} color="#FFFFFF" />
            <Text style={styles.exportButtonText}>Exportar PDF</Text>
          </TouchableOpacity>
        </View>

        {selectedEvent && (
          <Modal
            visible={showEventModal}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setShowEventModal(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalhes do Evento</Text>
                <TouchableOpacity onPress={() => setShowEventModal(false)}>
                  <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.eventDetailRow}>
                  <Text style={styles.detailLabel}>Data/Hora:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedEvent.createdAt).toLocaleString('pt-BR')}
                  </Text>
                </View>

                <View style={styles.eventDetailRow}>
                  <Text style={styles.detailLabel}>Tipo:</Text>
                  <View style={styles.detailValueWithIcon}>
                    {renderEventIcon(selectedEvent.eventType)}
                    <Text style={styles.detailValue}>
                      {selectedEvent.eventType}
                    </Text>
                  </View>
                </View>

                <View style={styles.eventDetailRow}>
                  <Text style={styles.detailLabel}>Ação:</Text>
                  <Text style={styles.detailValue}>{selectedEvent.action}</Text>
                </View>

                <View style={styles.eventDetailRow}>
                  <Text style={styles.detailLabel}>Zonas:</Text>
                  <Text style={styles.detailValue}>
                    {selectedEvent.zones.map(z => z.name).join(', ')}
                  </Text>
                </View>

                <View style={styles.eventDetailRow}>
                  <Text style={styles.detailLabel}>Duração:</Text>
                  <Text style={styles.detailValue}>
                    {selectedEvent.duration} minutos
                  </Text>
                </View>

                {selectedEvent.humidity && (
                  <View style={styles.eventDetailRow}>
                    <Text style={styles.detailLabel}>Umidade:</Text>
                    <Text style={styles.detailValue}>
                      {selectedEvent.humidity}%
                    </Text>
                  </View>
                )}

                {selectedEvent.weather && (
                  <View style={styles.eventDetailRow}>
                    <Text style={styles.detailLabel}>Clima:</Text>
                    <View style={styles.detailValueWithIcon}>
                      {renderWeatherIcon(selectedEvent.weather)}
                      <Text style={styles.detailValue}>
                        {selectedEvent.weather}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.eventDetailRow}>
                  <Text style={styles.detailLabel}>Fonte:</Text>
                  <Text style={styles.detailValue}>{selectedEvent.source}</Text>
                </View>

                {selectedEvent.status === 'error' && (
                  <View style={styles.errorDetails}>
                    <Text style={styles.detailLabel}>Erro:</Text>
                    <Text style={styles.errorMessage}>
                      {selectedEvent.errorMessage || 'Erro desconhecido'}
                    </Text>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowEventModal(false)}>
                  <Text style={styles.modalButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
  },
  loadingFooter: {
    paddingVertical: 20,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
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
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
  },
  dateRangeContainer: {
    marginBottom: 12,
  },
  durationFilter: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#FFF',
  },
  dateSeparator: {
    marginHorizontal: 8,
    color: '#666',
  },
  durationInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 12,
    backgroundColor: '#FFF',
  },
  durationSeparator: {
    marginHorizontal: 8,
    color: '#666',
  },
  toggleChartButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  toggleChartText: {
    fontSize: 16,
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
  },
  eventItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
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
    flex: 1,
    marginLeft: 8,
    color: '#666',
  },
  eventAction: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventDetail: {
    fontSize: 14,
    color: '#666',
  },
  eventSource: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResults: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  clearFiltersButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  clearFiltersText: {
    color: '#333',
    fontWeight: 'bold',
  },
  exportButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  exportButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
  },
  eventDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: '30%',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
    width: '70%',
  },
  detailValueWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  errorDetails: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  errorMessage: {
    color: '#F44336',
    marginTop: 8,
  },
  modalFooter: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exportButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 10,
  },
  exportButtonCSV: {
    backgroundColor: '#296C32',
  },
  exportButtonPDF: {
    backgroundColor: '#f44336',
  },
});

export default HistoryScreen;
