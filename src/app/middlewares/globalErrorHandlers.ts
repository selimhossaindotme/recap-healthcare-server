import type { NextFunction, Request, Response } from "express";

const globalErrorHandlers = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode : number = err.statusCode || 500;
    let message : string = err.message
    let success: boolean = err.success || false;
    let error = err

    res.status(statusCode).json({
        success,
        message,
        error
    })
}

export default globalErrorHandlers;