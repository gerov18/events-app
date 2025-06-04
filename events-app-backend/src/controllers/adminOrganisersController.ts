import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  OrganiserParamsInput,
  UpdateOrganiserInput,
} from '../schemas/organiserSchema';

const prisma = new PrismaClient();

export const getAllOrganisersAdmin = async (_req: Request, res: Response) => {
  try {
    const organisers = await prisma.organiser.findMany();
    res.status(200).json(organisers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrganiserByIdAdmin = async (
  req: Request<OrganiserParamsInput>,
  res: Response
) => {
  const { id } = req.params;
  try {
    const organiser = await prisma.organiser.findUnique({
      where: { id: Number(id) },
    });
    if (!organiser) {
      res.status(404).json({ message: 'Organiser not found' });
      return;
    }
    res.status(200).json(organiser);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOrganiserAdmin = async (
  req: Request<OrganiserParamsInput, {}, UpdateOrganiserInput>,
  res: Response
) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated = await prisma.organiser.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        email: data.email,
        description: data.description ?? null,
        phone: data.phone ?? null,
        website: data.website ?? null,
      },
    });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOrganiserAdmin = async (
  req: Request<OrganiserParamsInput>,
  res: Response
) => {
  const { id } = req.params;
  try {
    await prisma.organiser.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
