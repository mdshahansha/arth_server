import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z
    .string({ error: 'Email is required' })
    .email('Invalid email format'),
  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((val) => /[a-z]/.test(val), {
      message: 'Password must contain at least one lowercase letter',
    })
    .refine((val) => /[0-9]/.test(val), {
      message: 'Password must contain at least one number',
    })
    .refine((val) => /[^A-Za-z0-9]/.test(val), {
      message: 'Password must contain at least one special character',
    }),
  profileImageUrl: z
    .string()
    .url('Profile image must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export const loginSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .email('Invalid email format'),
  password: z
    .string({ error: 'Password is required' })
    .min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
