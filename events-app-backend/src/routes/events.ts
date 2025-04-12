import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { Reservation } from '../models/Reservation';
import { CreateEventInput, Event } from '../models/Event';
import { authenticate } from '../middlewares/authenticate';

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

router.post('/', authenticate, async (req: Request, res: Response) => {
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

router.put('/:id', authenticate, async (req: Request, res: Response) => {
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
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(res.locals.user),
      },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    if (!user) {
      res.status(404).json({ message: "You're not logged in" });
      return;
    }

    if (event?.createdBy !== res.locals.user || res.locals.user !== 'ADMIN') {
      res
        .status(403)
        .json({ message: "Forbidden: you can't access this page" });
      return;
    }

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

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(res.locals.user),
      },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    if (!user) {
      res.status(404).json({ message: "You're not logged in" });
      return;
    }

    if (event?.createdBy !== res.locals.user || res.locals.user !== 'ADMIN') {
      res
        .status(403)
        .json({ message: "Forbidden: you can't access this page" });
      return;
    }

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
