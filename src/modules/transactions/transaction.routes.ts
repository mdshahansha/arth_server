import { Router } from 'express';
import { getTransactions, addTransaction, removeTransaction } from './transaction.controller';
import { authenticate } from '../../middlewares/authenticate';
import { validate, validateQuery } from '../../middlewares/validate';
import { paginationSchema, createTransactionSchema } from './transaction.schemas';

const router = Router();

router.get('/', authenticate, validateQuery(paginationSchema), getTransactions);
router.post('/', authenticate, validate(createTransactionSchema), addTransaction);
router.delete('/:id', authenticate, removeTransaction);

export { router as transactionRoutes };
