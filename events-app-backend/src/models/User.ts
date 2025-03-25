export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  role: UserRole;
}
