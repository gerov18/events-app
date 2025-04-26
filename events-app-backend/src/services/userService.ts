import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserInput, UserRole } from '../models/User';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
};

export const updateUserData = async (
  targetUserId: number | string,
  loggedUserId: number | string,
  data: Partial<User>
) => {
  const targetUser = await prisma.user.findUnique({
    where: {
      id: Number(targetUserId),
    },
  });
  if (!loggedUserId) {
    return 'not logged';
  }

  const loggedUser = await prisma.user.findUnique({
    where: {
      id: Number(loggedUserId),
    },
  });

  const updatedData = {
    ...data,
    password: data.password ? await bcrypt.hash(data.password, 10) : undefined,
  };

  if (!targetUser) {
    return null;
  }

  if (
    Number(targetUserId) !== Number(loggedUserId)
    // ||// loggedUser.role !== 'ADMIN'
  ) {
    return 'forbidden';
  }
  return await prisma.user.update({
    where: {
      id: Number(targetUserId),
    },
    data: updatedData,
  });
};

export const deleteUserById = async (
  targetUserId: number | string,
  loggedUserId: number | string
) => {
  const targetUser = await prisma.user.findUnique({
    where: {
      id: Number(targetUserId),
    },
  });
  const loggedUser = await prisma.user.findUnique({
    where: {
      id: Number(loggedUserId),
    },
  });

  if (!targetUser) {
    return null;
  }

  if (!loggedUser) {
    return 'not logged';
  }

  if (targetUser.id !== loggedUser.id || loggedUser.role !== 'ADMIN') {
    return 'forbidden';
  }
  return await prisma.user.delete({
    where: {
      id: Number(targetUserId),
    },
  });
};

export const createNewUser = async (data: CreateUserInput) => {
  const updatedData = {
    ...data,
    password: await bcrypt.hash(data.password, 10),
  };

  return await prisma.user.create({
    data: {
      ...updatedData,
      createdAt: new Date(),
    },
  });
};
