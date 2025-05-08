import { z } from 'zod';

export const createReservationSchema = z.object({
  body: z.object({
    eventId: z.number({ required_error: 'EventID is required' }),
    userId: z.number({ required_error: 'UserID is required' }),
  }),
});

export const reservationParamsSchema = z.object({
  params: z.object({
    id: z.number({ required_error: 'Reservation is required' }),
  }),
});

export const updateReservationSchema = z.object({
  params: z.object({
    id: z.number({ required_error: 'Reservation is required' }),
  }),
  body: z.object({
    eventId: z.number({ required_error: 'EventID is required' }),
    userId: z.number({ required_error: 'UserID is required' }),
  }),
});

export type createReservationInput = z.infer<
  typeof createReservationSchema.shape.body
>;
export type reservationParamsInput = z.infer<
  typeof reservationParamsSchema.shape.params
>;
export type updateReservationInput = z.infer<typeof updateReservationSchema>;
