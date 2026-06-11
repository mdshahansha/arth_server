import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

const redisOptions: Redis.RedisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

if (env.REDIS_PASSWORD) {
  redisOptions.password = env.REDIS_PASSWORD;
}

export const redis = new Redis(redisOptions);

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
    logger.info(`Redis connected: ${env.REDIS_HOST}:${env.REDIS_PORT}`);
  } catch (error) {
    logger.fatal({ error }, 'Unable to connect to Redis');
    process.exit(1);
  }
}

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}
