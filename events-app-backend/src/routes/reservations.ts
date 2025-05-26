import { Router } from 'express';
import {
  loadReservationHandler,
  createReservationHandler,
  editReservationHandler,
  deleteReservationHandler,
} from '../controllers/reservationsController';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  reservationParamsSchema,
  createReservationSchema,
  updateReservationSchema,
  deleteReservationSchema,
} from '../schemas/reservationSchema';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/reservations/all', async (req, res) => {
  const result = await prisma.reservation.findMany();
  res.json(result);
});

router.get(
  '/reservations/:id',
  authenticate,
  validate(reservationParamsSchema),
  loadReservationHandler
);

router.post(
  '/events/:id/reservations',
  authenticate,
  validate(createReservationSchema),
  createReservationHandler
);

router.patch(
  '/reservations/:id',
  authenticate,
  validate(updateReservationSchema),
  editReservationHandler
);

router.delete(
  '/reservations/:id',
  authenticate,
  validate(deleteReservationSchema),
  deleteReservationHandler
);

export default router;
