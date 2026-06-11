import { Router } from 'express';
import { getTransactions } from './transaction.controller';
import { authenticate } from '../../middlewares/authenticate';
import { validateQuery } from '../../middlewares/validate';
import { paginationSchema } from './transaction.schemas';

const router = Router();

router.get('/', authenticate, validateQuery(paginationSchema), getTransactions);

export { router as transactionRoutes };
