import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
  }),
});

export const categoryParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID format'),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid ID format'),
  }),
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CategoryParamsInput = z.infer<
  typeof categoryParamsSchema
>['params'];
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
