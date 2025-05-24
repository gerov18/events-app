import { Request, Response } from 'express';
import {
  getAllOrganisers,
  getOrganiserById,
  updateOrganiser,
  updateOrganiserData,
  registerOrganiser,
  loginOrganiser,
  deleteOrganiserWithCredentials,
} from '../services/organiserService';
import {
  OrganiserParamsInput,
  UpdateOrganiserInput,
} from '../schemas/organiserSchema';

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

export const updateOrganiserHandler = async (
  req: Request<{}, {}, UpdateOrganiserInput>,
  res: Response
) => {
  const organiserId = res.locals.user?.id;
  if (!organiserId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const data = req.body;
  try {
    const updated = await updateOrganiserData(organiserId, organiserId, data);
    if (!updated) {
      res.status(404).json({ message: 'Organiser not found' });
      return;
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOrganiserWithCredentialsHandler = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;
  const userId = res.locals.user?.id;

  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    await deleteOrganiserWithCredentials(userId, email, password);
    res.clearCookie('token');
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
