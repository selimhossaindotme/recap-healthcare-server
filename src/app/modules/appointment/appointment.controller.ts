import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { appointmentService } from "./appointment.service";
import type { IJwtPayload } from "../../types/common";

const createAppointment = catchAsync(async (req: Request & { user?:IJwtPayload  }, res: Response) => {
    const user = req.user;
    const result = await appointmentService.createAppointment( user as IJwtPayload,req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment created successfully",
        data: result
    });
})

export const appointmentController = {
    createAppointment
}