import { z } from 'zod';

export const scheduleSchema = z.object({
  duration: z.number().min(1, 'Duração mínima: 1'),
  frequency: z.string().min(1, 'Frequência obrigatória'),
  days: z.array(z.number()).optional(),
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
  action: z.string().min(1),
  source: z.string().min(1),  
  duration: z.number().optional(),
  humidity: z.number().optional(),
  temperature: z.number().optional(),
  weather: z.string().optional(),
});

export const solicitarRecuperacaoSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export const redefinirSenhaSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  novaSenha: z.string().min(6, 'A nova senha deve ter ao menos 6 caracteres'),
});

 export const signupSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha precisa ter no mínimo 6 caracteres'),
  tenantId: z.preprocess((val) => {
    if (typeof val === 'string') return parseInt(val, 10);
    return val;
  }, z.number()),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export type SolicitarRecuperacaoDTO = z.infer<typeof solicitarRecuperacaoSchema>;
export type RedefinirSenhaDTO = z.infer<typeof redefinirSenhaSchema>;
