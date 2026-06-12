export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: unknown[];

  constructor(statusCode: number, errorCode: string, message: string, details?: unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, errorCode = 'BAD_REQUEST', details?: unknown[]) {
    return new ApiError(400, errorCode, message, details);
  }

  static unauthorized(message: string, errorCode = 'UNAUTHORIZED') {
    return new ApiError(401, errorCode, message);
  }

  static notFound(message: string, errorCode = 'NOT_FOUND') {
    return new ApiError(404, errorCode, message);
  }

  static conflict(message: string, errorCode = 'CONFLICT') {
    return new ApiError(409, errorCode, message);
  }

  static tooMany(message: string) {
    return new ApiError(429, 'RATE_LIMIT_EXCEEDED', message);
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}
