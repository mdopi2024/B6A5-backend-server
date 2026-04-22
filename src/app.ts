import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/index";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import { paymentController } from "./modules/payment/payment.controller";

dotenv.config();

export const app: Application = express();

const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
    : [process.env.URL || "http://localhost:3000"];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS policy: Origin not allowed"));
        }
    },
    credentials: true,
};

// ✅ STEP 1: Webhook route সবার আগে — কোনো parser এর আগে
app.post(
    '/webhook',
    express.raw({ type: "application/json" }),
    paymentController.handleStripeWebhooEvent
);

// ✅ STEP 2: তারপর বাকি সব middleware
app.use(cors(corsOptions));
app.options("/{*path}", cors(corsOptions));
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