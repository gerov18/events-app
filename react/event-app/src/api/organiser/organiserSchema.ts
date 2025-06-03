import { z } from 'zod';

export const organiserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  description: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  password: z.string().min(6),
  website: z.string().nullable().optional(),
  createdAt: z.string(),
});

export const organiserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const deleteOrganiserSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

export const organiserCreateSchema = organiserSchema.omit({
  id: true,
  createdAt: true,
});

export const updateOrganiserSchema = z.object({
  name: z.string().min(1, 'Name е задължително').optional(),
  email: z.string().email('Невалиден email').optional(),
  description: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?\d{7,15}$/, 'Невалиден телефонен номер')
    .optional(),
  website: z.string().url('Невалиден URL').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 symbols long')
    .optional(),
});

export type UpdateOrganiserInput = z.infer<typeof updateOrganiserSchema>;
export type OrganiserCreateInput = z.infer<typeof organiserCreateSchema>;
export type OrganiserLoginInput = z.infer<typeof organiserLoginSchema>;
export type OrganiserDeleteInput = z.infer<typeof deleteOrganiserSchema>;
export type Organiser = z.infer<typeof organiserSchema>;
