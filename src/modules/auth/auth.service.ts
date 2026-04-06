import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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
    throw new Error("User with this email already exists");
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

export const authServices = {
  createUser,
  loginUser,
};