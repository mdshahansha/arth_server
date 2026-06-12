import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

const redisConfig: {
  host: string;
  port: number;
  maxRetriesPerRequest: number;
  password?: string;
} = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: 3,
};

if (env.REDIS_PASSWORD) {
  redisConfig.password = env.REDIS_PASSWORD;
}

export const redis = new Redis(redisConfig);

export async function connectRedis(): Promise<void> {
  try {
    const pong = await redis.ping();
    if (pong !== 'PONG') throw new Error('Redis ping failed');
    logger.info(`Redis connected: ${env.REDIS_HOST}:${env.REDIS_PORT}`);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.fatal(`Unable to connect to Redis: ${errMsg}`);
    process.exit(1);
  }
}

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}
