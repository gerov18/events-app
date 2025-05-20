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

export const organiserLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const updateOrganiserSchema = z.object({
  params: organiserParamsSchema.shape.params,
  body: createOrganiserSchema.shape.body.partial(),
});

export const deleteOrganiserSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

export type DeleteOrganiserInput = z.infer<
  typeof deleteOrganiserSchema
>['body'];
export type CreateOrganiserInput = z.infer<
  typeof createOrganiserSchema
>['body'];
export type OrganiserParamsInput = z.infer<
  typeof organiserParamsSchema
>['params'];
export type UpdateOrganiserInput = z.infer<typeof updateOrganiserSchema>;
