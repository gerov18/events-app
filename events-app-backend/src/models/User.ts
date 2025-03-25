export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  role: UserRole;
}
