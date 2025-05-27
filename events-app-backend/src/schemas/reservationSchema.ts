import { z } from 'zod';
import { ReservationStatus } from '@prisma/client';

export const createReservationSchema = z.object({
  params: z.object({
    eventId: z
      .string({ required_error: 'Event ID is required' })
      .regex(/^\d+$/, 'Invalid event ID'),
  }),
  body: z
    .object({
      quantity: z
        .number({ invalid_type_error: 'Quantity must be a number' })
        .int('Quantity must be an integer')
        .positive('Quantity must be at least 1')
        .optional(),
    })
    .default({}),
});

export const reservationParamsSchema = z.object({
  params: z.object({
    userId: z.string().regex(/^\d+$/, 'Invalid user ID'),
    reservationId: z.string().regex(/^\d+$/, 'Invalid reservation ID'),
  }),
});

export const updateReservationSchema = z.object({
  params: reservationParamsSchema.shape.params,
  body: z.object({
    status: z.nativeEnum(ReservationStatus, {
      errorMap: () => ({ message: 'Invalid reservation status' }),
    }),
  }),
});

export const deleteReservationSchema = z.object({
  params: reservationParamsSchema.shape.params,
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type ReservationParamsInput = z.infer<
  typeof reservationParamsSchema
>['params'];
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
export type DeleteReservationInput = z.infer<typeof deleteReservationSchema>;
