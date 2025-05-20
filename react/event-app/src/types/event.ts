import { Reservation } from './Reservation';

export type Event = {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  createdAt: Date;
  createdBy: number;
  availableTickets: number;
  price: number;
  reservations: Reservation[];
};

export type CreateEventInput = {
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  price: number;
  category: number;
};
