import { Request, Response } from 'express';
import { getUserById } from '../services/userService';
import { getOrganiserById } from '../services/organiserService';

export const meHandler = async (req: Request, res: Response) => {
  try {
    const { id, role } = res.locals.user;

    if (role === 'USER' || role === 'ADMIN' || role === 'ORGANISER') {
      const user = await getUserById(id);
      if (user) {
        res.status(200).json({ type: 'user', user });
        return;
      }
    }

    const organiser = await getOrganiserById(id);
    if (organiser) {
      res.status(200).json({ type: 'organiser', organiser });
      return;
    }

    res.status(404).json({ message: 'Profile not found' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
