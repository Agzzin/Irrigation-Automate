import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ZoneModal from './ZoneModal';
import {useZones} from '../contexts/ZonesContext';

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
    duration: number;
    frequency: 'daily' | 'weekly' | 'custom';
    days?: number[];
  };
};

const DripZonesScreen = () => {
  const {zones, isLoading, error, toggleZoneStatus} = useZones();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentZone, setCurrentZone] = useState<DripZone | null>(null);
  const [localZones, setLocalZones] = useState<DripZone[]>([]);

  React.useEffect(() => {
    if (zones) {
      setLocalZones((zones ?? []).map((z: any) => ({
        id: z.id,
        name: z.name,
        status: z.status ?? 'inactive',
        flowRate: z.flowRate ?? 0,
        pressure: z.pressure ?? 0,
        emitterCount: z.emitterCount ?? 0,
        emitterSpacing: z.emitterSpacing ?? 0,
        lastWatered: z.lastWatered,
        nextWatering: z.nextWatering,
        schedule: {
          duration: z.schedule?.duration ?? 0,
          frequency: z.schedule?.frequency ?? 'daily',
          days: z.schedule?.days ?? [],
        },
      })));
    }
  }, [zones]);

  const toggleZone = (zoneId: string) => {
    const zone = dripZones.find(z => z.id === zoneId);
    if (zone) {
      toggleZoneStatus(zone);
    }
  };

  if (isLoading) return <Text>Carregando zonas...</Text>;
  if (error) return <Text>Erro ao carregar zonas</Text>;

  const dripZones: DripZone[] = localZones;

  const renderZoneItem = ({item}: {item: DripZone}) => (
    <View style={styles.zoneCard}>
      <View style={styles.zoneHeader}>
        <MaterialIcons
          name="water-drop"
          size={24}
          color={item.status === 'active' ? '#296C32' : '#9E9E9E'}
        />
        <Text style={styles.zoneName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            item.status === 'active' && styles.statusActive,
            item.status === 'error' && styles.statusError,
          ]}>
          <Text style={styles.statusText}>
            {item.status === 'active'
              ? 'Ativo'
              : item.status === 'error'
              ? 'Erro'
              : 'Inativo'}
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
          onPress={() => toggleZone(item.id)}>
          <Text style={styles.actionButtonText}>
            {item.status === 'active' ? 'Desativar' : 'Ativar'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setCurrentZone(item);
            setModalVisible(true);
          }}>
          <Text style={styles.actionButtonText}>Configurar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zonas de Gotejamento</Text>

      <FlatList
        data={dripZones}
        renderItem={renderZoneItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setCurrentZone(null);
          setModalVisible(true);
        }}>
        <Text style={styles.addButtonText}>Nova{'\n'}Zona</Text>
      </TouchableOpacity>

      <ZoneModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setCurrentZone(null);
        }}
        currentZone={currentZone}
        setCurrentZone={setCurrentZone}
        onSave={zone => {
          setLocalZones(prev => {
            const exists = prev.some(z => z.id === zone.id);
            if (exists) {
              return prev.map(z => (z.id === zone.id ? zone : z));
            } else {
              // Gera um id simples se for novo
              return [...prev, {...zone, id: Date.now().toString()}];
            }
          });
          setModalVisible(false);
          setCurrentZone(null);
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
    shadowOffset: {width: 0, height: 2},
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
    borderRadius: 50,
    width: 75,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
export type {DripZone};
