import status from "http-status";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";
import { Role } from "../../generated/prisma/enums";

export interface CreateManagerInput {
  name: string;
  email: string;
  password: string;
}

export const createManager = async (payload: CreateManagerInput) => {
  const { name, email, password } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: Role.MANAGER,
    },
  });

  return data;
};




export const managerServices = {
  createManager,
};