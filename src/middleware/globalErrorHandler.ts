/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "./AppError";

import status from "http-status";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

    if(process.env.NODE_ENV === "development" ){
        console.log(err)
    }


  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = err.message || "Internal Server Error";
  let errorSources: { path: string; message: string }[] = [];
  let stack: string | undefined;

  // ── 1. Zod ───────────────────────────────────────────────────────
  if (err instanceof ZodError) {
    statusCode = status.UNPROCESSABLE_ENTITY;
    message = "Validation failed";
    errorSources = err.issues.map((issue) => ({
      path: issue.path.join("=>"),
      message: issue.message,
    }));
    stack = err.stack;
  }

  // ── 2. Prisma Known Error ────────────────────────────────────────
  else if (err instanceof PrismaClientKnownRequestError) {
    stack = err.stack;

    if (err.code === "P2002") {
      statusCode = status.CONFLICT;
      message = "Duplicate entry found";
      errorSources = [{
        path: (err.meta?.target as string[])?.join(", ") || "",
        message: `${(err.meta?.target as string[])?.join(", ")} already exists`,
      }];
    }

    else if (err.code === "P2025") {
      statusCode = status.NOT_FOUND;
      message = "Record not found";
      errorSources = [{
        path: "",
        message: (err.meta?.cause as string) || "Requested record does not exist",
      }];
    }

    else if (err.code === "P2003") {
      statusCode = status.BAD_REQUEST;
      message = "Invalid reference";
      errorSources = [{
        path: (err.meta?.field_name as string) || "",
        message: "Related record does not exist",
      }];
    }

    else {
      statusCode = status.BAD_REQUEST;
      message = "Database error occurred";
      errorSources = [{ path: "", message: err.message }];
    }
  }

  // ── 3. Prisma Validation Error ───────────────────────────────────
  else if (err instanceof PrismaClientValidationError) {
    statusCode = status.BAD_REQUEST;
    message = "Prisma validation error";
    errorSources = [{ path: "", message: err.message }];
    stack = err.stack;
  }

  // ── 4. AppError ──────────────────────────────────────────────────
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  }

  // ── 5. Generic Error ─────────────────────────────────────────────
  else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    error: process.env.NODE_ENV === "development" ? err : undefined,
    stack: process.env.NODE_ENV === "development" ? stack : undefined,
  });
};