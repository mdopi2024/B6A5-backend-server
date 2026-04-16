import { z } from "zod";

export const createRoomSchema = z.object({
  roomNumber: z.string().min(1, { message: "Room number is required" }),
  roomType: z.enum(["SINGLE", "DOUBLE", "DELUXE", "SUITE", "FAMILY"], {
    message: "Invalid room type",
  }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  pricePerNight: z.number().positive({ message: "Price per night must be positive" }),
  capacity: z.number().int().positive({ message: "Capacity must be a positive integer" }),
  bedType: z.enum(["SINGLE", "DOUBLE", "QUEEN", "KING"], {
    message: "Invalid bed type",
  }),
  images: z.string().optional(),
  floor: z.number().int().min(0).optional(),
});

// export const updateRoomSchema = z.object({
//   roomNumber: z.string().min(1, { message: "Room number is required" }).optional(),
//   roomType: z.enum(["SINGLE", "DOUBLE", "DELUXE", "SUITE", "FAMILY"], {
//     message: "Invalid room type",
//   }).optional(),
//   title: z.string().min(1, { message: "Title is required" }).optional(),
//   description: z.string().optional(),
//   pricePerNight: z.number().positive({ message: "Price per night must be positive" }).optional(),
//   capacity: z.number().int().positive({ message: "Capacity must be a positive integer" }).optional(),
//   bedType: z.enum(["SINGLE", "DOUBLE", "QUEEN", "KING"], {
//     message: "Invalid bed type",
//   }).optional(),
//   images: z.string().min(1, { message: "Images are required" }).optional(),
//   floor: z.number().int().min(0).optional(),
// });

export const updateRoomSchema = z.object({
  roomNumber: z.string().min(1, { message: "Room number is required" }).optional(),
  roomType: z.enum(["SINGLE", "DOUBLE", "DELUXE", "SUITE", "FAMILY"], {
    message: "Invalid room type",
  }).optional(),
  title: z.string().min(1, { message: "Title is required" }).optional(),
  description: z.string().optional(),
  pricePerNight: z.number().positive({ message: "Price per night must be positive" }).optional(),
  capacity: z.number().int().positive({ message: "Capacity must be a positive integer" }).optional(),
  bedType: z.enum(["SINGLE", "DOUBLE", "QUEEN", "KING"], {
    message: "Invalid bed type",
  }).optional(),
  images: z.string().min(1, { message: "Images are required" }).optional(),
  status: z.enum(["AVAILABLE", "BOOKED", "MAINTENANCE"], {
    message: "Invalid room status",
  }).optional(),
  floor: z.number().int().min(0).optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;


