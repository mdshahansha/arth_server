import { Response } from 'express';

interface SuccessPayload<T> {
  success: true;
  data: T;
  message: string;
}

interface ErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export function sendSuccess<T>(res: Response, data: T, message: string, statusCode = 200): void {
  const body: SuccessPayload<T> = { success: true, data, message };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown[],
): void {
  const body: ErrorPayload = {
    success: false,
    error: { code, message, ...(details && { details }) },
  };
  res.status(statusCode).json(body);
}
