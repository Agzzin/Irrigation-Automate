import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';

interface Zone {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error'; 
}

interface ZonesContextType {
  zones: Zone[] | undefined;
  isLoading: boolean;
  error: unknown;
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
  const { data: zones, isLoading, error } = useQuery({
    queryKey: ['zones'],
    queryFn: fetchZones,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return (
    <ZonesContext.Provider value={{ zones, isLoading, error }}>
      {children}
    </ZonesContext.Provider>
  );
}

async function fetchZones(): Promise<Zone[]> {
  const res = await fetch('/api/zones');
  if (!res.ok) throw new Error('Erro ao buscar zonas');
  return res.json();
}
