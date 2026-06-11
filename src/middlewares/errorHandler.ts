import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { sendError } from '../utils/ApiResponse';
import { logger } from '../utils/logger';
import { UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.errorCode, err.message, err.details);
    return;
  }

  if (err instanceof UniqueConstraintError) {
    sendError(res, 409, 'DUPLICATE_ENTRY', 'A record with this value already exists');
    return;
  }

  if (err instanceof ForeignKeyConstraintError) {
    sendError(res, 400, 'INVALID_REFERENCE', 'Referenced record does not exist');
    return;
  }

  logger.error({ err }, 'Unhandled error');
  sendError(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred');
}
