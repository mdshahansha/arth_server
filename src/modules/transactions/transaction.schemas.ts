import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .default(10)
    .transform((val) => Math.min(val, 50)),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export const createTransactionSchema = z.object({
  title: z.string().min(1).max(255),
  category: z.enum(['food', 'travel', 'shopping', 'bills', 'entertainment']),
  amount: z.number().positive(),
  type: z.enum(['debit', 'credit']),
  transaction_date: z.string().datetime().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
