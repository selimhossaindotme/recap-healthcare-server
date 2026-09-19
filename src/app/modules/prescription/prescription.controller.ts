import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import type { IJwtPayload } from "../../types/common";
import { prescriptionService } from "./prescription.service";
import sendResponse from "../../shared/sendResponse";

const createPrescription = catchAsync(async (req: Request &{ user?: IJwtPayload }, res: Response) => {
    const result = await prescriptionService.createPrescription(req.user as IJwtPayload, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Prescription created successfully",  
        data: result
    });
})

export const prescriptionController = {
    createPrescription
}