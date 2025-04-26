import { PrismaClient, Reservation, ReservationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getReservationById = async (
  id: string | number
): Promise<Reservation | null> => {
  const result = await prisma.reservation.findUnique({
    where: {
      id: Number(id),
    },
  });

  return result;
};

export const createNewReservation = async (
  eventId: number | string,
  userId: number | string
): Promise<Reservation | null | 'no_tickets'> => {
  const event = await prisma.event.findUnique({
    where: {
      id: Number(eventId),
    },
  });

  if (event && event?.availableTickets < 1) {
    return 'no_tickets';
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId: Number(userId),
      eventId: Number(eventId),
      status: 'CONFIRMED',
      createdAt: new Date(),
    },
  });

  await prisma.event.update({
    where: { id: Number(eventId) },
    data: { availableTickets: { decrement: 1 } },
  });

  return reservation;
};

export const editReservation = async (
  eventId: number | string,
  status: ReservationStatus
): Promise<Reservation | null> => {
  const reservation = await prisma.reservation.findUnique({
    where: {
      id: Number(eventId),
    },
  });

  const result = await prisma.reservation.update({
    where: { id: Number(eventId) },
    data: { status },
  });

  await prisma.event.update({
    where: { id: Number(eventId) },
    data: { availableTickets: { increment: 1 } },
  });

  return result;
};

export const deleteReservation = async (
  id: string | number
): Promise<Reservation | null> => {
  const result = await prisma.reservation.delete({
    where: {
      id: Number(id),
    },
  });

  return result;
};
