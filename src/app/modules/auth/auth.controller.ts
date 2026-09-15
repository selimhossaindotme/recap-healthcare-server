import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../shared/sendResponse";

const credentialsLogin = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.login(req.body);

    const { accessToken, refreshToken, needPasswordChange } = result;

    res.cookie('accessToken', accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    })

    res.cookie('refreshToken', refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 day in milliseconds
    })

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: result
    })
})

export const authController = {
    credentialsLogin
}