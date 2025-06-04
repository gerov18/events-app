import { Request, Response } from 'express';

import {
  deleteEvent,
  getEventById,
  updateEvent,
} from '../services/eventsService';

export const getEventByIdForAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const eventId = Number(id);
    const event = await getEventById(eventId);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Failed to fetch event', error: err.message });
  }
};

export const updateEventByAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const eventId = Number(id);
    const updated = await updateEvent(eventId, updateData);
    if (!updated) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Failed to update event', error: err.message });
  }
};

export const deleteEventByAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const eventId = Number(id);
    const deleted = await deleteEvent(eventId);
    if (!deleted) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json({ message: 'Event successfully deleted' });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Failed to delete event', error: err.message });
  }
};
