import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z.string().email(),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});