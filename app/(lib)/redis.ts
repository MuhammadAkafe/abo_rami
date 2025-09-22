import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        // Add timeout settings for Vercel KV
        connectTimeout: 10000,
        // commandTimeout: 5000,
    }
});

redisClient.on('connect', () => {
    if (!redisClient.isOpen) {
        redisClient.connect();
    }
    console.log('Connected to Redis  ✅ ');
});

redisClient.on('error', (error) => {
    console.error('Redis error: ❌', error);
});



export default redisClient;