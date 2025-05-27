import { z } from 'zod';

export const createReservationSchema = z.object({
  params: z.object({ eventId: z.string().regex(/^\d+$/, 'Invalid eventId') }),
  body: z.object({ quantity: z.number().int().min(1).optional() }),
});
export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const updateReservationSchema = z.object({
  params: z.object({
    reservationId: z.string().regex(/^\d+$/, 'Invalid reservationId'),
  }),
  body: z.object({ status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']) }),
});
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
