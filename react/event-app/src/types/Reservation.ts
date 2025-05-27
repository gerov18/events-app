import { User } from './User';
import { Event } from './Event';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Ticket {
  id: number;
  reservationId: number;
  qrCode: string | null;
  status: ReservationStatus;
}

export interface Reservation {
  id: number;
  userId: number;
  eventId: number;
  createdAt: string;
  status: ReservationStatus;
  totalPrice: number;
  user: User;
  event: Event;
  tickets: Ticket[];
}
export interface CreateReservationInput {
  userId: number;
  eventId: number;
}
