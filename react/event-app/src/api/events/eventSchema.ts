import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().min(1, 'Date is required'), // date as string
  location: z.string().min(1, 'Location is required'),
  capacity: z.number().int().nonnegative('Invalid capacity'),
  price: z.number().nonnegative('Invalid price'),
  category: z.number().int().nonnegative('Invalid category'),
});

export type EventInput = z.infer<typeof eventSchema>;
