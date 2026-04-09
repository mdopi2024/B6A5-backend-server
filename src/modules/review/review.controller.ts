import { Request, Response } from "express";
import { reviewServices, CreateReviewInput } from "./review.serices";
import catchAsync from "../../utils/shared/catchAsync";
import sendResponse from "../../utils/shared/sendResponse";
import status from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const payload: CreateReviewInput = req.body;
  const userId = req.user!.id;
  const data = await reviewServices.createReview(payload, userId);
  sendResponse(res, status.CREATED, "Review created successfully", data);
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const data = await reviewServices.getAllReviews();
  sendResponse(res, status.OK, "Reviews retrieved successfully", data);
});

const getReviewsByRoom = catchAsync(async (req: Request, res: Response) => {
  const { roomId } = req.params;
  const data = await reviewServices.getReviewsByRoom(roomId as string);
  sendResponse(res, status.OK, "Reviews retrieved successfully", data);
});

const getReviewsByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const data = await reviewServices.getReviewsByUser(userId);
  sendResponse(res, status.OK, "Your reviews retrieved successfully", data);
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const data = await reviewServices.deleteReview(id as string, userId);
  sendResponse(res, status.OK, data.message, null);
});

export const reviewController = {
  createReview,
  getAllReviews,
  getReviewsByRoom,
  getReviewsByUser,
  deleteReview,
};