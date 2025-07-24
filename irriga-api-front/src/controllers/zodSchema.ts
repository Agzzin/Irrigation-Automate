import { z } from 'zod';

export const ScheduleSchema = z.object({
  duration: z.number().positive(),
  frequency: z.enum(['daily', 'weekly', 'custom']),
  days: z.array(z.number()).optional(),
});

export const DripZoneSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  status: z.enum(['active', 'inactive', 'error']),
  flowRate: z.number(),
  pressure: z.number(),
  emitterCount: z.number(),
  emitterSpacing: z.number(),
  lastWatered: z.string().optional(),
  nextWatering: z.string().optional(),
  schedule: ScheduleSchema,
});

export const DripZoneArraySchema = z.array(DripZoneSchema);


export type DripZone = z.infer<typeof DripZoneSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
