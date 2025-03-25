import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';

const router = Router();

const prisma = new PrismaClient();
router.get('/', async (req: Request, res: Response) => {
  const result = await prisma.user.findMany();
  res.json(result);
});

export default router;
