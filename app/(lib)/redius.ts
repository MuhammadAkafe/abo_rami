import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://localhost:6379'
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