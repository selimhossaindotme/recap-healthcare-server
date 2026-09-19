import { StatusCodes } from "http-status-codes";
import sendResponse from "../../shared/sendResponse";
import { paymentService } from "./payment.service";
import apiError from "../../errors/apiError";
import catchAsync from "../../shared/catchAsync";
import type { Request, Response } from "express";

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    if (!signature || Array.isArray(signature)) {
        throw new apiError(
            StatusCodes.BAD_REQUEST,
            "Stripe signature is missing"
        );
    }

    const result = await paymentService.handleStripeWebhook(
        req.body,
        signature
    );

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Stripe webhook processed successfully",
        data: result,
    });
});

export const paymentController = {
    stripeWebhook,
};