import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { CreateUserInput } from '../models/User';
import {
  createUser,
  deleteUser,
  editUser,
  loadUser,
} from '../controllers/userController';

const router = Router();

const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  const result = await prisma.user.findMany();
  res.json(result);
});

router.post('/', createUser);

router.get('/:id', loadUser);

router.put('/:id', editUser);

router.delete('/:id', deleteUser);

export default router;
