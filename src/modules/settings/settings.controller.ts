import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { updateProfile, changePassword } from './settings.service';

export const updateProfileHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateProfile(req.user!.id, req.body);
  sendSuccess(res, user, 'Profile updated');
});

export const changePasswordHandler = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await changePassword(req.user!.id, currentPassword, newPassword);
  sendSuccess(res, null, 'Password changed');
});
