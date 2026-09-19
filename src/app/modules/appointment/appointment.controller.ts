import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { appointmentService } from "./appointment.service";
import type { IJwtPayload } from "../../types/common";
import pick from "../../helper/pick";

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

const getMyAppointments = catchAsync(async (req: Request & { user?:IJwtPayload  }, res: Response) => {
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, ['status', "paymentStatus"]);
    const user = req.user;

    const result = await appointmentService.getMyAppointments(user as IJwtPayload, filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointments retrieved successfully",
        meta: result.meta,
        data: result.data
    });

})

const updateAppointmentStatus = catchAsync(async (req: Request & { user?:IJwtPayload  }, res: Response) => {

    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    const result = await appointmentService.updateAppointmentStatus(id as string, status, user as IJwtPayload);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Appointment status updated successfully",
        data: result
    });

})

export const appointmentController = {
    createAppointment,
    getMyAppointments,
    updateAppointmentStatus
}