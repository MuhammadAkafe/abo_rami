import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in your environment variables.');
  throw new Error('DATABASE_URL environment variable is required');
}

// Create PostgreSQL connection pool with serverless-optimized settings for Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Serverless-optimized settings
  max: 1, // Single connection for serverless (Neon pooler handles the rest)
  idleTimeoutMillis: 20000, // Close idle connections after 20 seconds
  connectionTimeoutMillis: 10000, // 10 second connection timeout
  // SSL is handled by the connection string parameters (sslmode=require)
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // log: process.env.NODE_ENV === 'development' ? ['info', 'query', 'error', 'warn'] : ['error'],
    // errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
