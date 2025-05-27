import { RequestHandler, Response } from 'express';
import {
  getUserReservations,
  getReservationDetails,
  createNewReservation,
  editReservation,
  cancelReservation,
} from '../services/reservationsService';

import { ReservationParamsInput } from '../schemas/reservationSchema';

export const getUserReservationsHandler: RequestHandler = async (req, res) => {
  const userId = Number(res.locals.user.id);
  const reservations = await getUserReservations(userId);
  res.json(reservations);
};

export const getReservationDetailsHandler: RequestHandler<
  ReservationParamsInput
> = async (req, res) => {
  const userId = Number(res.locals.user.id);
  const reservationId = Number(req.params.reservationId);

  const reservation = await getReservationDetails(reservationId);
  if (!reservation) {
    res.status(404).json({ message: 'Reservation not found' });
    return;
  }
  if (reservation.userId !== userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  res.json(reservation);
};

export const createReservationHandler: RequestHandler = async (req, res) => {
  const userId = Number(res.locals.user.id);
  const eventId = Number(req.params.eventId);
  const quantity = Number(req.body.quantity) || 1;

  const result = await createNewReservation(userId, eventId, quantity);
  if (result === 'no_tickets') {
    res.status(400).json({ message: 'No available tickets' });
    return;
  }
  if (result === null) {
    res.status(404).json({ message: 'Event not found' });
    return;
  }
  res.status(201).json(result);
};

// PATCH /user/:userId/reservations/:reservationId
export const updateReservationHandler: RequestHandler<
  ReservationParamsInput
> = async (req, res) => {
  const userId = Number(res.locals.user.id);
  const reservationId = Number(req.params.reservationId);
  const { status } = req.body;

  const reservation = await getReservationDetails(reservationId);
  if (!reservation) {
    res.status(404).json({ message: 'Reservation not found' });
    return;
  }
  if (reservation.userId !== userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  const updated = await editReservation(reservationId, status);
  res.json(updated);
};

export const cancelReservationHandler: RequestHandler<
  ReservationParamsInput
> = async (req, res) => {
  const userId = Number(res.locals.user.id);
  const reservationId = Number(req.params.reservationId);

  const reservation = await getReservationDetails(reservationId);
  if (!reservation) {
    res.status(404).json({ message: 'Reservation not found' });
    return;
  }
  if (reservation.userId !== userId) {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  await cancelReservation(reservationId);
  res.json({ message: 'Reservation cancelled' });
};
