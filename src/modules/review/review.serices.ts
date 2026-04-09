import status from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/AppError";
import { BookingStatus } from "../../generated/prisma/enums";

export interface CreateReviewInput {
  roomId: string;
  rating: number | string;
  comment?: string;
}

const createReview = async (payload: CreateReviewInput, userId: string) => {
  const { roomId, rating, comment } = payload;

  const ratingNum = Number(rating);

  // Validate rating
 if (ratingNum < 1 || ratingNum > 5) {
  throw new AppError(status.BAD_REQUEST, "Rating must be between 1 and 5");
}
  
  // Check if room exists
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new AppError(status.NOT_FOUND, "Room not found");
  }

  // Check if user has a checked-out booking for this room
  const booking = await prisma.booking.findFirst({
    where: {
      userId,
      roomId,
      bookingStatus: BookingStatus.CHECKED_OUT,
    },
  });

  if (!booking) {
    throw new AppError(status.FORBIDDEN, "You can only review rooms you've checked out from");
  }

  // Check if user already reviewed this room
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      roomId,
    },
  });

  if (existingReview) {
    throw new AppError(status.CONFLICT, "You have already reviewed this room");
  }

  const review = await prisma.review.create({
    data: {
      userId,
      roomId,
      rating: ratingNum,
      comment,
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
          title: true,
        },
      },
    },
  });

  return review;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
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
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const getReviewsByRoom = async (roomId: string) => {
  const reviews = await prisma.review.findMany({
    where: { roomId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const getReviewsByUser = async (userId: string) => {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      room: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const deleteReview = async (reviewId: string, userId: string) => {
  // Check if review exists and belongs to user
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      userId,
    },
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found or you don't have permission to delete it");
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return { message: "Review deleted successfully" };
};

export const reviewServices = {
  createReview,
  getAllReviews,
  getReviewsByRoom,
  getReviewsByUser,
  deleteReview,
};