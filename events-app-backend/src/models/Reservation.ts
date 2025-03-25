export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  status: ReservationStatus;
  createdAt: string;
}
