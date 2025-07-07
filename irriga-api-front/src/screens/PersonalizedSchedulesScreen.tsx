import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import ScheduleModal from './ScheduleModal';

type Schedule = {
  id: string;
  days: string[];
  time: string;
  duration: number;
  zone: string;
  active: boolean;
};

const mockSchedules: Schedule[] = [
  {
    id: '1',
    days: ['Seg', 'Qua', 'Sex'],
    time: '06:00',
    duration: 15,
    zone: 'Zona 1',
    active: true,
  },
  {
    id: '2',
    days: ['Ter', 'Qui'],
    time: '18:30',
    duration: 10,
    zone: 'Zona 2',
    active: false,
  },
];

export default function PersonalizedSchedulesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const handleSaveSchedule = (newSchedule: Schedule) => {
    setSchedules((prev) =>
      prev.some((s) => s.id === newSchedule.id)
        ? prev.map((s) => (s.id === newSchedule.id ? newSchedule : s))
        : [...prev, newSchedule]
    );
  };

  const renderItem = ({ item }: { item: Schedule }) => (
    <TouchableOpacity
      onPress={() => {
        setEditingSchedule(item);
        setModalVisible(true);
      }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Ionicons
          name={item.active ? 'checkmark-circle' : 'close-circle'}
          size={20}
          color={item.active ? '#00CB21' : '#FF4C4C'}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.days}>{item.days.join(', ')}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
      <Text style={styles.details}>
        ({item.duration} min) – {item.zone}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Horários Personalizados</Text>

      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingSchedule(null);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={20} color="#000" />
        <Text style={styles.addButtonText}>Adicionar Novo Horário</Text>
      </TouchableOpacity>

      <ScheduleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveSchedule}
        initialData={editingSchedule}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    backgroundColor: '#00CB21',
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  days: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 4,
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#DDD',
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
