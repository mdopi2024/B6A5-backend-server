import { Request, Response } from "express";

import catchAsync from "../../utils/shared/catchAsync";
import sendResponse from "../../utils/shared/sendResponse";
import status from "http-status";
import { bookingService, CreateBookingInput } from "./booking.services";

const createBookingController = catchAsync(async (req: Request, res: Response) => {
  const payload: CreateBookingInput = req.body;
  const userId = req?.user?.id; // Assuming checkAuth sets req.user

  const data = await bookingService.createBooking(payload, userId as string);
  sendResponse(res, status.CREATED, "Booking created successfully", data);
});

const getAllBookingsController = catchAsync(async (req: Request, res: Response) => {
  const data = await bookingService.getAllBookings();
  sendResponse(res, status.OK, "All bookings retrieved successfully", data);
});

export const bookingController = {
  createBookingController,
  getAllBookingsController,
};
