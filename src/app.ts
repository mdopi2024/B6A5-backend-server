import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/index";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";

dotenv.config();

export const app: Application = express();
console.log(process.env.CLIENT_URL);
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
    : [process.env.URL || "http://localhost:3000" ];

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
// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.options("/{*path}", cors(corsOptions));
// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/auth/*splat", toNodeHandler(auth));
// API routes
app.use("/api/v1", router);

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Express!');
});

// global error handler
app.use(globalErrorHandler)
// 404 handler for unmatched routes
app.use(notFound);


