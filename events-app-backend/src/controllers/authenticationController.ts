import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authenticationService';

export const register = async (req: Request, res: Response) => {
  const { username, firstName, lastName, email, password, role } = req.body;
  try {
    const token = await registerUser(
      email,
      password,
      username,
      firstName,
      lastName,
      role
    );
    res.status(200).send({ token });
  } catch (error: any) {
    res
      .status(400)
      .send({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const token = await loginUser(email, password);
    res.status(200).send({ token });
  } catch (error: any) {
    res.status(401).send({ message: 'Login failed', error: error.message });
  }
};
