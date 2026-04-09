import { Router } from "express";
import { reviewController } from "./review.controller";
import validateRequest from "../../middleware/zodValidate";
import { createReviewValidationSchema } from "./review.validator";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// POST /review/create - Create a review (authenticated users)
router.post("/create", checkAuth(Role.ADMIN,Role.GUEST,Role.MANAGER), validateRequest(createReviewValidationSchema), reviewController.createReview);

// GET /review/all - Get all reviews (admin only)
router.get("/all", checkAuth(Role.ADMIN), reviewController.getAllReviews);

// GET /review/room/:roomId - Get reviews for a room (public)
router.get("/room/:roomId", reviewController.getReviewsByRoom);

// GET /review/my-reviews - Get user's own reviews (authenticated)
router.get("/my-reviews", checkAuth(), reviewController.getReviewsByUser);

// DELETE /review/:id - Delete a review (owner only)
router.delete("/:id", checkAuth(), reviewController.deleteReview);

export const reviewRouter = router;