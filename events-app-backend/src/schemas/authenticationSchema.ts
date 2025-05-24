import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    password: z.string({ required_error: 'Password is required' }),
    username: z.string({ required_error: 'Username is required' }),
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
  }),
});

export const deleteUserSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email').optional(),
    username: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().min(6, 'Password too short').optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema.shape.body>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema.shape.body>;
export type RegisterUserInput = z.infer<typeof registerSchema.shape.body>;
export type LoginUserInput = z.infer<typeof loginSchema.shape.body>;
