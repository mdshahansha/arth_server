import { Sequelize } from 'sequelize';
import { env } from './env';
import { logger } from '../utils/logger';

const dbName = env.NODE_ENV === 'test' ? env.DB_NAME_TEST : env.DB_NAME;

export const sequelize = new Sequelize(dbName, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'mysql',
  logging: env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: true,
    timestamps: true,
  },
});

export async function connectDatabase(): Promise<void> {
  try {
    await sequelize.authenticate();
  // await sequelize.sync({ alter: true });

    logger.info(`Database connected: ${dbName}@${env.DB_HOST}:${env.DB_PORT}`);
  } catch (error) {
    logger.fatal({ error }, 'Unable to connect to database');
    process.exit(1);
  }
}
