import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.number().int().positive('Please select category '),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  price: z.number().nonnegative('Invalid price'),
});

export type EventInput = z.infer<typeof eventSchema>;
