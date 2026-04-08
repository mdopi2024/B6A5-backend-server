import status from "http-status";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";
import { Decimal } from "@prisma/client/runtime/client";

export interface CreateBookingInput {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  specialRequest?: string;
}

 const createBooking = async (payload: CreateBookingInput, userId: string) => {
  const { roomId, checkInDate, checkOutDate, specialRequest } = payload;

  // Parse dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  // ✅ Fix 1: Time বাদ দিয়ে শুধু date compare
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  checkIn.setHours(0, 0, 0, 0);
  checkOut.setHours(0, 0, 0, 0);

  if (checkIn < today || checkOut < today) {
    throw new AppError(status.BAD_REQUEST, "Booking dates cannot be in the past");
  }

  // ✅ Fix 2: checkIn আর checkOut same বা উল্টো হলে error
  if (checkIn >= checkOut) {
    throw new AppError(status.BAD_REQUEST, "Check-out date must be after check-in date");
  }

  // Check if room exists and is available
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new AppError(status.NOT_FOUND, "Room not found");
  }

  if (room.status !== "AVAILABLE") {
    throw new AppError(status.BAD_REQUEST, "Room is not available for booking");
  }

  // Check for conflicting bookings
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      roomId,
      OR: [
        {
          AND: [
            { checkInDate: { lte: checkIn } },
            { checkOutDate: { gt: checkIn } },
          ],
        },
        {
          AND: [
            { checkInDate: { lt: checkOut } },
            { checkOutDate: { gte: checkOut } },
          ],
        },
        {
          AND: [
            { checkInDate: { gte: checkIn } },
            { checkOutDate: { lte: checkOut } },
          ],
        },
      ],
      bookingStatus: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
  });

  if (conflictingBooking) {
    throw new AppError(status.CONFLICT, "Room is already booked for the selected dates");
  }

  // Calculate total nights and price
  const totalNights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );

  // ✅ Fix 3: Decimal multiplication
  const totalPrice = new Decimal(room.pricePerNight).mul(totalNights);

  // Create the booking
  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalNights,
      totalPrice,
      specialRequest
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          title: true,
          pricePerNight: true,
        },
      },
    },
  });

  return booking;
};

 const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          title: true,
          pricePerNight: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

export const getBookingById = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          title: true,
          pricePerNight: true,
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  return booking;
};

export const getBookingsByUserIdAndEmail = async (userId: string, userEmail: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      userId,
      user: {
        email: userEmail,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      room: {
        select: {
          id: true,
          roomNumber: true,
          title: true,
          pricePerNight: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

export const bookingService = {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByUserIdAndEmail,
};