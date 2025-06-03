import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email ' }),
  password: z.string().min(6, { message: 'Password must be at least 6' }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email ' }),
  password: z.string().min(6, { message: 'Password must be at least 6' }),
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, { message: 'First name is required' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, { message: 'Last name is required' }),
  username: z
    .string({ required_error: 'Username is required' })
    .min(1, { message: 'Username is required' }),
});

export const deleteSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

export const updateUserSchema = z.object({
  email: z.string().email('Невалиден email').optional(),
  username: z.string().min(1, 'Username не може да е празно').optional(),
  firstName: z.string().min(1, 'First name не може да е празно').optional(),
  lastName: z.string().min(1, 'Last name не може да е празно').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 symbols long')
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DeleteInput = z.infer<typeof deleteSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
