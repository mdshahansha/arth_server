import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../src/modules/auth/auth.service';
import { env } from '../../src/config/env';

describe('JWT service', () => {
  it('verifies a valid token', () => {
    const token = jwt.sign({ sub: 'user-123', jti: 'jti-456' }, env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: 3600,
    });
    const payload = verifyToken(token);
    expect(payload.sub).toBe('user-123');
    expect(payload.jti).toBe('jti-456');
  });

  it('throws TOKEN_INVALID for tampered token', () => {
    const token = jwt.sign({ sub: 'user-123', jti: 'jti-456' }, 'wrong-secret', {
      algorithm: 'HS256',
      expiresIn: 3600,
    });
    expect(() => verifyToken(token)).toThrow('Invalid token');
  });

  it('throws TOKEN_EXPIRED for expired token', () => {
    const token = jwt.sign({ sub: 'user-123', jti: 'jti-456' }, env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: -10,
    });
    expect(() => verifyToken(token)).toThrow('Token has expired');
  });
});
