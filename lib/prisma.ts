import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in your environment variables.');
  throw new Error('DATABASE_URL environment variable is required');
}
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['info', 'query', 'error', 'warn'] : ['error'],
    // errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
