import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { scheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";
import type { IJwtPayload } from "../../types/common";

const insertIntoDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await scheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Schedule created successfully',
        data: result
    })
})

const schedulesForDoctor = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response, next: NextFunction) => {

    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])

    const filters = pick(req.query, ['startTime', 'endTime'])

    const user = req.user;

    const result = await scheduleService.schedulesForDoctor(user as IJwtPayload, filters, options);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Schedules fetched successfully',
        meta: result.meta,
        data: result.data
    })
})

const deleteScheduleFromDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await scheduleService.deleteScheduleFromDB(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Schedule deleted successfully',
        data: result
    })
})

export const scheduleController = {
    insertIntoDB,
    schedulesForDoctor,
    deleteScheduleFromDB
}