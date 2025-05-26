import { Request, Response } from 'express';
import {
  createNewReservation,
  deleteReservation,
  editReservation,
  getReservationById,
} from '../services/reservationsService';
import { ReservationStatus } from '@prisma/client';

export const loadReservationHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const reservationId = Number(req.params.id);
  const userId = res.locals.user.id;

  try {
    const reservation = await getReservationById(reservationId);
    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }
    if (reservation.userId !== userId) {
      res
        .status(403)
        .json({ message: "Forbidden: you can't access this reservation" });
      return;
    }
    res.json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reservation' });
    return;
  }
};

export const createReservationHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const eventId = Number(req.params.id);
  const userId = res.locals.user.id;

  try {
    const newRes = await createNewReservation(eventId, userId);
    if (newRes === 'no_tickets') {
      res.status(400).json({ message: 'No available tickets' });
      return;
    }
    res.status(201).json(newRes);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating reservation' });
    return;
  }
};

export const editReservationHandler = async (
  req: Request<{ id: string }, {}, { status: ReservationStatus }>,
  res: Response
) => {
  const reservationId = Number(req.params.id);
  const userId = res.locals.user.id;
  const { status } = req.body;

  try {
    const updated = await editReservation(reservationId, status);
    if (!updated) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }
    if (updated.userId !== userId) {
      res
        .status(403)
        .json({ message: "Forbidden: you can't update this reservation" });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating reservation' });
    return;
  }
};

export const deleteReservationHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const reservationId = Number(req.params.id);
  const userId = res.locals.user.id;

  try {
    const deleted = await deleteReservation(reservationId);
    if (!deleted) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }
    if (deleted.userId !== userId) {
      res
        .status(403)
        .json({ message: "Forbidden: you can't delete this reservation" });
      return;
    }
    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting reservation' });
    return;
  }
};

export const loadUserReservationHandler = async (
  req: Request<{ userId: string; reservationId: string }>,
  res: Response
) => {
  const loggedUserId = res.locals.user.id;
  const paramUserId = Number(req.params.userId);
  const reservationId = Number(req.params.reservationId);

  if (loggedUserId !== paramUserId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }

  const reservation = await getReservationById(reservationId);
  if (!reservation) {
    res.status(404).json({ message: 'Reservation not found' });
    return;
  }

  res.json(reservation);
  return;
};
