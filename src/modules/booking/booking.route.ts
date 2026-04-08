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
  checkAuth(Role.GUEST, Role.ADMIN, Role.MANAGER),
  validateRequest(createBookingValidationSchema),
  bookingController.createBookingController
);

// GET /booking - Get all bookings (accessible to all roles)
router.get(
  "/all",
  bookingController.getAllBookingsController
);

export const bookingRouter = router;
