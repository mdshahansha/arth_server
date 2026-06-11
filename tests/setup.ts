import { beforeAll, afterAll, beforeEach } from 'vitest';
import { sequelize } from '../src/config/database';
import { redis } from '../src/config/redis';

process.env.NODE_ENV = 'test';

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  await redis.connect();
});

beforeEach(async () => {
  await sequelize.truncate({ cascade: true });
  await redis.flushdb();
});

afterAll(async () => {
  await sequelize.close();
  await redis.quit();
});
