import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Appearance,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BarChart, LineChart, PieChart} from 'react-native-chart-kit';

type HistoryItem = {
  id: string;
  date: string;
  status: string;
  zone: string;
  duration: string;
  favorite?: boolean;
};

const STATUS_OPTIONS = ['concluído', 'ignorado', 'automático', '70% umidade'];

const HistoryScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7' | '30'>('7');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [blacklistFilters, setBlacklistFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [nextEventCountdown, setNextEventCountdown] = useState<string>('');

  const dummyHistory: HistoryItem[] = [
    {
      id: '1',
      date: '2025-06-20T07:00:00',
      status: 'concluído',
      zone: 'Zona 1',
      duration: '00:15:00',
      favorite: false,
    },
    {
      id: '2',
      date: '2025-06-19T18:00:00',
      status: 'ignorado',
      zone: 'Zona 2',
      duration: '00:00:00',
      favorite: false,
    },
    {
      id: '3',
      date: '2025-06-21T09:00:00',
      status: 'automático',
      zone: 'Zona 3',
      duration: '00:10:00',
      favorite: false,
    },
    {
      id: '4',
      date: '2025-06-21T10:00:00',
      status: 'concluído',
      zone: 'Zona 1',
      duration: '00:12:00',
      favorite: true,
    },
    {
      id: '5',
      date: '2025-06-18T11:00:00',
      status: '70% umidade',
      zone: 'Zona 2',
      duration: '00:05:00',
      favorite: false,
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedFilters = await AsyncStorage.getItem('statusFilters');
        if (savedFilters) setStatusFilters(JSON.parse(savedFilters));

        const savedBlacklist = await AsyncStorage.getItem('blacklistFilters');
        if (savedBlacklist) setBlacklistFilters(JSON.parse(savedBlacklist));

        const savedHistory = await AsyncStorage.getItem('historyItems');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        } else {
          setHistory(dummyHistory);
          await AsyncStorage.setItem(
            'historyItems',
            JSON.stringify(dummyHistory),
          );
        }
      } catch (e) {
        console.error('Erro ao carregar dados', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const saveHistory = async (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    await AsyncStorage.setItem('historyItems', JSON.stringify(newHistory));
  };

  const toggleStatus = async (status: string) => {
    const newFilters = statusFilters.includes(status)
      ? statusFilters.filter(s => s !== status)
      : [...statusFilters, status];
    setStatusFilters(newFilters);
    await AsyncStorage.setItem('statusFilters', JSON.stringify(newFilters));
  };

  const toggleBlacklist = async (status: string) => {
    const newBlacklist = blacklistFilters.includes(status)
      ? blacklistFilters.filter(s => s !== status)
      : [...blacklistFilters, status];
    setBlacklistFilters(newBlacklist);
    await AsyncStorage.setItem(
      'blacklistFilters',
      JSON.stringify(newBlacklist),
    );
  };

  const toggleFavorite = async (id: string) => {
    const newHistory = history.map(item =>
      item.id === id ? {...item, favorite: !item.favorite} : item,
    );
    await saveHistory(newHistory);
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedItems(newSelected);
  };

  const deleteSelected = () => {
    if (selectedItems.size === 0) {
      Alert.alert('Nenhum item selecionado');
      return;
    }
    Alert.alert(
      'Confirmar exclusão',
      `Excluir ${selectedItems.size} item(s)?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const newHistory = history.filter(
              item => !selectedItems.has(item.id),
            );
            await saveHistory(newHistory);
            setSelectedItems(new Set());
          },
        },
      ],
    );
  };

  const favoriteSelected = async () => {
    if (selectedItems.size === 0) {
      Alert.alert('Nenhum item selecionado');
      return;
    }
    const newHistory = history.map(item =>
      selectedItems.has(item.id) ? {...item, favorite: true} : item,
    );
    await saveHistory(newHistory);
    setSelectedItems(new Set());
  };

  const filteredHistory = history.filter(item => {
    if (blacklistFilters.includes(item.status)) return false;
    if (statusFilters.length > 0 && !statusFilters.includes(item.status))
      return false;
    if (
      !item.zone.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    const daysAgo = selectedPeriod === '7' ? 7 : 30;
    const itemDate = new Date(item.date);
    const now = new Date();
    if ((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24) > daysAgo)
      return false;
    return true;
  });

  const totalActivations = filteredHistory.length;
  const completedCount = filteredHistory.filter(
    i => i.status === 'Concluído',
  ).length;
  const ignoredCount = filteredHistory.filter(
    i => i.status === 'Ignorado',
  ).length;
  const avgDuration = (() => {
    if (filteredHistory.length === 0) return 0;
    const totalSeconds = filteredHistory.reduce((acc, item) => {
      const parts = item.duration.split(':').map(Number);
      return acc + (parts[0] * 3600 + parts[1] * 60 + parts[2]);
    }, 0);
    return Math.round(totalSeconds / filteredHistory.length / 60);
  })();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const futureEvents = history
        .map(i => new Date(i.date))
        .filter(d => d > now)
        .sort((a, b) => a.getTime() - b.getTime());
      if (futureEvents.length === 0) {
        setNextEventCountdown('Nenhum evento futuro');
        return;
      }
      const diff = futureEvents[0].getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setNextEventCountdown(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [history]);

  const screenWidth = Dimensions.get('window').width - 32;

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 203, 33, ${opacity})`,
    labelColor: () => '#333',
  };

  const barChartData = {
    labels: STATUS_OPTIONS,
    datasets: [
      {
        data: STATUS_OPTIONS.map(
          status =>
            filteredHistory.filter(item => item.status === status).length,
        ),
      },
    ],
  };

  const dailyCount: {[key: string]: number} = {};
  filteredHistory.forEach(item => {
    const date = new Date(item.date).toLocaleDateString();
    dailyCount[date] = (dailyCount[date] || 0) + 1;
  });

  const lineChartData = {
    labels: Object.keys(dailyCount),
    datasets: [{data: Object.values(dailyCount)}],
  };

  const pieChartData = STATUS_OPTIONS.map((status, i) => ({
    name: status,
    population: filteredHistory.filter(item => item.status === status).length,
    color: ['#00CB21', '#FF0000', '#007AFF', '#FFA500'][i],
    legendFontColor: '#333',
    legendFontSize: 12,
  })).filter(p => p.population > 0);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00CB21" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View
        style={[
          styles.container,
          theme === 'dark' && {backgroundColor: '#000'},
        ]}>
        <View style={styles.header}>
          <Text style={[styles.title, theme === 'dark' && {color: '#fff'}]}>
            Histórico
          </Text>
          <Ionicons
            name="time-outline"
            size={24}
            color={theme === 'dark' ? '#fff' : '#000'}
          />
        </View>

        <TextInput
          placeholder="Buscar por zona ou status"
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <View style={styles.filterRow}>
          {['7', '30'].map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.filterBtn,
                selectedPeriod === period && styles.filterBtnSelected,
              ]}
              onPress={() => setSelectedPeriod(period as '7' | '30')}>
              <Text
                style={[
                  styles.filterText,
                  selectedPeriod === period && styles.filterTextSelected,
                ]}>
                {period} dias
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.checkboxRow}>
          {STATUS_OPTIONS.map(status => {
            const checked = statusFilters.includes(status);
            const blacklisted = blacklistFilters.includes(status);
            return (
              <View
                key={status}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 8,
                }}>
                <TouchableOpacity
                  style={[styles.checkbox, checked && styles.checkboxChecked]}
                  onPress={() => toggleStatus(status)}>
                  <Text>{status}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    blacklisted && styles.checkboxBlacklisted,
                  ]}
                  onPress={() => toggleBlacklist(status)}>
                  <Text style={{fontSize: 10}}>Ignorar</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{totalActivations}</Text>
            <Text style={styles.summaryLabel}>Ativações</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{completedCount}</Text>
            <Text style={styles.summaryLabel}>Concluídas</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{ignoredCount}</Text>
            <Text style={styles.summaryLabel}>Ignoradas</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryValue}>{avgDuration} min</Text>
            <Text style={styles.summaryLabel}>Média</Text>
          </View>
        </View>

        <BarChart
          data={barChartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          fromZero
          style={{marginVertical: 8, borderRadius: 16}}
          yAxisLabel=""
          yAxisSuffix=""
        />
        {lineChartData.labels.length > 0 && (
          <LineChart
            data={lineChartData}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            style={{marginVertical: 8, borderRadius: 16}}
          />
        )}
        {pieChartData.length > 0 && (
          <PieChart
            data={pieChartData}
            width={screenWidth}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="8"
            chartConfig={chartConfig}
          />
        )}

        <Text style={{marginBottom: 8}}>
          Próximo evento em: {nextEventCountdown}
        </Text>

       
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
  container: {flex: 1, backgroundColor: '#fff', padding: 16},
  center: {justifyContent: 'center', alignItems: 'center'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {fontSize: 22, fontWeight: 'bold'},
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 40,
  },
  filterRow: {flexDirection: 'row', marginBottom: 12},
  filterBtn: {
    backgroundColor: '#EEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  filterBtnSelected: {backgroundColor: '#00CB21'},
  filterText: {color: '#000'},
  filterTextSelected: {color: '#fff', fontWeight: 'bold'},
  checkboxRow: {flexDirection: 'row', marginBottom: 10},
  checkbox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 4,
    marginRight: 4,
    backgroundColor: '#fff',
  },
  checkboxChecked: {backgroundColor: '#00CB21'},
  checkboxBlacklisted: {backgroundColor: '#FFCCCC'},
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryBox: {alignItems: 'center'},
  summaryValue: {fontSize: 18, fontWeight: 'bold'},
  summaryLabel: {fontSize: 12, color: '#888'},
});

export default HistoryScreen;
