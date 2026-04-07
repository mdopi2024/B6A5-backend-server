import { Request, Response } from "express";
import catchAsync from "../../utils/shared/catchAsync";
import sendResponse from "../../utils/shared/sendResponse";
import status from "http-status";
import {  roomServices } from "./room.services";
import { CreateRoomInput } from "./room.validator";

const createRoom = catchAsync(async (req: Request, res: Response) => {
  const payload: CreateRoomInput = req.body;
  const data = await roomServices.createRoom(payload);
  sendResponse(res, status.CREATED, "Room created successfully", data);
});

// const getAllRooms = catchAsync(async (req: Request, res: Response) => {
//   const data = await roomServices.getAllRooms();
//   sendResponse(res, status.OK, "Rooms retrieved successfully", data);
// });

// const getRoomById = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const data = await roomServices.getRoomById(id as string);
//   sendResponse(res, status.OK, "Room retrieved successfully", data);
// });

// const deleteRoom = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const data = await roomServices.deleteRoom(id as string);
//   sendResponse(res, status.OK, "Room deleted successfully", data);
// });

export const roomController = {
  createRoom,
//   getAllRooms,
//   getRoomById,
//   deleteRoom,
};
