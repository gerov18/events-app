import { Request, Response } from 'express';
import {
  createOrganiser,
  getAllOrganisers,
  getOrganiserById,
  updateOrganiser,
  deleteOrganiser,
} from '../services/organiserService';
import {
  CreateOrganiserInput,
  OrganiserParamsInput,
  UpdateOrganiserInput,
} from '../schemas/organiserSchema';

export const createOrganiserHandler = async (
  req: Request<{}, {}, CreateOrganiserInput>,
  res: Response
) => {
  try {
    const newOrganiser = await createOrganiser(req.body);
    res.status(201).json(newOrganiser);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error creating organiser', error });
  }
};

export const getAllOrganisersHandler = async (_req: Request, res: Response) => {
  try {
    const organisers = await getAllOrganisers();
    res.json(organisers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organisers', error });
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organiser', error });
  }
};

export const updateOrganiserHandler = async (
  req: Request<
    UpdateOrganiserInput['params'],
    {},
    UpdateOrganiserInput['body']
  >,
  res: Response
) => {
  try {
    const updated = await updateOrganiser(parseInt(req.params.id), req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating organiser', error });
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
