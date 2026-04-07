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
  images: z.string().min(1, { message: "Images are required" }),
  floor: z.number().int().min(0).optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
