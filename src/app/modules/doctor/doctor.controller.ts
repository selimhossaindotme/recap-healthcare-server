import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { doctorService } from "./doctor.service";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { doctorFilterableFields } from "./doctor.constance";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, doctorFilterableFields);

    const result = await doctorService.getAllFromBD(filters, options);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctors retrieved successfully',
        meta: result.meta,
        data: result.data
    })

})

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;




    const result = await doctorService.updateIntoDB(id as string, req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor updated successfully',
        data: result
    })

})

const getAiSuggestion = catchAsync(async (req: Request, res: Response) => {
    const result = await doctorService.getAiSuggestion(req.body);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'AI suggestion retrieved successfully',
        data: result
})

})

const getDoctorById = catchAsync(async (req: Request, res: Response ) => {
    const { id } = req.params;

    const result = await doctorService.getDoctorById(id as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor retrieved successfully',
        data: result
    })
})

const deleteDoctorFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await doctorService.deleteDoctorFromDB(id as string);

    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Doctor deleted successfully',
        data: result
    })
})

export const doctorController = {
    getAllFromDB,
    updateIntoDB,
    getAiSuggestion,
    deleteDoctorFromDB,
    getDoctorById
}