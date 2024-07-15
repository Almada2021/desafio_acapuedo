import { User } from "@prisma/client";
import prisma from "../../infrastructure/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  async createUser(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '24h' });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '24h' });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    };
  }

  async createAdmin(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined");
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, isAdmin: true }, process.env.SECRET_KEY, { expiresIn: '24h' });

    return {
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        isAdmin: true,
      },
      token,
    };
  }

  async loginAdmin(email: string, password: string) {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    if (!process.env.SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined");
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, isAdmin: true }, process.env.SECRET_KEY, { expiresIn: '24h' });

    return {
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        isAdmin: true,
      },
      token,
    };
  }
  async getUserById(id: string | number) : Promise<User | null> {
    if(typeof id == 'number') {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      return user;
    }else {
      let uid = parseInt(id);
      const user = await prisma.user.findUnique({
        where: {  id: uid},
      });
      return user;
    }
  }
}