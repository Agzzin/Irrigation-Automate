import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';

type Schedule = {
  id: string;
  days: string[];
  time: string;
  duration: number;
  zone: string;
  active: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
  initialData?: Schedule | null;
};

const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export default function ScheduleModal({ visible, onClose, onSave, initialData }: Props) {
  const [selectedDays, setSelectedDays] = useState<string[]>(initialData?.days || []);
  const [time, setTime] = useState(initialData?.time || '');
  const [duration, setDuration] = useState(String(initialData?.duration || ''));
  const [zone, setZone] = useState(initialData?.zone || '');
  const [active, setActive] = useState(initialData?.active ?? true);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!time || !duration || !zone || selectedDays.length === 0) return;

    onSave({
      id: initialData?.id || Date.now().toString(),
      time,
      duration: Number(duration),
      zone,
      active,
      days: selectedDays,
    });

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {initialData ? 'Editar Horário' : 'Novo Horário'}
          </Text>

          <ScrollView>
            <Text style={styles.label}>Dias da semana:</Text>
            <View style={styles.daysContainer}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.day,
                    selectedDays.includes(day) && styles.daySelected,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={{
                      color: selectedDays.includes(day) ? '#fff' : '#000',
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Hora (ex: 06:00)</Text>
            <TextInput
              style={styles.input}
              placeholder="00:00"
              value={time}
              onChangeText={setTime}
            />

            <Text style={styles.label}>Duração (min)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="10"
              value={duration}
              onChangeText={setDuration}
            />

            <Text style={styles.label}>Zona</Text>
            <TextInput
              style={styles.input}
              placeholder="Zona 1"
              value={zone}
              onChangeText={setZone}
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>Ativo</Text>
              <Switch value={active} onValueChange={setActive} />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancel} onPress={onClose}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={handleSave}>
                <Text style={{ color: '#fff' }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' },
  modal: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  label: { marginTop: 12, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  day: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 8,
    marginBottom: 8,
  },
  daySelected: {
    backgroundColor: '#00CB21',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  cancel: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  save: {
    backgroundColor: '#00CB21',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});
