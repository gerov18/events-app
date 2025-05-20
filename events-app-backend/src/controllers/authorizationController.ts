import { Request, Response } from 'express';
import {
  requestRoleChange,
  getRoleRequests,
  handleRoleRequest,
} from '../services/authorizationService';
import { UpdateRoleRequestInput } from '../schemas/authorizationSchema';

export async function requestAdminRole(req: Request, res: Response) {
  const userId = res.locals.user;
  try {
    await requestRoleChange(userId, 'ADMIN');
    res
      .status(200)
      .send({ message: 'Request to become a organiser submitted' });
    return;
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
}

export async function viewRoleRequests(req: Request, res: Response) {
  try {
    const requests = await getRoleRequests();
    res.send(requests);
    return;
  } catch (error: any) {
    res.status(400).send({ message: error.message });
    return;
  }
}

export async function updateRoleRequest(
  req: Request<
    UpdateRoleRequestInput['params'],
    {},
    UpdateRoleRequestInput['body']
  >,
  res: Response
) {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await handleRoleRequest(Number(id), status);
    res.status(200).send({ message: `Role request ${status}` });
    return;
  } catch (error: any) {
    res.status(400).send({ message: error.message });
    return;
  }
}
