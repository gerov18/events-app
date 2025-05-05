import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { UserRole } from '../models/User';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET;

const generateToken = (userId: number) => {
  if (!secret) {
    throw new Error('secret is not defined!');
  }
  return jwt.sign({ id: userId }, secret, { expiresIn: '24h' });
};

export const registerUser = async (
  email: string,
  password: string,
  username: string,
  firstName: string,
  lastName: string
) => {
  const hashedPass = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      firstName,
      lastName,
      email,
      password: hashedPass,
      createdAt: new Date(),
    },
  });

  return generateToken(user.id);
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User does not exist');
  } else if (!email || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  return generateToken(user.id);
};
