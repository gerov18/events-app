import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminDeleteUserHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: 'User deleted by admin' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const adminDeleteOrganiserHandler = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);
  try {
    await prisma.organiser.delete({ where: { id } });
    res.status(200).json({ message: 'Organiser deleted by admin' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
