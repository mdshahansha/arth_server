import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { errorHandler } from './middlewares/errorHandler';
import { authRoutes } from './modules/auth/auth.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { transactionRoutes } from './modules/transactions/transaction.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger, autoLogging: process.env.NODE_ENV !== 'test' }));

app.get('/api/v1/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' }, message: 'Server is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/transactions', transactionRoutes);

app.use(errorHandler);

export { app };
