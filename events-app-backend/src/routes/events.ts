import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { Reservation } from '../models/Reservation';
import { CreateEventInput, Event } from '../models/Event';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const result = await prisma.event.findMany();
  res.json(result);
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await prisma.event.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(result);
});

router.post('/', async (req: Request<CreateEventInput>, res: Response) => {
  const { title, description, date, location, capacity, createdBy, price } =
    req.body;
  try {
    const result = await prisma.event.create({
      data: {
        title,
        description,
        date,
        location,
        capacity,
        createdBy,
        price,
        createdAt: new Date(),
        availableTickets: capacity,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    location,
    capacity,
    createdBy,
    price,
  }: CreateEventInput = req.body;
  try {
    const result = await prisma.event.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
        date,
        location,
        capacity,
        createdBy,
        price,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.event.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
});

export default router;
