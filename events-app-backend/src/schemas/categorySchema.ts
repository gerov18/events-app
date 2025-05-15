import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});

export const categoryParamsSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CategoryParamsInput = z.infer<typeof categoryParamsSchema>;
