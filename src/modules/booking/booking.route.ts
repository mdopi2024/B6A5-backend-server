import { Router } from "express";
import { bookingController } from "./booking.controller";
import validateRequest from "../../middleware/zodValidate";
import { createBookingValidationSchema } from "./booking.validator";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// POST /booking - Create a new booking
router.post(
  "/room",
  checkAuth(Role.GUEST, Role.ADMIN, Role.ADMIN), // Assuming guests can book, admins too
  validateRequest(createBookingValidationSchema),
  bookingController.createBookingController
);

export const bookingRouter = router;
