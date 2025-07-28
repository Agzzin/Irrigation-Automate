import { useAuth } from '../contexts/AuthContext';
import { Zone, HistoryEvent, ZoneId } from '../types/history';

 const createApiService = () => {
  const { token } = useAuth();
  const apiBaseUrl = 'https://a9eb1aaadc1f.ngrok-free.app/api'; 

  const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${apiBaseUrl}${endpoint}`;
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro na requisição');
    }

    return response.json();
  };

  const getZones = async (): Promise<Zone[]> => {
    try {
      return await authFetch('/zones');
    } catch (error) {
      console.error('Erro ao buscar zonas:', error);
      throw error;
    }
  };

  const getIrrigationHistory = async (
  zoneId: ZoneId, 
  filters: {
    startDate?: string;
    endDate?: string;
    eventType?: string;
  } = {}
): Promise<HistoryEvent[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.eventType) params.append('eventType', filters.eventType);

    const endpoint = `/zones/${zoneId}/history`; // Sempre com zoneId
    return await authFetch(`${endpoint}?${params.toString()}`);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
};

  const logHistoryEvent = async (
    zoneId: string,
    eventData: {
      eventType: string;
      action: string;
      duration: number;
      humidity?: number;
      temperature?: number;
      weather?: string;
      source: string;
    }
  ): Promise<HistoryEvent> => {
    try {
      return await authFetch(`/zones/${zoneId}/history`, {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error('Erro ao registrar evento:', error);
      throw error;
    }
  };

  return {
    getZones,
    getIrrigationHistory,
    logHistoryEvent,
  };
};

export const useApi = () => {
  return createApiService();
};