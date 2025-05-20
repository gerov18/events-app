import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  getUserByEmailOrUsername,
} from '../services/authenticationService';
import {
  LoginUserInput,
  RegisterUserInput,
} from '../schemas/authenticationSchema';

export const register = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response
) => {
  const { username, firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await getUserByEmailOrUsername(email, username);

    if (existingUser) {
      res
        .status(400)
        .json({ message: 'User with this email or username already exists' });
      return;
    }

    const { token, user } = await registerUser(
      email,
      password,
      username,
      firstName,
      lastName
    );

    res.status(200).send({ token, user });
    return;
  } catch (error: any) {
    res
      .status(400)
      .send({ message: 'Registration failed', error: error.message });
    return;
  }
};

export const login = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response
) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await loginUser(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).send({ token, user });
    return;
  } catch (error: any) {
    res.status(401).send({ message: 'Login failed', error: error.message });
    return;
  }
};

export const logoutHandler = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({ message: 'Logged out successfully' });
  return;
};
