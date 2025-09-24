import { createClient } from 'redis';

// Check if REDIS_URL is valid, otherwise use localhost fallback
const getRedisUrl = () => {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl || redisUrl === 'database_provisioning_in_progress' || !redisUrl.startsWith('redis://')) {
        return 'redis://localhost:6379';
    }
    return redisUrl;
};

const redisClient = createClient({
    url: getRedisUrl(),
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