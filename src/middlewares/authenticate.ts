import { Request, Response, NextFunction } from 'express';
import { verifyToken, sessionExists } from '../modules/auth/auth.service';
import { ApiError } from '../utils/ApiError';

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const queryToken = req.query.token as string | undefined;
    if (!header?.startsWith('Bearer ') && !queryToken) {
      throw ApiError.unauthorized('Authorization token is required', 'TOKEN_MISSING');
    }

    const token = header?.startsWith('Bearer ') ? header.slice(7) : queryToken!;
    const payload = verifyToken(token);

    const active = await sessionExists(payload.sub, payload.jti);
    if (!active) {
      throw ApiError.unauthorized('Session has been revoked', 'SESSION_REVOKED');
    }

    req.user = { id: payload.sub };
    req.tokenPayload = { sub: payload.sub, jti: payload.jti };
    next();
  } catch (err) {
    next(err);
  }
}
