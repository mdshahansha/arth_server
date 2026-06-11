import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) =>
      redis.call(args[0], ...args.slice(1)) as unknown as ReturnType<
        typeof RedisStore.prototype.sendCommand
      >,
  }),
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again after 15 minutes.',
    },
  },
});
