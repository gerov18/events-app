import { Reservation } from '@prisma/client';
import { Event } from './Event';

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  events: Event[];
  reservations: Reservation[];
}

export interface CreateUserInput {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
}
