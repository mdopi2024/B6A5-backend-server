/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/shared/catchAsync";
import { envVar } from "../../config/env";
import status from "http-status";
import { stripe } from "../../config/stripe";
import sendResponse from "../../utils/shared/sendResponse";
import { paymentServices } from "./payment.services";

const handleStripeWebhooEvent = catchAsync(async (req: Request, res: Response) => {
    const singnature = req.headers['stripe-signature'] as string;
    const secrate = envVar.STRIPE_WEBHOOK_SECRET

    if (!singnature || !secrate) {
        console.error('Missing webhook secrate or singnature');
        return res.status(status.BAD_REQUEST).json({ message: "Missing webhook secrate or singnature" })
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, singnature, secrate)
    } catch (error: any) {
        console.error('proccessing stripe error', error)
        return res.status(status.BAD_REQUEST).json({ message: "proccessing stripe error" })
    }

    try {
        const result = await paymentServices.handleStripeWebhookEvent(event);

        sendResponse(res,status.OK, "Stripe webhook event processed successfully", result
        )

    } catch (error: any) {
        console.log("prisma error is occured")
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "Error handling Stripe webhook event",
            error: error
        })
    }
});


// const handleStripeWebhooEvent = catchAsync(async (req: Request, res: Response) => {
//     console.log("🔔 Step 1: Webhook hit হয়েছে");
//     console.log("Body is Buffer?", Buffer.isBuffer(req.body));
//     console.log("Signature header:", req.headers['stripe-signature'] ? "✅ আছে" : "❌ নেই");

//     const singnature = req.headers['stripe-signature'] as string;
//     const secrate = envVar.STRIPE_WEBHOOK_SECRET;

//     console.log("🔔 Step 2: Webhook secret:", secrate ? "✅ আছে" : "❌ নেই");

//     if (!singnature || !secrate) {
//         console.error('❌ Missing webhook secret or signature');
//         return res.status(status.BAD_REQUEST).json({ message: "Missing webhook secret or signature" })
//     }

//     let event;
//     try {
//         event = stripe.webhooks.constructEvent(req.body, singnature, secrate)
//         console.log("✅ Step 3: Event construct সফল, type:", event.type);
//     } catch (error: any) {
//         console.error('❌ Step 3 FAILED: constructEvent error:', error.message)
//         return res.status(status.BAD_REQUEST).json({ message: error.message })
//     }

//     try {
//         const result = await paymentServices.handleStripeWebhookEvent(event);
//         console.log("✅ Step 4: Service সফল");
//         return res.status(status.OK).json({ success: true, result });
//     } catch (error: any) {
//         console.error('❌ Step 4 FAILED:', error.message);
//         return res.status(status.BAD_REQUEST).json({ success: false, message: error.message })
//     }
// });
export const paymentController = {
handleStripeWebhooEvent
}