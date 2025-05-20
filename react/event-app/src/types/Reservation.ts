import { User } from './User';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

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
