import {
  PrismaClient,
  ReservationStatus,
  Reservation,
  Ticket,
  TicketStatus,
} from '@prisma/client';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export async function createNewReservation(
  userId: number,
  eventId: number,
  quantity: number = 1
): Promise<
  { reservation: Reservation; tickets: Ticket[] } | 'no_tickets' | null
> {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return null;

  if (event.availableTickets < quantity) return 'no_tickets';

  const reservation = await prisma.reservation.create({
    data: {
      userId,
      eventId,
      status: ReservationStatus.CONFIRMED,
      createdAt: new Date(),
      totalPrice: event.price * quantity,
    },
  });

  const ticketsData = Array.from({ length: quantity }).map(() => ({
    reservationId: reservation.id,
    status: ReservationStatus.CONFIRMED,
  }));
  await prisma.ticket.createMany({ data: ticketsData });

  const tickets = await prisma.ticket.findMany({
    where: { reservationId: reservation.id },
  });

  for (const ticket of tickets) {
    const payload = JSON.stringify({
      ticketId: ticket.id,
      reservationId: reservation.id,
    });
    const dataUrl = await QRCode.toDataURL(payload, { width: 300 });

    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { qrCode: dataUrl },
    });
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { availableTickets: { decrement: quantity } },
  });

  return { reservation, tickets };
}

export async function getUserReservations(userId: number) {
  return prisma.reservation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { event: true, tickets: true },
  });
}

export async function getReservationDetails(reservationId: number) {
  return prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { event: true, tickets: true },
  });
}
export async function cancelReservation(reservationId: number) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });
  if (!reservation) return null;

  const ticketsCount = await prisma.ticket.count({
    where: { reservationId },
  });

  if (reservation.status === ReservationStatus.CONFIRMED && ticketsCount > 0) {
    const [updatedEvent, updatedReservation, updatedTickets] =
      await prisma.$transaction([
        prisma.event.update({
          where: { id: reservation.eventId },
          data: {
            availableTickets: {
              increment: ticketsCount,
            },
          },
        }),
        prisma.reservation.update({
          where: { id: reservationId },
          data: { status: ReservationStatus.CANCELLED },
        }),
        prisma.ticket.updateMany({
          where: { reservationId },
          data: { status: TicketStatus.CANCELLED },
        }),
      ]);

    return updatedReservation;
  }

  await prisma.ticket.updateMany({
    where: { reservationId },
    data: { status: TicketStatus.CANCELLED },
  });
  return prisma.reservation.update({
    where: { id: reservationId },
    data: { status: ReservationStatus.CANCELLED },
  });
}
export async function editReservation(
  reservationId: number | string,
  status: ReservationStatus
): Promise<Reservation | null> {
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(reservationId) },
  });
  if (!reservation) return null;

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
}
