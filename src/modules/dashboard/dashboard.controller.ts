import { Request, Response } from 'express';
import { getDashboardData } from './dashboard.service';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const data = await getDashboardData(req.user!.id);
  sendSuccess(res, data, 'Dashboard data retrieved');
});
