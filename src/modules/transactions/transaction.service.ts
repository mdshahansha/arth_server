import { Transaction } from '../../models';
import { PaginationInput, CreateTransactionInput } from './transaction.schemas';

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

export async function createTransaction(userId: string, data: CreateTransactionInput) {
  return Transaction.create({
    user_id: userId,
    title: data.title,
    category: data.category,
    amount: data.amount,
    type: data.type,
    transaction_date: data.transaction_date ? new Date(data.transaction_date) : new Date(),
  });
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const txn = await Transaction.findOne({ where: { id: transactionId, user_id: userId } });
  if (!txn) return null;
  await txn.destroy();
  return txn;
}
