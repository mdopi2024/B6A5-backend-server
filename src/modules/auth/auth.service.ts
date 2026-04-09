import status from "http-status";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

export const createUser = async (payload: CreateUserInput) => {
  const { name, email, password } = payload;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  return data;
};

export const loginUser = async (payload: LoginUserInput) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return data;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany();

  return users;
};

export const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  const isCurrentlyDeleted = user.isDeleted;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      isDeleted: !isCurrentlyDeleted,
      deletedAt: !isCurrentlyDeleted ? new Date() : null,
    },
  });

  return updatedUser;
};

export const authServices = {
  createUser,
  loginUser,
  getAllUsers,
  deleteUser,
};