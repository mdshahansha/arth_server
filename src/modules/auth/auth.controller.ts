import { Request, Response } from 'express';
import { registerUser, loginUser, logoutUser } from './auth.service';
import { sendSuccess } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  sendSuccess(res, user, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'] || 'unknown';
  const result = await loginUser(req.body, userAgent);
  sendSuccess(res, result, 'Login successful');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.user!;
  const { jti } = req.tokenPayload!;
  await logoutUser(id, jti);
  sendSuccess(res, null, 'Logged out successfully');
});
