import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCategories = () => {
  return prisma.category.findMany();
};

export const getCategoryById = (id: number | string) => {
  return prisma.category.findUnique({
    where: { id: Number(id) },
  });
};

export const createNewCategory = (name: string) => {
  return prisma.category.create({
    data: { name },
  });
};
