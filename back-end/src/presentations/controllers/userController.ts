import { Request, Response } from 'express';
import { UserService } from "../../domains/services/userServices";
import { User } from '@prisma/client';

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await userService.createUser(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userService.loginUser(email, password);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in user' });
  }
};
export const createAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const admin = await userService.createAdmin(name, email, password);
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Error creating admin' });
  }
};
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const admin = await userService.loginAdmin(email, password);
    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error logging in admin' });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user: User | null = await userService.getUserById(id);
    if (user) {
      res.status(200).json({ name: user.name, email: user.email });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
}