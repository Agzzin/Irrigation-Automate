import React, {useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import ZoneModal from '../modal/ZoneModal';
import {useZones} from '../contexts/ZonesContext';

export type DripZone = {
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

const STORAGE_KEY = '@drip_zones';

const DripZonesScreen = () => {
  const {zones, isLoading, error, toggleZoneStatus, refetch} = useZones();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentZone, setCurrentZone] = useState<DripZone | null>(null);
  const [localZones, setLocalZones] = useState<DripZone[]>([]);

  const loadZones = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const savedZones = JSON.parse(jsonValue);
        setLocalZones(savedZones);
      } else if (zones) {
        setLocalZones(
          (zones ?? []).map((z: any) => ({
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
          })),
        );
      }
    } catch (e) {
      console.error('Erro ao carregar zonas do AsyncStorage', e);
      if (zones) {
        setLocalZones(
          (zones ?? []).map((z: any) => ({
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
          }),
        ));
      }
    }
  };

  const saveZones = async (zonesToSave: DripZone[]) => {
    try {
      const jsonValue = JSON.stringify(zonesToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Erro ao salvar zonas no AsyncStorage', e);
    }
  };

  useEffect(() => {
    loadZones();
  }, [zones]);

  useEffect(() => {
    saveZones(localZones);
  }, [localZones]);

  const toggleZone = (zoneId: string) => {
    setLocalZones(prev =>
      prev.map(zone => {
        if (zone.id === zoneId) {
          const toggleStatus = (status: 'active' | 'inactive' | 'error'): 'active' | 'inactive' => {
            return status === 'active' ? 'inactive' : 'active';
          };

          const newStatus = toggleStatus(zone.status);

          const updatedZone = {...zone, status: newStatus};
          toggleZoneStatus(updatedZone);
          return updatedZone;
        }
        return zone;
      }),
    );
  };

  const deleteZone = (zoneId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar esta zona?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: () => {
            setLocalZones(prevZones => prevZones.filter(z => z.id !== zoneId));
          },
        },
      ],
      {cancelable: true},
    );
  };

  const formatDays = (days: number[]) => {
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days.map(day => dayNames[day]).join('/');
  };

  if (isLoading) return <Text>Carregando zonas...</Text>;
  if (error) return <Text>Erro ao carregar zonas</Text>;

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
            : item.schedule.frequency === 'weekly' && item.schedule.days?.length
              ? `${formatDays(item.schedule.days)} - ${item.schedule.duration}min`
              : `Personalizado - ${item.schedule.duration}min`}
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

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteZone(item.id)}>
          <Text style={[styles.actionButtonText, {color: 'red'}]}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zonas de Gotejamento</Text>

      <FlatList
        data={localZones}
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
        onSave={async zone => {
          try {
            const zoneToSend = {
              ...zone,
              status: zone.status || 'inactive',
            };
            const response = await fetch(
              'https://c6579a4c806f.ngrok-free.app/api/zones',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(zoneToSend),
              },
            );
            const savedZone = await response.json();

            if (typeof refetch === 'function') {
              await refetch();
            }

            setLocalZones(prev => {
              const exists = prev.some(z => z.id === savedZone.id);
              if (exists) {
                return prev.map(z => (z.id === savedZone.id ? savedZone : z));
              } else {
                return [...prev, savedZone];
              }
            });
          } catch (e) {
            console.error('Erro ao salvar zona na API', e);
          }
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
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#296C32',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  zoneCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  statusActive: {
    backgroundColor: '#c8e6c9',
  },
  statusError: {
    backgroundColor: '#ffcdd2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  zoneSpecs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 12,
    color: '#666',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  zoneSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  zoneActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default DripZonesScreen;