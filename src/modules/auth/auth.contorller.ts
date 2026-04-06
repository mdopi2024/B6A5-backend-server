/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { authServices, CreateUserInput, LoginUserInput } from "./auth.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const payload: CreateUserInput = req.body;

    const data = await authServices.createUser(payload);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: data
    });
  } catch (error: any) {
    console.error("Create user error:", error);

    res.status(400).json({
      success: false,
      message: error.message || "Failed to create user",
      data: null
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const payload: LoginUserInput = req.body;

    const data = await authServices.loginUser(payload);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: data
    });
  } catch (error: any) {
    console.error("Login user error:", error);

    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
      data: null
    });
  }
};


export const authController={
    registerUser,
    loginUser
}