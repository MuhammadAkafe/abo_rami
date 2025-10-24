// Test database connection
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const userCount = await prisma.users.count();
    console.log(`✅ Database query successful! Found ${userCount} users.`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    
    if (error.message.includes('the URL must start with the protocol')) {
      console.error('🔧 Issue: DATABASE_URL is not properly formatted or not set');
      console.error('Current DATABASE_URL:', process.env.DATABASE_URL);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
