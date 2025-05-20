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

export const organiserCreateSchema = organiserSchema.omit({
  id: true,
  createdAt: true,
});
export type OrganiserCreateInput = z.infer<typeof organiserCreateSchema>;
export type OrganiserLoginInput = z.infer<typeof organiserLoginSchema>;
export type Organiser = z.infer<typeof organiserSchema>;
