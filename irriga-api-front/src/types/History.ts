export type IrrigationEvent = {
  id: string;
  date: string;
  time: string;
  type: 'automático' | 'manual' | 'falha' | 'notificação';
  action: string;
  duration: string;
  zones: string[];
  source: 'Automático' | 'Manual' | 'Horário Personalizado';
  humidity: string;
  weather: string;
  status: 'success' | 'error' | 'warning';
};

export type FilterOptions = {
  date: string;
  zone: string;
  type: string;
  searchTerm: string;
};