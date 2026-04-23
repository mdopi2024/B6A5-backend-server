import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/index";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { paymentController } from "./modules/payment/payment.controller";
import { envVar } from "./config/env";

dotenv.config();

export const app: Application = express();
// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  envVar.APP_URL || "http://localhost:3000",
  envVar.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values



// ✅ STEP 1: Webhook route সবার আগে — কোনো parser এর আগে
app.post(
    '/webhook',
    express.raw({ type: "application/json" }),
    paymentController.handleStripeWebhooEvent
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);




app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ STEP 3: Auth ও বাকি routes
app.use("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1", router);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Express!');
});

app.use(globalErrorHandler);
app.use(notFound);