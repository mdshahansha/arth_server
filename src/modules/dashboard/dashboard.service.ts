import { fn, col, literal, Op } from 'sequelize';
import { User, Transaction } from '../../models';
import { ApiError } from '../../utils/ApiError';

interface MonthlyBreakdown {
  month: string;
  debit: number;
  credit: number;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
}

interface RawAggregate {
  [key: string]: string;
}

export async function getDashboardData(userId: string): Promise<{
  user: Record<string, unknown>;
  totalSpend: number;
  totalIncome: number;
  monthlyBreakdown: MonthlyBreakdown[];
  categoryBreakdown: CategoryBreakdown[];
}> {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'profile_image_url'],
  });

  if (!user) {
    throw ApiError.unauthorized('User not found', 'USER_NOT_FOUND');
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [totals, monthlyRaw, categoryRaw] = await Promise.all([
    Transaction.findAll({
      where: { user_id: userId },
      attributes: ['type', [fn('SUM', col('amount')), 'total']],
      group: ['type'],
      raw: true,
    }) as unknown as Promise<RawAggregate[]>,

    Transaction.findAll({
      where: {
        user_id: userId,
        transaction_date: { [Op.gte]: sixMonthsAgo },
      },
      attributes: [
        [fn('DATE_FORMAT', col('transaction_date'), '%Y-%m'), 'month'],
        'type',
        [fn('SUM', col('amount')), 'total'],
      ],
      group: [fn('DATE_FORMAT', col('transaction_date'), '%Y-%m'), 'type'],
      order: [[fn('DATE_FORMAT', col('transaction_date'), '%Y-%m'), 'ASC']],
      raw: true,
    }) as unknown as Promise<RawAggregate[]>,

    Transaction.findAll({
      where: { user_id: userId, type: 'debit' },
      attributes: ['category', [fn('SUM', col('amount')), 'amount']],
      group: ['category'],
      order: [[literal('SUM(amount)'), 'DESC']],
      raw: true,
    }) as unknown as Promise<RawAggregate[]>,
  ]);

  let totalSpend = 0;
  let totalIncome = 0;
  for (const row of totals) {
    const val = parseFloat(row.total) || 0;
    if (row.type === 'debit') totalSpend = val;
    if (row.type === 'credit') totalIncome = val;
  }

  const monthlyMap = new Map<string, MonthlyBreakdown>();
  for (const row of monthlyRaw) {
    const existing = monthlyMap.get(row.month) || { month: row.month, debit: 0, credit: 0 };
    if (row.type === 'debit') existing.debit = parseFloat(row.total) || 0;
    if (row.type === 'credit') existing.credit = parseFloat(row.total) || 0;
    monthlyMap.set(row.month, existing);
  }
  const monthlyBreakdown: MonthlyBreakdown[] = Array.from(monthlyMap.values());

  const categoryBreakdown: CategoryBreakdown[] = categoryRaw.map((row) => ({
    category: row.category,
    amount: parseFloat(row.amount) || 0,
  }));

  return {
    user: user.toJSON() as unknown as Record<string, unknown>,
    totalSpend,
    totalIncome,
    monthlyBreakdown,
    categoryBreakdown,
  };
}
