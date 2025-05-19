import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const createOrganiser = async (data: {
  name: string;
  email: string;
  password: string;
  description?: string;
  phone?: string;
  website?: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.organiser.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const getAllOrganisers = () => prisma.organiser.findMany();

export const getOrganiserById = (id: number) =>
  prisma.organiser.findUnique({ where: { id } });

export const updateOrganiser = (
  id: number,
  data: Partial<Omit<Parameters<typeof createOrganiser>[0], 'password'>>
) => prisma.organiser.update({ where: { id }, data });

export const deleteOrganiser = (id: number) =>
  prisma.organiser.delete({ where: { id } });
