import { Request, Response } from "express";
import { authServices, CreateUserInput, LoginUserInput } from "./auth.service";
import catchAsync from "../../utils/shared/catchAsync";


const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload: CreateUserInput = req.body;
  const data = await authServices.createUser(payload);
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: data
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload: LoginUserInput = req.body;
  const data = await authServices.loginUser(payload);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: data
  });
});

export const authController = {
  registerUser,
  loginUser
}