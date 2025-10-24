import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Please set DATABASE_URL in your environment variables.');
  throw new Error('DATABASE_URL environment variable is required');
}

// Validate DATABASE_URL format
if (!process.env.DATABASE_URL.startsWith('postgresql://') && !process.env.DATABASE_URL.startsWith('postgres://')) {
  console.error('❌ DATABASE_URL must start with postgresql:// or postgres://');
  console.error('Current DATABASE_URL:', process.env.DATABASE_URL);
  throw new Error('DATABASE_URL must start with postgresql:// or postgres://');
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['info', 'query', 'error', 'warn'] : ['error'],
    // errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
