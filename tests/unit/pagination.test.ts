import { describe, it, expect } from 'vitest';
import { paginationSchema } from '../../src/modules/transactions/transaction.schemas';

describe('paginationSchema', () => {
  it('accepts valid page and limit', () => {
    const result = paginationSchema.safeParse({ page: '2', limit: '20' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(20);
    }
  });

  it('applies defaults when omitted', () => {
    const result = paginationSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });

  it('rejects limit over 50', () => {
    const result = paginationSchema.safeParse({ page: '1', limit: '100' });
    expect(result.success).toBe(false);
  });

  it('rejects negative page', () => {
    const result = paginationSchema.safeParse({ page: '-1', limit: '10' });
    expect(result.success).toBe(false);
  });

  it('coerces string numbers', () => {
    const result = paginationSchema.safeParse({ page: '3', limit: '15' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.page).toBe('number');
      expect(typeof result.data.limit).toBe('number');
    }
  });
});
