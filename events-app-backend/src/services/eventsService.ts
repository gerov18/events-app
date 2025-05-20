import { Event, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllEvents = async () => {
  return await prisma.event.findMany();
};

export const getEventById = async (id: number) => {
  return await prisma.event.findUnique({
    where: { id },
  });
};

export const createEvent = async (data: {
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  createdBy: number;
  price: number;
  categoryId: number;
}) => {
  return await prisma.event.create({
    data: {
      ...data,
      createdAt: new Date(),
      availableTickets: data.capacity,
    },
  });
};

export const updateEvent = async (id: number, data: Partial<Event>) => {
  return await prisma.event.update({
    where: { id },
    data,
  });
};

export const deleteEvent = async (id: number) => {
  return await prisma.event.delete({
    where: { id },
  });
};
