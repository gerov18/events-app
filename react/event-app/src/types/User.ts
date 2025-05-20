import { Reservation } from './Reservation';

export type UserRole = 'ADMIN' | 'USER' | 'ORGANISER';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  reservations: Reservation[];
}

export interface CreateUserInput {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}
