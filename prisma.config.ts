import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please create a .env file with DATABASE_URL.');
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
});

