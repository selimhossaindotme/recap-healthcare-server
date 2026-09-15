import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";


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

const getallFromBD = async (req: Request, res: Response) => {
    // common --> page, limit, sortBy, sortOrder --> pagination , sorting
    // search --> searchTerm, filter --> searching and filtering

    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])
    const filters = pick(req.query, ['status', 'role', 'email', 'searchTerm'])

    // // const { page, limit , searchTerm , sortBy, sortOrder, role, status  } = req.query;
    // const result = await userService.getAllFromDBService({ page: Number(page), limit: Number(limit), searchTerm: searchTerm , sortBy: sortBy , sortOrder: sortOrder, role: role, status: status });
    const result = await userService.getAllFromDBService(filters, options);
    sendResponse( res, {
        statusCode: 200,
        success: true,
        message: "All users fetched successfully",
        meta: result.meta,
        data: result.data
    })
}

export const userController = {
    createPatient,
    createAdmin,
    createDoctor,
    getallFromBD
}