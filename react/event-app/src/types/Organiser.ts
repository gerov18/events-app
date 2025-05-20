import { Event } from './Event';

export type Organiser = {
  id: number;
  name: string;
  email: string;
  password?: string | null;
  createdAt: Date;
  description?: string | null;
  phone?: string | null;
  website?: string | null;
  events: Event[];
};

export type CreateOrganiserInput = {
  name: string;
  email: string;
  password: string;
  description?: string | null | undefined;
  phone?: string | null | undefined;
  website?: string | null | undefined;
};
