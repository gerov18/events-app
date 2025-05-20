import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email ' }),
  password: z.string().min(6, { message: 'Password must be at least 6' }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email ' }),
  password: z.string().min(6, { message: 'Password must be at least 6' }),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
});

export const deleteSchema = z.object({
  email: z.string().email({ message: 'Invalid email ' }),
  password: z.string().min(6, { message: 'Password must be at least 6' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type DeleteInput = z.infer<typeof deleteSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
