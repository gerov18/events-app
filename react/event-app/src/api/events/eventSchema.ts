import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  categoryId: z
    .number({ invalid_type_error: 'Category is required' })
    .int()
    .positive(),
  date: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), 'Invalid date format'),
  capacity: z
    .number({ invalid_type_error: 'Capacity is required' })
    .int()
    .positive('Capacity must be a positive integer'),
  price: z
    .number({ invalid_type_error: 'Price is required' })
    .nonnegative('Price must be a non-negative number'),
});

export type CreateEventInput = z.infer<typeof eventSchema>;
export type UpdateEventInput = CreateEventInput;
