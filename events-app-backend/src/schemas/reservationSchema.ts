import { z } from 'zod';

export const reservationParamsSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Reservation ID is required' })
      .regex(/^\d+$/, 'Invalid reservation ID'),
  }),
});

export const createReservationSchema = z.object({
  params: z.object({
    id: z
      .string({ required_error: 'Event ID is required' })
      .regex(/^\d+$/, 'Invalid event ID'),
  }),
});

export const updateReservationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid reservation ID'),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
  }),
});

export const deleteReservationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Invalid reservation ID'),
  }),
});

export const userReservationParamsSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, 'Invalid user ID'),
    reservationId: z.string().regex(/^\d+$/, 'Invalid reservation ID'),
  }),
});

export type UserReservationParams = z.infer<
  typeof userReservationParamsSchema
>['params'];

export type ReservationParamsInput = z.infer<
  typeof reservationParamsSchema
>['params'];
export type CreateReservationInput = z.infer<
  typeof createReservationSchema
>['params'];
export type UpdateReservationInput = {
  params: z.infer<typeof updateReservationSchema>['params'];
  body: z.infer<typeof updateReservationSchema>['body'];
};
export type DeleteReservationInput = z.infer<
  typeof deleteReservationSchema
>['params'];
