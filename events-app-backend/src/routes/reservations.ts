import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import {
  createReservationHandler,
  deleteReservationHandler,
  editReservationHandler,
  loadReservationHandler,
} from '../controllers/reservationsController';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const result = await prisma.reservation.findMany();
  res.json(result);
});

router.get('/:reservationId', authenticate, loadReservationHandler);

router.post('/', authenticate, createReservationHandler);

router.put('/:reservationId', authenticate, editReservationHandler);

router.delete('/:reservationId', authenticate, deleteReservationHandler);

export default router;
