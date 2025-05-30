import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Authorization token is missing' });
    return;
  }
  const secret = process.env.JWT_SECRET;

  try {
    if (!secret) {
      res.status(500).json({ message: 'JWT secret is not defined' });
      return;
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (decoded && typeof decoded !== 'string' && 'id' in decoded) {
      res.locals.user = decoded;
      next();
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
