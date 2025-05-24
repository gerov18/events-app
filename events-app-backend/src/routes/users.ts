import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';
import { CreateUserInput } from '../models/User';
import {
  createUser,
  deleteUserWithCredentialsHandler,
  loadUser,
  updateUserHandler,
} from '../controllers/userController';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  deleteUserSchema,
  updateUserSchema,
} from '../schemas/authenticationSchema';

const router = Router();

const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  const result = await prisma.user.findMany();
  res.json(result);
});

router.post('/', createUser);

router.get('/:id', authenticate, loadUser);

router.patch(
  '/me/edit',
  authenticate,
  validate(updateUserSchema),
  updateUserHandler
);

router.post(
  '/me/delete',
  [authenticate, validate(deleteUserSchema)],
  deleteUserWithCredentialsHandler
);

export default router;
