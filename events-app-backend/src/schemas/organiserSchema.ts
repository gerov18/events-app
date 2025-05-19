import { z } from 'zod';

export const createOrganiserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    description: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
  }),
});

export const organiserParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID'),
  }),
});

export const updateOrganiserSchema = z.object({
  params: organiserParamsSchema.shape.params,
  body: createOrganiserSchema.shape.body.partial(),
});

export type CreateOrganiserInput = z.infer<
  typeof createOrganiserSchema
>['body'];
export type OrganiserParamsInput = z.infer<
  typeof organiserParamsSchema
>['params'];
export type UpdateOrganiserInput = z.infer<typeof updateOrganiserSchema>;
