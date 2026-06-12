import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { getWalletSummary } from './wallet.service';

export const wallets = asyncHandler(async (req: Request, res: Response) => {
  const data = await getWalletSummary(req.user!.id);
  sendSuccess(res, data, 'Wallets retrieved');
});
