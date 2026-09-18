import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { patientService } from "./patient.service";
import sendResponse from "../../shared/sendResponse";
import { patientFilterableFields } from "./patient.constance";

const getAllFromDB = catchAsync(async ( req: Request, res: Response) => {

    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])

    const result = await patientService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patients retrieved successfully',
        meta: result.meta,
        data: result.data
    })
})

const getPatientById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await patientService.getPatientById(id as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient retrieved successfully',
        data: result
    })
})

const deletePatientById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

     await patientService.deletePatientById(id as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient deleted successfully',
        data: null
    })
})

const updatePatientById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await patientService.updatePatientById(id as string, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Patient updated successfully',
        data: result
    })
})


export const patientController = {
    getAllFromDB,
    getPatientById,
    deletePatientById,
    updatePatientById
}