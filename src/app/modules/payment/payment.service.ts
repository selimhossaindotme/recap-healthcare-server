import Stripe from "stripe";
import stripe from "../../helper/stripe";
import { prisma } from "../../shared/prisma";
import { paymentStatus } from "../../../generated/client/enums";
import { envVars } from "../../config";

const handleStripeWebhook = async (
    body: Buffer,
    signature: string
) => {

    let event: Stripe.Event;
    // 1. Verify Stripe Webhook
    try {

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            envVars.stripe.webhook_secret as string
        );

    } catch (error: any) {

        console.error(
            "❌ Webhook verification failed:",
            error.message
        );

        throw new Error(
            `Webhook verification failed: ${error.message}`
        );
    }
    // 2. Handle Stripe Events
    switch (event.type) {
        // CHECKOUT SESSION COMPLETED
        case "checkout.session.completed": {

            const session = event.data.object as Stripe.Checkout.Session;
            // Get Metadata
            const appointmentId = session.metadata?.appointmentId;
            const paymentId = session.metadata?.paymentId;
            // ==========================================
            // Validate Appointment ID
            // ==========================================
            if (!appointmentId) {

                throw new Error(
                    "Appointment ID not found in Stripe metadata"
                );
            }
            // ==========================================
            // Validate Payment ID
            // ==========================================
            if (!paymentId) {

                throw new Error(
                    "Payment ID not found in Stripe metadata"
                );
            }
            // ==========================================
            // Check Stripe Payment Status
            // ==========================================
            if (session.payment_status !== "paid") {
                return {
                    message: "Payment is not completed",
                };
            }
            // ==========================================
            // Payment Intent ID
            // ==========================================
            const paymentIntentId =
                typeof session.payment_intent === "string"
                    ? session.payment_intent
                    : null;

            // ==========================================
            // 3. Database Transaction
            // ==========================================

            try {

           await prisma.$transaction(
                        async (tx) => {
                            // ======================================
                            // Update Appointment
                            // ======================================

                            const updatedAppointment =
                                await tx.appointment.update({

                                    where: {
                                        id: appointmentId,
                                    },

                                    data: {
                                        paymentStatus:
                                            paymentStatus.PAID       
                                    },

                                });

                            // ======================================
                            // Update Payment
                            // ======================================
                            const updatedPayment =
                                await tx.payment.update({

                                    where: {
                                        id: paymentId,
                                    },

                                    data: {
                                        status:
                                            paymentStatus.PAID,
                                            paymentGatewayData:
                                                JSON.parse(JSON.stringify(session))
                                    },

                                });

                            // ======================================
                            // Return Updated Data
                            // ======================================

                            return {
                                appointment:
                                    updatedAppointment,

                                payment:
                                    updatedPayment,
                            };
                        }
                    );

               

            } catch (error: any) {

                // ==========================================
                // Database Error
                // ==========================================


                throw new Error(
                    `Database update failed: ${error.message}`
                );
            }


            // ==========================================
            // Final Success
            // ==========================================

            return {

                message: "Payment successful",

                appointmentId,

                paymentId,

            };
        }
        // ==========================================
        // CHECKOUT SESSION EXPIRED
        // ==========================================

        case "checkout.session.expired": {

            const session =
                event.data.object as Stripe.Checkout.Session;


            const appointmentId =
                session.metadata?.appointmentId;


            if (appointmentId) {

                try {

                    const result =
                        await prisma.payment.updateMany({

                            where: {
                                appointmentId,
                            },

                            data: {
                                status:
                                    paymentStatus.UNPAID,
                            },

                        });

                } catch (error: any) {
                    throw error;
                }
            }


            return {

                message:
                    "Checkout session expired",

            };
        }
        // ==========================================
        // DEFAULT
        // ==========================================

        default: {
            return {

                message:
                    `Unhandled event: ${event.type}`,

            };
        }
    }
};


export const paymentService = {

    handleStripeWebhook,

};