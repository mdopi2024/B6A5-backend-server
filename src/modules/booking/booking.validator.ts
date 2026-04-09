import { z } from "zod";

export const createBookingValidationSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  checkInDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid check-in date format",
  }),
  checkOutDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid check-out date format",
  }),
  specialRequest: z.string().optional(),
}).refine((data) => {
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  return checkOut > checkIn;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"],
});

export const updateBookingValidationSchema = z.object({
  checkInDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid check-in date format",
  }).optional(),
  checkOutDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid check-out date format",
  }).optional(),
  specialRequest: z.string().optional(),
}).refine((data) => {
  if (data.checkInDate && data.checkOutDate) {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    return checkOut > checkIn;
  }
  return true;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"],
});

export const updateBookingStatusValidationSchema = z.object({
  bookingStatus: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "CHECKED_IN", "CHECKED_OUT"], {
    message: "Invalid booking status", // ✅ errorMap → message
  }),
});