import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { CreateUserInput } from '../models/User';

const router = Router();

const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  const result = await prisma.user.findMany();
  res.json(result);
});

router.post('/', async (req: Request<CreateUserInput>, res: Response) => {
  const { username, firstName, lastName, email, password, role } = req.body;
  try {
    const result = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password,
        role,
        createdAt: new Date(),
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(result);
});

router.put('/:id', async (req: Request<CreateUserInput>, res: Response) => {
  const { id } = req.params;
  const { username, firstName, lastName, email, password, role } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(res.locals.user),
      },
    });

    if (!user) {
      res.status(404).json({ message: "You're not logged in" });
      return;
    }

    if (user.id !== res.locals.user || res.locals.user !== 'ADMIN') {
      res.status(403).json({ message: "Forbidden: you can't edit this user" });
      return;
    }
    const result = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username,
        firstName,
        lastName,
        email,
        password,
        role,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

router.delete('/:id', async (req: Request<CreateUserInput>, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(res.locals.user),
    },
  });

  if (!user) {
    res.status(404).json({ message: "You're not logged in" });
    return;
  }

  if (user.id !== res.locals.user || res.locals.user !== 'ADMIN') {
    res.status(403).json({ message: "Forbidden: you can't delete this user" });
    return;
  }
  const { id } = req.params;
  try {
    const result = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

export default router;
