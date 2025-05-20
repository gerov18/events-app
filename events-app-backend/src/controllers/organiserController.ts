import { Request, Response } from 'express';
import {
  getAllOrganisers,
  getOrganiserById,
  updateOrganiser,
  deleteOrganiser,
  updateOrganiserData,
  registerOrganiser,
  loginOrganiser,
} from '../services/organiserService';
import { OrganiserParamsInput } from '../schemas/organiserSchema';

export const registerOrganiserHandler = async (req: Request, res: Response) => {
  try {
    const { organiser, token } = await registerOrganiser(req.body);
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ organiser });
    return;
  } catch (err: any) {
    res.status(400).json({ message: err.message });
    return;
  }
};

export const loginOrganiserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { organiser, token } = await loginOrganiser(email, password);
    res.cookie('token', token, { httpOnly: true });

    res.status(200).json({ token, organiser });
    return;
  } catch (err: any) {
    res.status(400).json({ message: err.message });
    return;
  }
};

export const logoutHandler = async (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
  return;
};

export const getAllOrganisersHandler = async (_req: Request, res: Response) => {
  try {
    const organisers = await getAllOrganisers();
    res.json(organisers);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organisers', error });
    return;
  }
};

export const getOrganiserByIdHandler = async (
  req: Request<OrganiserParamsInput>,
  res: Response
) => {
  try {
    const organiser = await getOrganiserById(parseInt(req.params.id));
    if (!organiser) {
      res.status(404).json({ message: 'Organiser not found' });
      return;
    }
    res.json(organiser);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organiser', error });
    return;
  }
};

export const updateOrganiserHandler = async (req: Request, res: Response) => {
  const organiserId = Number(req.params.id);
  const loggedInId = Number(res.locals.user?.id);

  try {
    const result = await updateOrganiserData(organiserId, loggedInId, req.body);

    if (result === 'not logged') {
      res.status(401).json({ message: 'You must be logged in' });
      return;
    }

    if (result === 'unauthorized') {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    if (!result) {
      res.status(404).json({ message: 'Organiser not found' });
      return;
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrganiserHandler = async (
  req: Request<OrganiserParamsInput>,
  res: Response
) => {
  try {
    await deleteOrganiser(parseInt(req.params.id));
    res.json({ message: 'Organiser deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting organiser', error });
  }
};
