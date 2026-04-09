import { Request, Response } from "express";
import { authServices, CreateUserInput, LoginUserInput } from "./auth.service";
import catchAsync from "../../utils/shared/catchAsync";
import sendResponse from "../../utils/shared/sendResponse";
import status from "http-status";


const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload: CreateUserInput = req.body;
  const data = await authServices.createUser(payload);
  sendResponse(res, status.OK, "User registered successfully", data);
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload: LoginUserInput = req.body;
  const data = await authServices.loginUser(payload);
  sendResponse(res, status.OK, "User logged in successfully", data);
});

const getAllUsersController = catchAsync(async (req: Request, res: Response) => {
  const data = await authServices.getAllUsers();
  sendResponse(res, status.OK, "Users retrieved successfully", data);
});

const deleteUserController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await authServices.deleteUser(id as string);
  const message = data.isDeleted ? "User deleted successfully" : "User restored successfully";
  sendResponse(res, status.OK, message, data);
});

export const authController = {
  registerUser,
  loginUser,
  getAllUsersController,
  deleteUserController,
}