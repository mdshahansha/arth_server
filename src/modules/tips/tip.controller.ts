import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { getAllTips, getSavedTipIds, toggleSaveTip } from './tip.service';

export const tips = asyncHandler(async (req: Request, res: Response) => {
  const allTips = await getAllTips();
  const savedIds = req.user ? await getSavedTipIds(req.user.id) : [];
  sendSuccess(res, { tips: allTips, savedIds }, 'Tips retrieved');
});

export const toggleSave = asyncHandler(async (req: Request, res: Response) => {
  const tipId = req.params.tipId as string;
  const saved = await toggleSaveTip(req.user!.id, tipId);
  sendSuccess(res, { tipId, saved }, saved ? 'Tip saved' : 'Tip unsaved');
});
