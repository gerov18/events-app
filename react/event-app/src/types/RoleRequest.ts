import { User } from './User';

export type RoleRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface RoleRequest {
  id: number;
  userId: number;
  role: 'USER' | 'ADMIN' | 'ORGANISER';
  status: RoleRequestStatus;
  user: User;
}
