import { Request, Response, NextFunction } from 'express';
import { verifyToken, sessionExists } from '../modules/auth/auth.service';
import { ApiError } from '../utils/ApiError';

/**
 * Two-layer auth: JWT signature verification + Redis session lookup.
 * JWT alone is stateless and cannot be revoked after issue. By also checking
 * Redis for an active session, we gain revocation (logout) without losing
 * the signature-based integrity of JWT.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Authorization token is required', 'TOKEN_MISSING');
    }

    const token = header.slice(7);
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
