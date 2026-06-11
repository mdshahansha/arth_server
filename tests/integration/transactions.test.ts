import { describe, it, expect } from 'vitest';
import { request, registerAndLogin } from '../helpers';
import { Transaction, User } from '../../src/models';

async function seedTransactions(userEmail: string, count: number) {
  const user = await User.findOne({ where: { email: userEmail } });
  const txns = [];
  for (let i = 0; i < count; i++) {
    txns.push({
      user_id: user!.id,
      title: `Transaction ${i + 1}`,
      category: 'food' as const,
      amount: 100 + i,
      type: 'debit' as const,
      transaction_date: new Date(Date.now() - i * 86400000),
    });
  }
  await Transaction.bulkCreate(txns);
}

describe('GET /api/v1/transactions', () => {
  it('returns 401 without token', async () => {
    const res = await request.get('/api/v1/transactions');
    expect(res.status).toBe(401);
  });

  it('returns paginated transactions with correct metadata', async () => {
    const token = await registerAndLogin();
    await seedTransactions('test@example.com', 25);

    const res = await request
      .get('/api/v1/transactions?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(10);
    expect(res.body.data.pagination).toEqual({
      page: 1,
      limit: 10,
      totalItems: 25,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    });
  });

  it('returns last page with hasPrev true and hasNext false', async () => {
    const token = await registerAndLogin();
    await seedTransactions('test@example.com', 25);

    const res = await request
      .get('/api/v1/transactions?page=3&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(5);
    expect(res.body.data.pagination.hasNext).toBe(false);
    expect(res.body.data.pagination.hasPrev).toBe(true);
  });

  it('caps limit at 50', async () => {
    const token = await registerAndLogin();
    await seedTransactions('test@example.com', 60);

    const res = await request
      .get('/api/v1/transactions?page=1&limit=100')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeLessThanOrEqual(50);
    expect(res.body.data.pagination.limit).toBeLessThanOrEqual(50);
  });

  it('returns empty items for out-of-range page', async () => {
    const token = await registerAndLogin();
    await seedTransactions('test@example.com', 5);

    const res = await request
      .get('/api/v1/transactions?page=99&limit=10')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(0);
    expect(res.body.data.pagination.hasNext).toBe(false);
  });

  it('sorts by transaction_date descending', async () => {
    const token = await registerAndLogin();
    await seedTransactions('test@example.com', 5);

    const res = await request
      .get('/api/v1/transactions?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);

    const dates = res.body.data.items.map((t: { transaction_date: string }) =>
      new Date(t.transaction_date).getTime(),
    );
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });
});
