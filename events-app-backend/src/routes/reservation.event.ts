import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { createReservationHandler } from '../controllers/reservationsController';
import { createReservationSchema } from '../schemas/reservationSchema';
import { validate } from '../middlewares/validate';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post(
  '/',
  authenticate,
  validate(createReservationSchema),
  createReservationHandler
);

export default router;
