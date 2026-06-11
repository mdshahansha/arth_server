import supertest from 'supertest';
import { app } from '../src/app';

export const request = supertest(app);

export const DEMO_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Test@1234',
  profileImageUrl: 'https://example.com/avatar.png',
};

export async function registerUser(overrides = {}) {
  return request.post('/api/v1/auth/register').send({ ...DEMO_USER, ...overrides });
}

export async function loginUser(overrides = {}) {
  const { email, password } = { ...DEMO_USER, ...overrides };
  return request.post('/api/v1/auth/login').send({ email, password });
}

export async function registerAndLogin(overrides = {}) {
  await registerUser(overrides);
  const res = await loginUser(overrides);
  return res.body.data.token as string;
}
