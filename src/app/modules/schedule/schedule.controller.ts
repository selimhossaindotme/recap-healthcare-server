import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { scheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";

const insertIntoDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await scheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Schedule created successfully',
        data: result
    })
})

export const scheduleController = {
    insertIntoDB
}