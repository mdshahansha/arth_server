import { describe, it, expect } from 'vitest';
import { request, DEMO_USER, registerUser, loginUser, registerAndLogin } from '../helpers';

describe('POST /api/v1/auth/register', () => {
  it('registers a new user successfully', async () => {
    const res = await registerUser();
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(DEMO_USER.email);
    expect(res.body.data.name).toBe(DEMO_USER.name);
    expect(res.body.data).not.toHaveProperty('password_hash');
  });

  it('returns 409 for duplicate email', async () => {
    await registerUser();
    const res = await registerUser();
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('returns validation error for weak password — no uppercase', async () => {
    const res = await registerUser({ password: 'alllower@1' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    const messages = res.body.error.details.map((d: { message: string }) => d.message);
    expect(messages).toContain('Password must contain at least one uppercase letter');
  });

  it('returns validation error for weak password — no number', async () => {
    const res = await registerUser({ password: 'NoNumber@abc' });
    expect(res.status).toBe(400);
    const messages = res.body.error.details.map((d: { message: string }) => d.message);
    expect(messages).toContain('Password must contain at least one number');
  });

  it('returns validation error for weak password — no special char', async () => {
    const res = await registerUser({ password: 'NoSpecial1a' });
    expect(res.status).toBe(400);
    const messages = res.body.error.details.map((d: { message: string }) => d.message);
    expect(messages).toContain('Password must contain at least one special character');
  });

  it('returns validation error for short password', async () => {
    const res = await registerUser({ password: 'Sh@1' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns validation error for invalid email', async () => {
    const res = await registerUser({ email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('POST /api/v1/auth/login', () => {
  it('returns token on successful login', async () => {
    await registerUser();
    const res = await loginUser();
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(DEMO_USER.email);
    expect(res.body.data.user).not.toHaveProperty('password_hash');
  });

  it('returns 401 for wrong password', async () => {
    await registerUser();
    const res = await loginUser({ password: 'WrongPass@1' });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid email or password');
  });

  it('returns 401 for non-existent user with same message', async () => {
    const res = await loginUser({ email: 'nobody@example.com' });
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Invalid email or password');
  });
});

describe('POST /api/v1/auth/logout', () => {
  it('invalidates the token after logout', async () => {
    const token = await registerAndLogin();

    const beforeLogout = await request
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(beforeLogout.status).toBe(200);

    const logoutRes = await request
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(logoutRes.status).toBe(200);

    const afterLogout = await request
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${token}`);
    expect(afterLogout.status).toBe(401);
    expect(afterLogout.body.error.code).toBe('SESSION_REVOKED');
  });
});
