import { Transaction } from '../../models';
import { PaginationInput } from './transaction.schemas';

export async function getUserTransactions(userId: string, pagination: PaginationInput) {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  const { rows: items, count: totalItems } = await Transaction.findAndCountAll({
    where: { user_id: userId },
    order: [['transaction_date', 'DESC']],
    limit,
    offset,
  });

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
