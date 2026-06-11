import { describe, it, expect } from 'vitest';
import { request, registerUser } from '../helpers';

describe('Rate limiting on /api/v1/auth/login', () => {
  it('blocks after 5 attempts within window', async () => {
    await registerUser();

    for (let i = 0; i < 5; i++) {
      await request.post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'WrongPass@1',
      });
    }

    const res = await request.post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'WrongPass@1',
    });

    expect(res.status).toBe(429);
    expect(res.body.error.code).toBe('RATE_LIMIT_EXCEEDED');
  });
});
