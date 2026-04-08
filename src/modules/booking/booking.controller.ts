import { Request, Response } from "express";
import { createBooking, CreateBookingInput } from "./booking.services";
import catchAsync from "../../utils/shared/catchAsync";
import sendResponse from "../../utils/shared/sendResponse";
import status from "http-status";

const createBookingController = catchAsync(async (req: Request, res: Response) => {
  const payload: CreateBookingInput = req.body;
  const userId = req?.user?.id; // Assuming checkAuth sets req.user

  const data = await createBooking(payload, userId as string);
  sendResponse(res, status.CREATED, "Booking created successfully", data);
});

export const bookingController = {
  createBookingController,
};
