import { Request, Response } from 'express';
import { getUserTransactions } from './transaction.service';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);

  const data = await getUserTransactions(req.user!.id, { page, limit });
  sendSuccess(res, data, 'Transactions retrieved');
});
