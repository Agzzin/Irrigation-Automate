import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Zone {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  flowRate?: number;
  pressure?: number;
  emitterCount?: number;
  emitterSpacing?: number;
  lastWatered?: string;
  nextWatering?: string;
  schedule?: {
    duration: number;
    frequency: 'daily' | 'weekly' | 'custom';
    days?: number[];
  };
}

interface ZonesContextType {
  zones: Zone[] | undefined;
  isLoading: boolean;
  error: unknown;
  toggleZoneStatus: (zone: Zone) => Promise<void>;
  refetch: () => void;
}

const ZonesContext = createContext<ZonesContextType | undefined>(undefined);

export function useZones() {
  const context = useContext(ZonesContext);
  if (context === undefined) {
    throw new Error('useZones deve ser usado dentro de um ZonesProvider');
  }
  return context;
}

interface ZonesProviderProps {
  children: ReactNode;
}

export function ZonesProvider({ children }: ZonesProviderProps) {
  const queryClient = useQueryClient();
  const { data: zones, isLoading, error, refetch } = useQuery({
    queryKey: ['zones'],
    queryFn: fetchZones,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const toggleZoneStatus = async (zone: Zone) => {
    const newStatus = zone.status === 'active' ? 'inactive' : 'active';
    await fetch(`https://f6c190ac1817.ngrok-free.app/api/zones/${zone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...zone, status: newStatus }),
    });
    await queryClient.invalidateQueries({ queryKey: ['zones'] });
  };

  return (
    <ZonesContext.Provider value={{ zones, isLoading, error, toggleZoneStatus, refetch }}>
      {children}
    </ZonesContext.Provider>
  );
}

async function fetchZones(): Promise<Zone[]> {
  const res = await fetch('https://f6c190ac1817.ngrok-free.app/api/zones');
  if (!res.ok) throw new Error('Erro ao buscar zonas');
  return res.json();
}
