import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";


const createPatient = catchAsync(async (req: Request, res: Response) => {
    const result =  await userService.createPatientService(req)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Patient created successfully",
        data: result
    })
})

const createAdmin = catchAsync( async ( req: Request, res: Response) => {
    const result = await userService.createAdminServer(req);

    sendResponse( res, {
        statusCode: 200,
        success: true,
        message: "Admin created successfully",
        data: result
    })
})

const createDoctor = catchAsync( async ( req: Request, res: Response) => {
    const result = await userService.createDoctorServer(req);

    sendResponse( res, {
        statusCode: 200,
        success: true,
        message: "Doctor created successfully",
        data: result
    })
})

export const userController = {
    createPatient,
    createAdmin,
    createDoctor
}