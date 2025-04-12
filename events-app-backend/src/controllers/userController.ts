import { Request, Response } from 'express';
import {
  createNewUser,
  deleteUserById,
  getUserById,
  updateUserData,
} from '../services/userService';
import { CreateUserInput } from '../models/User';

export const loadUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await getUserById(id);
    res.json(result);
  } catch (error) {
    res.status(404).send({ message: 'Could not find this user' });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, firstName, lastName, email, password, role } = req.body;
  try {
    const result = await updateUserData(id, res.locals.user, {
      username,
      firstName,
      lastName,
      email,
      password,
      role,
    });

    if (!result) {
      res.status(404).json({ message: 'User not found' });
    }

    if (result === 'forbidden') {
      res.status(403).json({ message: "Forbidden: you can't edit this user" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await deleteUserById(id, res.locals.user);

    if (!result) {
      res.status(404).json({ message: 'User not found' });
    }

    if (result === 'forbidden') {
      res
        .status(403)
        .json({ message: "Forbidden: you can't delete this user" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

export const createUser = async (
  req: Request<CreateUserInput>,
  res: Response
) => {
  const { username, firstName, lastName, email, password, role } = req.body;
  try {
    const result = await createNewUser({
      username,
      firstName,
      lastName,
      email,
      password,
      role,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};
