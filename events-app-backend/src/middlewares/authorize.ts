import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authorize = (roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = res.locals.user.id;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user || !roles.includes(user.role)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authorizeOrganiserOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!user?.id) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const organiser = await prisma.organiser.findUnique({
    where: { id: Number(user.id) },
  });

  if (!organiser) {
    res.status(403).json({ message: 'Access denied. Not an organiser.' });
    return;
  }

  next();
};
