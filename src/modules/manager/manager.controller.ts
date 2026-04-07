import { Request, Response } from "express";

import catchAsync from "../../utils/shared/catchAsync";
import sendResponse from "../../utils/shared/sendResponse";
import status from "http-status";
import { CreateManagerInput, managerServices } from "./manager.services";

const createManager= catchAsync(async (req: Request, res: Response) => {
  const payload: CreateManagerInput = req.body;
  const data = await managerServices.createManager(payload);
  sendResponse(res, status.CREATED, "Manager created successfully", data);
});

export const managerController = {
  createManager
};
