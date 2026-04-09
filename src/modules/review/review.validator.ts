import { z } from "zod";

export const createReviewValidationSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  rating: z.union([z.number(), z.string()]),
  comment: z.string().optional(),
});