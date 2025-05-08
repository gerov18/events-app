import { Request, Response } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../services/eventsService';
import {
  CreateEventInput,
  EventParamsInput,
  UpdateEventInput,
} from '../schemas/eventSchema';

export const getAllEventsHandler = async (req: Request, res: Response) => {
  try {
    const events = await getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const getEventByIdHandler = async (
  req: Request<EventParamsInput>,
  res: Response
) => {
  const { id } = req.params;
  try {
    const event = await getEventById(parseInt(id));
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
};

export const createEventHandler = async (
  req: Request<{}, {}, CreateEventInput>,
  res: Response
) => {
  const { title, description, date, location, capacity, createdBy, price } =
    req.body;

  const loggedUser = res.locals.user;
  try {
    const event = await createEvent({
      title,
      description,
      date,
      location,
      capacity,
      createdBy,
      price,
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
    }
    if (!loggedUser) {
      res.status(404).json({ message: "You're not logged in" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

export const updateEventHandler = async (
  req: Request<UpdateEventInput['params'], {}, UpdateEventInput['body']>,
  res: Response
) => {
  const { id } = req.params;
  const { title, description, date, location, capacity, createdBy, price } =
    req.body;

  const loggedUser = res.locals.user;
  try {
    const event = await getEventById(parseInt(id));
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    const updatedEvent = await updateEvent(parseInt(id), {
      title,
      description,
      date,
      location,
      capacity,
      createdBy,
      price,
    });

    if (!loggedUser) {
      res.status(404).json({ message: "You're not logged in" });
    }
    if (
      updatedEvent?.createdBy !== null &&
      event?.createdBy !== res.locals.user
    ) {
      res
        .status(403)
        .json({ message: "Forbidden: you can't access this page" });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

export const deleteEventHandler = async (
  req: Request<EventParamsInput>,
  res: Response
) => {
  const { id } = req.params;
  const loggedUser = res.locals.user;
  try {
    const event = await getEventById(parseInt(id));
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
    }
    if (!loggedUser) {
      res.status(404).json({ message: "You're not logged in" });
    }
    if (event?.createdBy !== null && event?.createdBy !== res.locals.user) {
      res
        .status(403)
        .json({ message: "Forbidden: you can't access this page" });
    }
    await deleteEvent(parseInt(id));
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};
