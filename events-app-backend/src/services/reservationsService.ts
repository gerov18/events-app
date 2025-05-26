import { PrismaClient, Reservation, ReservationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const getReservationById = async (
  id: string | number
): Promise<Reservation | null> => {
  return prisma.reservation.findUnique({
    where: { id: Number(id) },
  });
};

export const createNewReservation = async (
  eventId: number | string,
  userId: number | string
): Promise<Reservation | null | 'no_tickets'> => {
  const event = await prisma.event.findUnique({
    where: { id: Number(eventId) },
  });
  if (!event) {
    return null;
  }
  if (event.availableTickets < 1) {
    return 'no_tickets';
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId: Number(userId),
      eventId: Number(eventId),
      status: ReservationStatus.CONFIRMED,
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
  reservationId: number | string,
  status: ReservationStatus
): Promise<Reservation | null> => {
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(reservationId) },
  });
  if (!reservation) {
    return null;
  }

  if (
    reservation.status === ReservationStatus.CONFIRMED &&
    status === ReservationStatus.CANCELLED
  ) {
    await prisma.event.update({
      where: { id: reservation.eventId },
      data: { availableTickets: { increment: 1 } },
    });
  }

  return prisma.reservation.update({
    where: { id: Number(reservationId) },
    data: { status },
  });
};

export const deleteReservation = async (
  reservationId: number | string
): Promise<Reservation | null> => {
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(reservationId) },
  });
  if (!reservation) {
    return null;
  }

  if (reservation.status === ReservationStatus.CONFIRMED) {
    await prisma.event.update({
      where: { id: reservation.eventId },
      data: { availableTickets: { increment: 1 } },
    });
  }

  return prisma.reservation.delete({
    where: { id: Number(reservationId) },
  });
};
