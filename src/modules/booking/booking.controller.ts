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

const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await bookingService.getBookingById(id as string);
  sendResponse(res, status.OK, "Booking retrieved successfully", data);
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const userId = req?.user?.id;
  const userEmail = req?.user?.email;

  const data = await bookingService.getBookingsByUserIdAndEmail(userId as string, userEmail as string);
  sendResponse(res, status.OK, "User bookings retrieved successfully", data);
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const userId = req?.user?.id;

  const data = await bookingService.updateBooking(id as string, payload, userId as string);
  sendResponse(res, status.OK, "Booking updated successfully", data);
});

export const bookingController = {
  createBookingController,
  getAllBookingsController,
  getBookingById,
  getMyBookings,
  updateBooking,
};
