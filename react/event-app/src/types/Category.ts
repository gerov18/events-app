import { Event } from './event';

export type Category = {
  id: number;
  name: string;
  events: Event[];
};

export type CategoryInput = {
  id: number;
  name: string;
};
