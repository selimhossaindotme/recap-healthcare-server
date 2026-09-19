
import Stripe from "stripe";
import stripe from "../../helper/stripe";
import { prisma } from "../../shared/prisma";
import { appointmentStatus, paymentStatus } from "../../../generated/client/enums";
import { envVars } from "../../config";


const handleStripeWebhook = async (
  body: Buffer,
  signature: string
) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      envVars.stripe.webhook_secret as string
    );
  } catch (error: any) {
    throw new Error(
      `Webhook verification failed: ${error.message}`
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session =
        event.data.object as Stripe.Checkout.Session;

      const appointmentId =
        session.metadata?.appointmentId;

      if (!appointmentId) {
        throw new Error(
          "Appointment ID not found in Stripe metadata"
        );
      }

      if (session.payment_status !== "paid") {
        return {
          message: "Payment is not completed",
        };
      }

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;

      await prisma.$transaction(async (tx) => {
        // Update payment
        await tx.payment.update({
          where: {
            appointmentId,
          },
          data: {
            status: paymentStatus.PAID,
            stripeSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
          },
        });

        // Confirm appointment
        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            status: appointmentStatus.INPROGRESS,
          },
        });
      });

      return {
        message: "Payment successful",
        appointmentId,
      };
    }

    case "checkout.session.expired": {
      const session =
        event.data.object as Stripe.Checkout.Session;

      const appointmentId =
        session.metadata?.appointmentId;

      if (appointmentId) {
        await prisma.payment.updateMany({
          where: {
            appointmentId,
          },
          data: {
            status: paymentStatus.UNPAID,
          },
        });
      }

      return {
        message: "Checkout session expired",
      };
    }

    default:
      return {
        message: `Unhandled event: ${event.type}`,
      };
  }
};

export const paymentService = {
  handleStripeWebhook,
};