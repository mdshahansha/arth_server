import { app } from './app';
import { env, connectDatabase, connectRedis } from './config';
import { logger } from './utils/logger';

async function bootstrap() {
  await connectDatabase();
  await connectRedis();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
