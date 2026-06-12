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
