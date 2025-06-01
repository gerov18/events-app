import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import {
  getUserReservationsHandler,
  getReservationDetailsHandler,
  updateReservationHandler,
  cancelReservationHandler,
} from '../controllers/reservationsController';
import z from 'zod';
import { validate } from '../middlewares/validate';
import {
  deleteReservationSchema,
  reservationParamsSchema,
  updateReservationSchema,
} from '../schemas/reservationSchema';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/', authenticate, getUserReservationsHandler);

router.get(
  '/:reservationId',
  authenticate,
  validate(reservationParamsSchema),
  getReservationDetailsHandler
);

router.get(
  '/users/:userId/reservations',
  authenticate,
  getUserReservationsHandler
);

router.patch(
  '/:reservationId',
  authenticate,
  validate(updateReservationSchema),
  updateReservationHandler
);

router.post(
  '/:reservationId',
  authenticate,
  validate(deleteReservationSchema),
  cancelReservationHandler
);

export default router;
