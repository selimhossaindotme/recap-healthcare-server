import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import type { IJwtPayload } from "../../types/common";
import { prescriptionService } from "./prescription.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";

const createPrescription = catchAsync(async (req: Request &{ user?: IJwtPayload }, res: Response) => {
    const result = await prescriptionService.createPrescription(req.user as IJwtPayload, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Prescription created successfully",  
        data: result
    });
})

const getMyPrescriptions = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user as IJwtPayload;
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await prescriptionService.getMyPrescriptions(user, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Prescriptions retrieved successfully",
        meta: result.meta,
        data: result.data
    });
})

export const prescriptionController = {
    createPrescription,
    getMyPrescriptions
}