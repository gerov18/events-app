import { Image } from './Image';
import { Reservation } from './Reservation';

export type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  createdAt: Date;
  createdBy: number;
  availableTickets: number;
  price: number;
  reservations: Reservation[];
  categoryId: number;
  images: Image[];
};

export type CreateEventInput = {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
  categoryId: number;
};
