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

export const sensorDataSchema = z.object({
  soilMoisture: z.number().min(0).max(100),
  temperature: z.number().min(-20).max(60),
  weather: z.string(),
});


export const bombaStateSchema = z.object({
  ligada: z.boolean(),
});


export const configSchema = z.object({
  modoAuto: z.boolean(),
  pausarChuva: z.boolean(),
  umidadeMin: z.boolean(),
  notificacoes: z.boolean(),
});

export const zoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'inactive']),
});

export function safeParse<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('Validation error:', result.error);
    return null;
  }
  return result.data;
}

export const historyFilterSchema = z.object({
  date: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  zone: z.string(),
  type: z.string(),
  searchTerm: z.string(),
  minDuration: z.string().optional(),
  maxDuration: z.string().optional(),
});

export const validateHistoryFilters = (filters: any): HistoryFilter => {
  const result = historyFilterSchema.safeParse(filters);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export const safeValidateHistoryFilters = (filters: any): HistoryFilter | undefined => {
  const result = historyFilterSchema.safeParse(filters);
  if (!result.success) {
    console.warn('Filtros inválidos (local):', result.error.format());
    return undefined;
  }
  return result.data;
};

export const signUpSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  rememberMe: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos e condições',
  }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  senha: z.string().min(6, { message: 'Senha deve ter ao menos 6 caracteres' }),
});

export const DripZoneArraySchema = z.array(DripZoneSchema);
export type DripZone = z.infer<typeof DripZoneSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
export type HistoryFilter = z.infer<typeof historyFilterSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;