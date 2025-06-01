import { Event, Prisma, PrismaClient } from '@prisma/client';
import { UpdateEventInput } from '../schemas/eventSchema';

const prisma = new PrismaClient();

export const getAllEvents = async (
  where?: Prisma.EventWhereInput,
  take?: number
): Promise<Event[]> => {
  return await prisma.event.findMany({
    where: where || {},
    orderBy: { date: 'asc' },
    take: take,
    include: {
      category: true,
      images: true,
    },
  });
};

export const getEventById = async (id: number) => {
  return await prisma.event.findUnique({
    where: { id },
    include: { images: true },
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

export const updateEvent = async (
  id: number,
  data: Partial<UpdateEventInput['body']>
) => {
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
