import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    lazyConnect: true, // Don't connect immediately, wait for first command or manual connect
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('error', (err) => {
    console.warn('Redis connection error:', err.message);
    // We don't exit process here to allow app to run without Redis (with degraded features)
});

redis.on('connect', () => {
    console.log('Connected to Redis');
});

export default redis;
