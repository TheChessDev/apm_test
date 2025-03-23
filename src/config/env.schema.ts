import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  SESSION_SECRET: z.string().min(1),
});

export type EnvVars = z.infer<typeof envSchema>;
