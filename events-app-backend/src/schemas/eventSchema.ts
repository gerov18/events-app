import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
    date: z.preprocess(val => {
      if (typeof val === 'string' || val instanceof Date) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d;
      }
      return undefined;
    }, z.date({ required_error: 'Invalid or missing date' })),
    location: z.string({ required_error: 'Location is required' }),
    capacity: z.number({ required_error: 'Capacity is required' }),
    // createdBy: z.number({ required_error: 'Author is required' }),
    price: z.number({ required_error: 'Price is required' }),
    categoryId: z.number({ required_error: 'Category is required' }),
  }),
});

export const eventParamsSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Event ID is required' }),
  }),
});

export const updateEventSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Event ID is required' }),
  }),
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
    date: z.preprocess(val => {
      if (typeof val === 'string' || val instanceof Date) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d;
      }
      return undefined;
    }, z.date({ required_error: 'Invalid or missing date' })),
    location: z.string({ required_error: 'Location is required' }),
    capacity: z.number({ required_error: 'Capacity is required' }),
    // createdBy: z.number({ required_error: 'Author is required' }),
    price: z.number({ required_error: 'Price is required' }),
    categoryId: z.number({ required_error: 'Category is required' }),
  }),
});

export type CreateEventInput = z.infer<typeof createEventSchema.shape.body>;
export type EventParamsInput = z.infer<typeof eventParamsSchema.shape.params>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
