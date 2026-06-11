import { describe, it, expect, beforeEach } from 'vitest';
import { request, registerAndLogin } from '../helpers';
import { Transaction, User } from '../../src/models';

describe('GET /api/v1/dashboard', () => {
  it('returns 401 without token', async () => {
    const res = await request.get('/api/v1/dashboard');
    expect(res.status).toBe(401);
  });

  it('returns dashboard data with correct shape', async () => {
    const token = await registerAndLogin();

    const user = await User.findOne({ where: { email: 'test@example.com' } });

    await Transaction.bulkCreate([
      {
        user_id: user!.id,
        title: 'Salary',
        category: 'bills',
        amount: 5000,
        type: 'credit',
        transaction_date: new Date(),
      },
      {
        user_id: user!.id,
        title: 'Groceries',
        category: 'food',
        amount: 200,
        type: 'debit',
        transaction_date: new Date(),
      },
      {
        user_id: user!.id,
        title: 'Dinner',
        category: 'food',
        amount: 80,
        type: 'debit',
        transaction_date: new Date(),
      },
    ]);

    const res = await request
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { data } = res.body;
    expect(data.user.email).toBe('test@example.com');
    expect(data.totalSpend).toBe(280);
    expect(data.totalIncome).toBe(5000);
    expect(Array.isArray(data.monthlyBreakdown)).toBe(true);
    expect(Array.isArray(data.categoryBreakdown)).toBe(true);

    if (data.monthlyBreakdown.length > 0) {
      expect(data.monthlyBreakdown[0]).toHaveProperty('month');
      expect(data.monthlyBreakdown[0]).toHaveProperty('debit');
      expect(data.monthlyBreakdown[0]).toHaveProperty('credit');
    }
  });

  it('returns zero totals for user with no transactions', async () => {
    const token = await registerAndLogin();
    const res = await request
      .get('/api/v1/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalSpend).toBe(0);
    expect(res.body.data.totalIncome).toBe(0);
  });
});
