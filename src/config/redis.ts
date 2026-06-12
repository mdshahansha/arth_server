import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

const redisUrl =
  env.REDIS_URL ||
  (env.REDIS_HOST.startsWith('redis://') || env.REDIS_HOST.startsWith('rediss://')
    ? env.REDIS_HOST
    : undefined);

const redisConfig: {
  host: string;
  port: number;
  maxRetriesPerRequest: number;
  username?: string;
  password?: string;
  tls?: Record<string, never>;
} =
  redisUrl !== undefined
    ? {
        ...parseRedisUrl(redisUrl),
        maxRetriesPerRequest: 3,
      }
    : {
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
    logger.info(`Redis connected: ${redisConfig.host}:${redisConfig.port}`);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.fatal(`Unable to connect to Redis: ${errMsg}`);
    process.exit(1);
  }
}

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}

function parseRedisUrl(url: string): {
  host: string;
  port: number;
  username?: string;
  password?: string;
  tls?: Record<string, never>;
} {
  const parsed = new URL(url);

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 6379,
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    tls: parsed.protocol === 'rediss:' ? {} : undefined,
  };
}
