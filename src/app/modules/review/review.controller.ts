import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import type { IJwtPayload } from "../../types/common";
import { reviewService } from "./review.service";
import sendResponse from "../../shared/sendResponse";

const insertIntoDb = catchAsync(async (req: Request & { user?: IJwtPayload }, res: Response) => {

    const user = req.user;

    const result = await reviewService.insertIntoDB(user as IJwtPayload, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Review added successfully",
        data: result,
    })
})

export const reviewController = {
    insertIntoDb
}