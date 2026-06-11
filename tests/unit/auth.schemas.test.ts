import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../../src/modules/auth/auth.schemas';

describe('registerSchema', () => {
  const valid = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Strong@123',
  };

  it('accepts valid input', () => {
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'J' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...valid, email: 'notanemail' });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'alllower@1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Password must contain at least one uppercase letter');
    }
  });

  it('rejects password without lowercase', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'ALLUPPER@1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Password must contain at least one lowercase letter');
    }
  });

  it('rejects password without number', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'NoNumber@abc' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Password must contain at least one number');
    }
  });

  it('rejects password without special character', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'NoSpecial1a' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain('Password must contain at least one special character');
    }
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'Sh@1' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid input', () => {
    const result = loginSchema.safeParse({ email: 'john@example.com', password: 'pass' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'bad', password: 'pass' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'john@example.com', password: '' });
    expect(result.success).toBe(false);
  });
});
