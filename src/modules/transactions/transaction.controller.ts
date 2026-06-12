import { Request, Response } from 'express';
import { getUserTransactions, createTransaction, deleteTransaction } from './transaction.service';
import { emitDashboardUpdate } from '../dashboard/dashboard.sse';
import { sendSuccess } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);

  const data = await getUserTransactions(req.user!.id, { page, limit });
  sendSuccess(res, data, 'Transactions retrieved');
});

export const addTransaction = asyncHandler(async (req: Request, res: Response) => {
  const txn = await createTransaction(req.user!.id, req.body);
  emitDashboardUpdate(req.user!.id);
  sendSuccess(res, txn, 'Transaction created', 201);
});

export const removeTransaction = asyncHandler(async (req: Request, res: Response) => {
  const txn = await deleteTransaction(req.user!.id, req.params.id as string);
  if (!txn) throw ApiError.notFound('Transaction not found');
  emitDashboardUpdate(req.user!.id);
  sendSuccess(res, null, 'Transaction deleted');
});
