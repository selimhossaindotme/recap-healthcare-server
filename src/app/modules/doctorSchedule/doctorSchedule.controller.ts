import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { doctorScheduleService } from "./doctorSchedule.service";
import sendResponse from "../../shared/sendResponse";
import type { IJwtPayload } from "../../types/common";

const insertIntoDB = catchAsync(async ( req: Request & { user?: IJwtPayload }, res: Response, next: NextFunction) => {
    const user = req.user;

    const result = await doctorScheduleService.insertIntoDB(user as IJwtPayload, req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Doctor schedule created successfully',
        data: result
    })
})

export const doctorScheduleController = {
    insertIntoDB
}