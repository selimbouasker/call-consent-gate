import { config } from 'dotenv';
import env from 'env-var';

config();

export const appConstants = {
  port: env.get('PORT').default(3000).asPortNumber(),
  frontendOrigin: env.get('FRONTEND_ORIGIN').default('http://localhost:5173').asString(),
  databaseUrl: env.get('DATABASE_URL').required().asString(),
  anthropicApiKey: env.get('ANTHROPIC_API_KEY').required().asString(),
  password: env.get('APP_PASSWORD').required().asString(),
};
