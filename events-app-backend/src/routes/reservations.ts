import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { Reservation, CreateReservationInput } from '../models/Reservation';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const result = await prisma.reservation.findMany();
  res.json(result);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await prisma.reservation.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(result);
});

router.post('/', async (req: Request, res: Response) => {
  const { userId, eventId }: CreateReservationInput = req.body;

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.availableTickets < 1) {
      res.status(400).json({ message: 'No available tickets' });
      return;
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId,
        eventId,
        status: 'CONFIRMED',
        createdAt: new Date(),
      },
    });

    await prisma.event.update({
      where: { id: eventId },
      data: { availableTickets: { decrement: 1 } },
    });

    res.status(201).json(reservation);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error while creating reservation:', error });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation', error });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await prisma.event.delete({
      where: { id: parseInt(id) },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reservation', error });
  }
});

export default router;
