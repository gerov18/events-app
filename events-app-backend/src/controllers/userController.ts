import { Request, Response } from 'express';
import {
  createNewUser,
  deleteUserWithCredentials,
  getUserById,
  updateUserData,
} from '../services/userService';
import { CreateUserInput } from '../models/User';
import { UpdateUserInput } from '../schemas/authenticationSchema';

export const loadUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await getUserById(id);
    res.json(result);
  } catch (error) {
    res.status(404).send({ message: 'Could not find this user' });
  }
};

// export const editUser = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { username, firstName, lastName, email, password, role } = req.body;
//   try {
//     const result = await updateUserData(id, res.locals.user, {
//       username,
//       firstName,
//       lastName,
//       email,
//       password,
//       role,
//     });

//     if (!result) {
//       res.status(404).json({ message: 'User not found' });
//     }

//     if (result === 'forbidden') {
//       res.status(403).json({ message: "Forbidden: you can't edit this user" });
//     }

//     if (result === 'not logged') {
//       res.status(403).json({ message: "You're not logged in" });
//     }

//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating user', error });
//   }
// };

export const deleteUserWithCredentialsHandler = async (
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
    await deleteUserWithCredentials(userId, email, password);
    res.clearCookie('token');
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
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

export const updateUserHandler = async (
  req: Request<{}, {}, UpdateUserInput>,
  res: Response
) => {
  const userId = res.locals.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const data = req.body;
  try {
    const updatedUser = await updateUserData(userId, userId, data);
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updatedUser);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
