import { Injectable } from '@nestjs/common';
import { config as loadDotEnv } from 'dotenv';
import { envSchema, EnvVars } from './env.schema';

@Injectable()
export class ConfigService {
  private readonly env: EnvVars;

  constructor() {
    loadDotEnv();
    this.env = envSchema.parse(process.env);
  }

  get<K extends keyof EnvVars>(key: K): EnvVars[K] {
    return this.env[key];
  }
}
