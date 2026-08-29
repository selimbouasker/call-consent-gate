import { config } from 'dotenv';

config();

export const NODE_ENV = process.env.NODE_ENV;
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const PORT = process.env.PORT ?? 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
