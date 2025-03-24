import { z } from 'zod';

const INVALID_SECRET_MESSAGE =
  'Secret must be a valid HMAC SHA-256 with at least 32 characters';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(32, {
    message: INVALID_SECRET_MESSAGE,
  }),
  JWT_EXPIRATION_MS: z.coerce.number().default(9000000), // 15 minutes
  JWT_REFRESH_SECRET: z.string().min(32, {
    message: INVALID_SECRET_MESSAGE,
  }),
  JWT_REFRESH_EXPIRATION_MS: z.coerce.number().default(604800000), // 7 days
  GITHUB_CALLBACK_URL: z.string().url(),
});

export type EnvVars = z.infer<typeof envSchema>;
