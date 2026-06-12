import { beforeAll, afterAll, beforeEach } from 'vitest';
import { sequelize } from '../src/config/database';
import { redis } from '../src/config/redis';

process.env.NODE_ENV = 'test';

beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  await redis.ping();
});

beforeEach(async () => {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
  await sequelize.truncate({ cascade: true });
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  await redis.flushdb();
});

afterAll(async () => {
  await sequelize.close();
  await redis.quit();
});
