export interface Zone {
  id: string;
  name: string;
  status?: string;
}

export interface HistoryEvent {
  errorMessage?: string;
  id: string;
  eventType: string;
  action: string;
  duration: number;
  humidity?: number;
  temperature?: number;
  weather?: string;
  source: string;
  createdAt: string;
  zones: Zone[];
  status?: 'success' | 'error' | 'warning';
}

export interface FilterOptions {
  date: string;
  zone: string;
  type: string;
  searchTerm: string;
}