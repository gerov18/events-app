import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import {
  createReservationHandler,
  deleteReservationHandler,
  editReservationHandler,
  loadReservationHandler,
} from '../controllers/reservationsController';
import {
  createReservationSchema,
  reservationParamsSchema,
  updateReservationSchema,
} from '../schemas/reservationSchema';
import { validate } from '../middlewares/validate';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const result = await prisma.reservation.findMany();
  res.json(result);
});

router.get(
  '/:reservationId',
  [authenticate, validate(reservationParamsSchema)],
  loadReservationHandler
);

router.post(
  '/',
  [authenticate, validate(createReservationSchema)],
  createReservationHandler
);

router.put(
  '/:reservationId',
  [authenticate, validate(updateReservationSchema)],
  editReservationHandler
);

router.delete(
  '/:reservationId',
  [authenticate, validate(reservationParamsSchema)],
  deleteReservationHandler
);

export default router;
