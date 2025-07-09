export type Schedule = {
  id: string;
  duration: number;
  frequency: string;
  days: number[];
};

export type Zone = {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  flowRate: number;
  pressure: number;
  emitterCount: number;
  emitterSpacing: number;
  lastWatered?: Date | null;
  nextWatering?: Date | null;
  schedule: Schedule;
  scheduleId: string;
};
