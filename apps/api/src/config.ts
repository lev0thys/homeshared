import { z } from 'zod';

const ConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit faire au moins 32 caractères.'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type AppConfig = z.infer<typeof ConfigSchema>;

export const config: AppConfig = (() => {
  const parsed = ConfigSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Configuration invalide :');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Configuration invalide. Vérifie ton fichier .env');
  }
  return parsed.data;
})();
