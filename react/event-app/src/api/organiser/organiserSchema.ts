import { z } from 'zod';

export const organiserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  description: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  createdAt: z.string(),
});

export type Organiser = z.infer<typeof organiserSchema>;

export const organiserCreateSchema = organiserSchema.omit({
  id: true,
  createdAt: true,
});
export type OrganiserCreateInput = z.infer<typeof organiserCreateSchema>;
