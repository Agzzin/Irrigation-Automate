import { z } from 'zod';

export const scheduleSchema = z.object({
  duration: z.number().min(1, 'Duração mínima: 1'),
  frequency: z.string().min(1, 'Frequência obrigatória'),
  days: z.array(z.string()).optional(),
});

export const createZoneSchema = z.object({
  name: z.string().min(1),
  status: z.string().min(1),
  flowRate: z.number().nonnegative(),
  pressure: z.number().nonnegative(),
  emitterCount: z.number().int().nonnegative(),
  emitterSpacing: z.number().nonnegative(),
  lastWatered: z.string().datetime().optional(),
  nextWatering: z.string().datetime().optional(),
  schedule: scheduleSchema,
});

export const updateZoneSchema = createZoneSchema.partial();

export const createHistoryEventSchema = z.object({
  eventType: z.string().min(1),
  action: z.string().optional(),
  duration: z.number().optional(),
  humidity: z.number().optional(),
  temperature: z.number().optional(),
  weather: z.string().optional(),
  source: z.string().optional(),
});
