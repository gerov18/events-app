import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserByIdAdminHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    console.error('getUserByIdAdminHandler error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUserAdminHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  try {
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: 'User deleted' });

    // await prisma.user.update({ where: { id }, data: { isDeleted: true } });
    // return res.status(200).json({ message: 'User marked as deleted' });
  } catch (err: any) {
    console.error('deleteUserAdminHandler error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserAdminHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  const { email, username, firstName, lastName } = req.body as {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { email, username, firstName, lastName },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });
    res.json(updated);
  } catch (err: any) {
    console.error('updateUserAdminHandler error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
