import type { Response } from "express";

const sendResponse = <T>(res: Response, data: {
    statusCode: number,
    success: boolean,
    message: string,
    meta?: {
        page: number,
        limit: number,
        total: number
    },
    data?: T | null
}) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
    })
}

export default sendResponse;