import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User } from '../../models';
import { redis } from '../../config/redis';
import { env } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import { RegisterInput, LoginInput } from './auth.schemas';

interface TokenPayload {
  sub: string;
  jti: string;
}

interface SessionMeta {
  issuedAt: string;
  userAgent: string;
}

const SESSION_PREFIX = 'session';

function sessionKey(userId: string, jti: string): string {
  return `${SESSION_PREFIX}:${userId}:${jti}`;
}

function getTokenTtlSeconds(): number {
  const match = env.JWT_EXPIRES_IN.match(/^(\d+)(h|m|s|d)$/);
  if (!match) return 86400;
  const [, value, unit] = match;
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return parseInt(value, 10) * (multipliers[unit] || 3600);
}

function stripPasswordHash(userJson: Record<string, unknown>): Record<string, unknown> {
  const { password_hash: _, ...rest } = userJson;
  return rest;
}

export async function registerUser(input: RegisterInput) {
  const existing = await User.findOne({ where: { email: input.email.toLowerCase().trim() } });
  if (existing) {
    throw ApiError.conflict('A user with this email already exists', 'EMAIL_TAKEN');
  }

  const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password_hash: passwordHash,
    profile_image_url: input.profileImageUrl || null,
  });

  return stripPasswordHash(user.toJSON() as unknown as Record<string, unknown>);
}

export async function loginUser(input: LoginInput, userAgent: string) {
  const user = await User.scope('withPassword').findOne({
    where: { email: input.email.toLowerCase().trim() },
  });

  const INVALID_CREDENTIALS_MSG = 'Invalid email or password';

  if (!user) {
    throw ApiError.unauthorized(INVALID_CREDENTIALS_MSG, 'INVALID_CREDENTIALS');
  }

  const passwordValid = await bcrypt.compare(input.password, user.password_hash);
  if (!passwordValid) {
    throw ApiError.unauthorized(INVALID_CREDENTIALS_MSG, 'INVALID_CREDENTIALS');
  }

  const jti = randomUUID();
  const ttlSeconds = getTokenTtlSeconds();
  const token = jwt.sign({ sub: user.id, jti }, env.JWT_SECRET, {
    expiresIn: ttlSeconds,
    algorithm: 'HS256',
  });

  const sessionMeta: SessionMeta = {
    issuedAt: new Date().toISOString(),
    userAgent,
  };
  await redis.set(sessionKey(user.id, jti), JSON.stringify(sessionMeta), 'EX', ttlSeconds);

  return {
    token,
    user: stripPasswordHash(user.toJSON() as unknown as Record<string, unknown>),
  };
}

export async function logoutUser(userId: string, jti: string): Promise<void> {
  await redis.del(sessionKey(userId, jti));
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] }) as TokenPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw ApiError.unauthorized('Token has expired', 'TOKEN_EXPIRED');
    }
    throw ApiError.unauthorized('Invalid token', 'TOKEN_INVALID');
  }
}

export async function sessionExists(userId: string, jti: string): Promise<boolean> {
  const exists = await redis.exists(sessionKey(userId, jti));
  return exists === 1;
}
