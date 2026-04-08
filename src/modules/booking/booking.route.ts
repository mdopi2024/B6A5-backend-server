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

// GET /booking/all - Get all bookings (accessible to all roles)
router.get(
  "/all",
  checkAuth(Role.GUEST, Role.ADMIN, Role.MANAGER),
  bookingController.getAllBookingsController
);

// GET /booking/my - Get logged-in user's bookings by ID and email (no parameters needed)
router.get(
  "/my-bookings",
  checkAuth(Role.GUEST, Role.ADMIN, Role.MANAGER),
  bookingController.getMyBookings
);

// GET /booking/:id - Get booking by ID (protected, all roles can access)
router.get(
  "/:id",
  checkAuth(Role.GUEST, Role.ADMIN, Role.MANAGER),
  bookingController.getBookingById
);

export const bookingRouter = router;
