import { Request, Response } from 'express';
import {
  createNewReservation,
  deleteReservation,
  editReservation,
  getReservationById,
} from '../services/reservationsService';

export const loadReservationHandler = async (req: Request, res: Response) => {
  const { reservationId } = req.params;
  const loggedUser = res.locals.user;
  try {
    const reservation = await getReservationById(reservationId);
    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
    }
    if (!loggedUser) {
      res.status(404).json({ message: "You're not logged in" });
    }
    if (
      reservation?.userId !== null &&
      reservation?.userId !== res.locals.user
    ) {
      res
        .status(403)
        .json({ message: "Forbidden: you can't access this page" });
    }
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reservation' });
  }
};

export const createReservationHandler = async (req: Request, res: Response) => {
  const loggedUser = res.locals.user;
  const { eventId, userId } = req.body;

  try {
    if (!loggedUser) {
      res.status(401).json({ message: "You're not logged in" });
    }

    if (!eventId) {
      res.status(404).json({ message: 'Event not found' });
    }
    const newReservation = await createNewReservation(eventId, userId);

    if (newReservation === 'no_tickets') {
      res.status(400).json({ message: 'No available tickets' });
    }
    res.status(201).json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating reservation' });
  }
};

export const editReservationHandler = async (req: Request, res: Response) => {
  const { reservationId } = req.params;
  const { status } = req.body;
  const loggedUser = res.locals.user;
  try {
    const reservation = await editReservation(reservationId, status);

    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }
    if (!loggedUser) {
      res.status(404).json({ message: "You're not logged in" });
      return;
    }
    if (reservation?.userId !== loggedUser) {
      res
        .status(403)
        .json({ message: "Forbidden: you can't access this page" });
      return;
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation', error });
  }
};

export const deleteReservationHandler = async (req: Request, res: Response) => {
  const { reservationId } = req.params;
  const loggedUser = res.locals.user;

  try {
    const reservation = await deleteReservation(reservationId);
    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }
    if (!loggedUser) {
      res.status(404).json({ message: "You're not logged in" });
      return;
    }
    if (reservation?.userId !== loggedUser) {
      res
        .status(403)
        .json({ message: "Forbidden: you can't access this page" });
      return;
    }

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reservation', error });
  }
};
