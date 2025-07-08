import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ZoneModal from './ZoneModal';

type DripZone = {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  flowRate: number;
  pressure: number;
  emitterCount: number;
  emitterSpacing: number; 
  lastWatered?: string;
  nextWatering?: string;
  schedule: {
    duration: number; // minutos
    frequency: 'daily' | 'weekly' | 'custom';
    days?: number[];
  };
};

const initialDripZones: DripZone[] = [
  {
    id: '1',
    name: 'Zona de manga',
    status: 'active',
    flowRate: 2000,
    pressure: 15,
    emitterCount: 50,
    emitterSpacing: 30,
    schedule: {
      duration: 30,
      frequency: 'daily',
    }
  },
  {
    id: '2',
    name: 'Zona de uva',
    status: 'active',
    flowRate: 1500,
    pressure: 12,
    emitterCount: 20,
    emitterSpacing: 15,
    schedule: {
      duration: 20,
      frequency: 'weekly',
      days: [1, 3, 5]
    }
  }
];

const DripZonesScreen = () => {
  const [zones, setZones] = useState<DripZone[]>(initialDripZones);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentZone, setCurrentZone] = useState<DripZone | null>(null);

  const toggleZone = (zoneId: string) => {
    setZones(prevZones =>
      prevZones.map(zone =>
        zone.id === zoneId
          ? {
              ...zone,
              status: zone.status === 'active' ? 'inactive' : 'active'
            }
          : zone
      )
    );
  };

  const renderZoneItem = ({ item }: { item: DripZone }) => (
    <View style={styles.zoneCard}>
      <View style={styles.zoneHeader}>
        <MaterialIcons 
          name="water-drop" 
          size={24} 
          color={item.status === 'active' ? '#296C32' : '#9E9E9E'} 
        />
        <Text style={styles.zoneName}>{item.name}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'active' && styles.statusActive,
          item.status === 'error' && styles.statusError
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'active' ? 'Ativo' : item.status === 'error' ? 'Erro' : 'Inativo'}
          </Text>
        </View>
      </View>

      <View style={styles.zoneSpecs}>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Vazão:</Text>
          <Text style={styles.specValue}>{item.flowRate} mL/h</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Emissores:</Text>
          <Text style={styles.specValue}>{item.emitterCount} un</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Pressão:</Text>
          <Text style={styles.specValue}>{item.pressure} psi</Text>
        </View>
      </View>

      <View style={styles.zoneSchedule}>
        <FontAwesome name="clock-o" size={16} color="#666" />
        <Text style={styles.scheduleText}>
          {item.schedule.frequency === 'daily' 
            ? `Diário - ${item.schedule.duration}min` 
            : `Seg/Qua/Sex - ${item.schedule.duration}min`}
        </Text>
      </View>

      <View style={styles.zoneActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleZone(item.id)}
        >
          <Text style={styles.actionButtonText}>
            {item.status === 'active' ? 'Desativar' : 'Ativar'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setCurrentZone(item);
            setModalVisible(true);
          }}
        >
          <Text style={styles.actionButtonText}>Configurar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zonas de Gotejamento</Text>
      
      <FlatList
        data={zones}
        renderItem={renderZoneItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          setCurrentZone(null);
          setModalVisible(true);
        }}
      >
        <MaterialIcons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Nova Zona</Text>
      </TouchableOpacity>

      <ZoneModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentZone={currentZone}
        setCurrentZone={setCurrentZone}
        onSave={zone => {
          if (zone.id) {
            setZones(prev => prev.map(z => z.id === zone.id ? zone : z));
          } else {
            setZones(prev => [...prev, {
              ...zone,
              id: Date.now().toString(),
              status: 'active'
            }]);
          }
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  zoneCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  statusActive: {
    backgroundColor: '#C8E6C9', 
  },
  statusError: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#424242',
  },
  zoneSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  specItem: {
    width: '50%',
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: '#757575',
  },
  specValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  zoneSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
  zoneActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#296C32',
  },
  actionButtonText: {
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#296C32',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
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
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  freqButtonText: {
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DripZonesScreen;
export type { DripZone };