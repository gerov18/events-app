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
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllEventsHandler = async (_req: Request, res: Response) => {
  try {
    const events = await getAllEvents();
    res.json(events);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const getEventByIdHandler = async (
  req: Request<EventParamsInput>,
  res: Response
) => {
  try {
    const { id } = req.params;
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
  const loggedUser = res.locals.user;
  if (!loggedUser) {
    res.status(401).json({ message: "You're not logged in" });
    return;
  }

  try {
    const { title, description, date, location, capacity, price, categoryId } =
      req.body;

    const event = await createEvent({
      title,
      description,
      date,
      location,
      capacity,
      createdBy: loggedUser.id,
      price,
      categoryId,
    });

    res.status(201).json(event);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

export const updateEventHandler = async (
  req: Request<UpdateEventInput['params'], {}, UpdateEventInput['body']>,
  res: Response
) => {
  const loggedUser = res.locals.user;
  if (!loggedUser) {
    res.status(401).json({ message: "You're not logged in" });
    return;
  }

  try {
    const { id } = req.params;
    const { title, description, date, location, capacity, price, categoryId } =
      req.body;
    const event = await getEventById(parseInt(id));
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.createdBy !== loggedUser.id && loggedUser.role !== 'ADMIN') {
      res
        .status(403)
        .json({ message: "Forbidden: you can't access this page" });
      return;
    }

    const updatedEvent = await updateEvent(parseInt(id), {
      title,
      description,
      date,
      location,
      capacity,
      price,
      categoryId,
    });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

export const deleteEventHandler = async (
  req: Request<EventParamsInput>,
  res: Response
) => {
  const loggedUser = res.locals.user;
  if (!loggedUser) {
    res.status(401).json({ message: "You're not logged in" });
    return;
  }

  try {
    const { id } = req.params;
    const event = await getEventById(parseInt(id));
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.createdBy !== loggedUser.id) {
      res.status(403).json({ message: 'Forbidden: not your event' });
      return;
    }

    await deleteEvent(parseInt(id));
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};

export const uploadEventImageHandler = async (req: Request, res: Response) => {
  const eventId = Number(req.params.id);
  const files = req.files as Express.Multer.File | undefined;

  if (!files || !Array.isArray(req.files)) {
    res.status(400).json({ message: 'No image' });
    return;
  }

  const creates = (req.files as Express.Multer.File[]).map(f =>
    prisma.image.create({ data: { url: (f as any).path, eventId } })
  );
  const images = await Promise.all(creates);
  res.status(201).json(images);
};

export const getEventImagesHandler = async (req: Request, res: Response) => {
  const eventId = Number(req.params.id);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    res.status(404).json({ message: 'Event not found' });
    return;
  }

  const images = await prisma.image.findMany({
    where: { eventId },
    orderBy: { createdAt: 'asc' },
  });

  res.json(images);
};
