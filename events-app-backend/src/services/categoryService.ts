import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCategories = () => {
  return prisma.category.findMany();
};

export const getCategoryById = (id: number) => {
  return prisma.category.findUnique({ where: { id } });
};

export const createCategory = (name: string) => {
  return prisma.category.create({ data: { name } });
};

export const updateCategory = (id: number, name: string) => {
  return prisma.category.update({
    where: { id },
    data: { name },
  });
};

export const deleteCategory = (id: number) => {
  return prisma.category.delete({ where: { id } });
};
