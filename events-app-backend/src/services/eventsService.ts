import { Event, Prisma, PrismaClient } from '@prisma/client';
import { UpdateEventInput } from '../schemas/eventSchema';
import fs from 'fs';

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
    include: { images: true, creator: true },
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

export const getImageById = async (imageId: number) => {
  return await prisma.image.findUnique({
    where: { id: imageId },
  });
};

export const deleteImageById = async (imageId: number) => {
  const image = await prisma.image.findUnique({
    where: { id: imageId },
  });
  if (!image) {
    throw new Error('Image not found');
  }

  try {
    const filePath = image.url;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.warn('Failed to unlink image file:', e);
  }

  return await prisma.image.delete({
    where: { id: imageId },
  });
};
