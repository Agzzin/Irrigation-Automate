import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { DripZone } from './ZonesScreen';

interface ZoneModalProps {
  visible: boolean;
  onClose: () => void;
  currentZone: DripZone | null;
  setCurrentZone: React.Dispatch<React.SetStateAction<DripZone | null>>;
  onSave: (zone: DripZone) => void;
}

const ZoneModal: React.FC<ZoneModalProps> = ({ visible, onClose, currentZone, setCurrentZone, onSave }) => {

  function isFormValid(zone: DripZone | null): boolean {
    if (!zone) return false;
    if (!zone.name || zone.name.trim() === '') return false;
    if (!zone.flowRate || zone.flowRate <= 0) return false;
    if (!zone.pressure || zone.pressure <= 0) return false;
    if (!zone.emitterCount || zone.emitterCount <= 0) return false;
    if (!zone.emitterSpacing || zone.emitterSpacing <= 0) return false;
    if (!zone.schedule) return false;
    if (!zone.schedule.duration || zone.schedule.duration <= 0) return false;
    if (!zone.schedule.frequency) return false;
    return true;
  }

  const formIsValid = isFormValid(currentZone);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {currentZone ? 'Editar Zona' : 'Nova Zona de Gotejamento'}
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome da Zona</Text>
          <TextInput
            style={styles.input}
            value={currentZone?.name || ''}
            onChangeText={text => setCurrentZone((prev: DripZone | null) => ({
              ...(prev || {} as DripZone),
              name: text
            }))}
            placeholder="Ex: Canteiro A, Vasos Varanda"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Configuração Técnica</Text>
          <View style={styles.techSpecs}>
            <View style={styles.specInput}>
              <Text style={styles.specLabel}>Vazão (mL/h):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={currentZone?.flowRate?.toString() || ''}
                onChangeText={text => setCurrentZone((prev: DripZone | null) => ({
                  ...(prev || {} as DripZone),
                  flowRate: Number(text) || 0
                }))}
              />
            </View>
            <View style={styles.specInput}>
              <Text style={styles.specLabel}>Pressão (psi):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={currentZone?.pressure?.toString() || ''}
                onChangeText={text => setCurrentZone((prev: DripZone | null) => ({
                  ...(prev || {} as DripZone),
                  pressure: Number(text) || 0
                }))}
              />
            </View>
            <View style={styles.specInput}>
              <Text style={styles.specLabel}>Nº Emissores:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={currentZone?.emitterCount?.toString() || ''}
                onChangeText={text => setCurrentZone((prev: DripZone | null) => ({
                  ...(prev || {} as DripZone),
                  emitterCount: Number(text) || 0
                }))}
              />
            </View>
            <View style={styles.specInput}>
              <Text style={styles.specLabel}>Espaçamento (cm):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={currentZone?.emitterSpacing?.toString() || ''}
                onChangeText={text => setCurrentZone((prev: DripZone | null) => ({
                  ...(prev || {} as DripZone),
                  emitterSpacing: Number(text) || 0
                }))}
              />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Programação</Text>
          <View style={styles.scheduleControl}>
            <Text style={styles.specLabel}>Duração (min):</Text>
            <TextInput
              style={[styles.input, { width: 100 }]}
              keyboardType="numeric"
              value={currentZone?.schedule?.duration?.toString() || ''}
              onChangeText={text => setCurrentZone((prev: DripZone | null) => ({
                ...(prev || {} as DripZone),
                schedule: {
                  ...(prev?.schedule || { frequency: 'daily' }),
                  duration: Number(text) || 0
                }
              }))}
            />
          </View>
          <View style={styles.scheduleControl}>
            <Text style={styles.specLabel}>Frequência:</Text>
            <View style={styles.frequencyOptions}>
              {['daily', 'weekly'].map(freq => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.freqButton,
                    currentZone?.schedule?.frequency === freq && styles.freqButtonActive
                  ]}
                  onPress={() => setCurrentZone((prev: DripZone | null) => ({
                    ...(prev || {} as DripZone),
                    schedule: {
                      ...(prev?.schedule || { duration: 0 }),
                      frequency: freq as 'daily' | 'weekly'
                    }
                  }))}
                >
                  <Text style={styles.freqButtonText}>
                    {freq === 'daily' ? 'Diário' : 'Semanal'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !formIsValid && styles.saveButtonDisabled]}
          onPress={() => {
            if (currentZone && formIsValid) {
              onSave(currentZone);
            }
          }}
          disabled={!formIsValid}
        >
          <Text style={styles.saveButtonText}>Salvar Configurações</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  techSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specInput: {
    width: '48%',
    marginBottom: 12,
  },
  specLabel: {
    fontSize: 14,
    color: '#757575',
  },
  scheduleControl: {
    marginBottom: 16,
  },
  frequencyOptions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  freqButton: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    marginRight: 8,
  },
  freqButtonActive: {
    backgroundColor: '#296C321A',
    borderColor: '#296C32',
  },
  freqButtonText: {
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#296C32',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#A5D6A7', 
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ZoneModal;
