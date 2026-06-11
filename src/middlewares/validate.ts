import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/ApiResponse';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = formatZodErrors(result.error);
      sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const details = formatZodErrors(result.error);
      sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
      return;
    }
    Object.assign(req.query, result.data);
    next();
  };
}

function formatZodErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}
