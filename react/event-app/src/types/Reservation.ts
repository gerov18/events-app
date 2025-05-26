import { User } from './User';
import { Event } from './event';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Reservation {
  id: number;
  userId: number;
  eventId: number;
  createdAt: Date;
  user: User;
  event: Event;
  status: ReservationStatus;
}

export interface CreateReservationInput {
  userId: number;
  eventId: number;
}
