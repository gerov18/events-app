import { Reservation } from './Reservation';

export interface Event {
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
}

export interface CreateEventInput {
  id: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  createdBy: number;
  price: number;
}
