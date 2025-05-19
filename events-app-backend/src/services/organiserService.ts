import { PrismaClient, Organiser } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UpdateOrganiserInput } from '../schemas/organiserSchema';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

const generateToken = (organiser: Organiser) => {
  if (!secret) throw new Error('JWT secret is not defined');

  return jwt.sign({ id: organiser.id, role: 'ORGANISER' }, secret, {
    expiresIn: '7d',
  });
};

export const registerOrganiser = async (data: {
  name: string;
  email: string;
  password: string;
  description?: string;
  phone?: string;
  website?: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const organiser = await prisma.organiser.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  const token = generateToken(organiser);
  return { organiser, token };
};

export const loginOrganiser = async (email: string, password: string) => {
  const organiser = await prisma.organiser.findUnique({ where: { email } });

  if (!organiser || !organiser.password) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, organiser.password);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(organiser);
  return { organiser, token };
};

export const updateOrganiserData = async (
  targetOrganiserId: number | string,
  loggedOrganiserId: number | string,
  data: Partial<Omit<Organiser, 'id' | 'createdAt'>>
) => {
  const targetOrganiser = await prisma.organiser.findUnique({
    where: {
      id: Number(targetOrganiserId),
    },
  });

  if (!loggedOrganiserId) {
    return 'not logged';
  }

  const loggedOrganiser = await prisma.organiser.findUnique({
    where: {
      id: Number(loggedOrganiserId),
    },
  });

  if (!targetOrganiser || !loggedOrganiser) {
    return null;
  }

  if (targetOrganiser.id !== loggedOrganiser.id) {
    return 'unauthorized';
  }

  const updatedData = {
    ...data,
    password: data.password ? await bcrypt.hash(data.password, 10) : undefined,
  };

  return prisma.organiser.update({
    where: { id: Number(targetOrganiserId) },
    data: updatedData,
  });
};

export const getAllOrganisers = () => prisma.organiser.findMany();

export const getOrganiserById = (id: number) =>
  prisma.organiser.findUnique({ where: { id } });

export const updateOrganiser = (id: number, data: UpdateOrganiserInput) =>
  prisma.organiser.update({ where: { id }, data });

export const deleteOrganiser = (id: number) =>
  prisma.organiser.delete({ where: { id } });
