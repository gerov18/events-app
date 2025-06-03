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
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getAllEventsHandler = async (req: Request, res: Response) => {
  try {
    const { keyword, city, categoryId, dateFrom, dateTo, limit } = req.query;

    const whereClause: Prisma.EventWhereInput = {};

    if (keyword && typeof keyword === 'string' && keyword.trim() !== '') {
      const q = keyword.trim();
      whereClause.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (city && typeof city === 'string' && city.trim() !== '') {
      const rawCity = city.trim().split(',')[0];
      whereClause.location = {
        contains: rawCity,
        mode: 'insensitive',
      };
    }

    if (categoryId && !Array.isArray(categoryId)) {
      const catNum = Number(categoryId);
      if (!Number.isNaN(catNum)) {
        whereClause.categoryId = catNum;
      }
    }

    if (dateFrom && typeof dateFrom === 'string') {
      const fromDate = new Date(dateFrom);
      if (!isNaN(fromDate.getTime())) {
        whereClause.date = {
          ...((whereClause.date as Prisma.DateTimeFilter) || {}),
          gte: fromDate,
        };
      }
    }

    if (dateTo && typeof dateTo === 'string') {
      const toDate = new Date(dateTo);
      if (!isNaN(toDate.getTime())) {
        whereClause.date = {
          ...((whereClause.date as Prisma.DateTimeFilter) || {}),
          lte: toDate,
        };
      }
    }

    let take: number | undefined;
    if (limit && !Array.isArray(limit)) {
      const lim = Number(limit);
      if (!Number.isNaN(lim) && lim > 0) {
        take = lim;
      }
    }

    const events = await getAllEvents(whereClause, take);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const getEventByIdHandler = async (
  req: Request<EventParamsInput>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const event = await getEventById(parseInt(id, 10));
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
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
    console.error('Error creating event:', error);
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
    const event = await getEventById(parseInt(id, 10));
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

    const updatedEvent = await updateEvent(parseInt(id, 10), {
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
    console.error('Error updating event:', error);
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
    const event = await getEventById(parseInt(id, 10));
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.createdBy !== loggedUser.id) {
      res.status(403).json({ message: 'Forbidden: not your event' });
      return;
    }

    await deleteEvent(parseInt(id, 10));
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event', error });
  }
};

export const uploadEventImageHandler = async (req: Request, res: Response) => {
  const eventId = Number(req.params.id);
  const files = req.files as Express.Multer.File[] | undefined;

  if (!files || !Array.isArray(req.files)) {
    res.status(400).json({ message: 'No image' });
    return;
  }

  const creates = (files as Express.Multer.File[]).map(f =>
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
