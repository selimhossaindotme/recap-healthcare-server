import type { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import { adminFilterableFields } from "./admin.contance";
import { adminService } from "./admin.service";
import sendResponse from "../../shared/sendResponse";

const getAllAdminFromDb = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await adminService.getAllAdmin(filter, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admins retrieved successfully',
        meta: result.meta,
        data: result.data
    })
})

const getAdminById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.getAdminById(id as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin retrieved successfully',
        data: result
    })

})

const updateAdminById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const result = await adminService.updateAdminById(id as string, data);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin updated successfully',
        data: result
    })
})

const deleteAdminById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
     await adminService.deleteAdminById(id as string);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Admin deleted successfully',
        data: null
    })
})

export const adminController = {
    getAllAdminFromDb,
    getAdminById,
    updateAdminById,
    deleteAdminById
}