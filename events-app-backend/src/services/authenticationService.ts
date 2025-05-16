import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET;

const generateToken = (user: User) => {
  if (!secret) {
    throw new Error('secret is not defined!');
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: '7d',
    }
  );
  return token;
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

  return { token: generateToken(user), user };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('User does not exist');
  } else if (
    !email ||
    !(
      user.password &&
      (await bcrypt.compare(password, user.password)) &&
      !user.googleId
    )
  ) {
    throw new Error('Invalid credentials');
  }

  return { token: generateToken(user), user };
};

export const getUserByEmailOrUsername = async (
  email: string,
  username: string
) => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
};
