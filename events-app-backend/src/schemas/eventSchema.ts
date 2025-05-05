import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
    date: z.date({ required_error: 'Date is required' }),
    location: z.string({ required_error: 'Location is required' }),
    capacity: z.number({ required_error: 'Capacity is required' }),
    createdBy: z.number({ required_error: 'Author is required' }),
    Price: z.number({ required_error: 'Price is required' }),
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
    date: z.date({ required_error: 'Date is required' }),
    location: z.string({ required_error: 'Location is required' }),
    capacity: z.number({ required_error: 'Capacity is required' }),
    createdBy: z.number({ required_error: 'Author is required' }),
    Price: z.number({ required_error: 'Price is required' }),
  }),
});

export type createEventInput = z.infer<typeof createEventSchema.shape.body>;
export type eventParamsInput = z.infer<typeof eventParamsSchema.shape.params>;
export type updateEventInput = z.infer<typeof updateEventSchema>;
