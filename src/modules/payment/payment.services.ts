/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe"
import { prisma } from "../../lib/prisma"
import { PaymentStatus } from "../../generated/prisma/enums"



const handleStripeWebhookEvent = async (event: Stripe.Event) => {

    const isExistPayment = await prisma.payment.findFirst({
        where: {
            stripeEventId: event.id
        }
    })

    if (isExistPayment) {
        console.log(`event id ${event.id} is already processed`)
        return { message: `event id ${event.id} is already processed` }
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const bookingId = session.metadata?.bookingId;
            const paymentId = session.metadata?.paymentId

            if (!bookingId || !paymentId) {
                console.log("Missing appointmentId or paymentId in session metadata")
                return { message: "Missing appointmentId or paymentId in session metadata" }
            }

            const booking = await prisma.booking.findFirst({
                where: {
                    id: bookingId
                }
            })

            if (!booking) {
                console.error(`Appointment with id ${bookingId} not found`);
                return { message: `Appointment with id ${bookingId} not found` }
            }

            await prisma.$transaction(async (tx) => {
                await tx.booking.update({
                    where: {
                        id: bookingId
                    },
                    data: {
                        paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID
                    }
                });

                await tx.payment.update({
                    where: {
                        id: paymentId
                    },
                    data: {
                        stripeEventId: event.id,
                        status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                        paymentGatewayData: session as any
                    }
                })
            })

            console.log(`Processed checkout.session.completed for booking ${booking} and payment ${paymentId}`);
            break

        }
        case "checkout.session.expired": {
            const session = event.data.object;
            console.log(`Checkout session ${session.id} expired. Marking associated payment as failed.`);
            break
        }
        case "payment_intent.payment_failed": {
            const session = event.data.object;
            console.log(`payment ${session.id} failed. Marking associated payment as failed.`);
            break
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

 return {message : `Webhook Event ${event.id} processed successfully`}
}
export const paymentServices ={
    handleStripeWebhookEvent
}