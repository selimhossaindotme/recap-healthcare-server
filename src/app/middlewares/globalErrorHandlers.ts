import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/client/client";
import { StatusCodes } from 'http-status-codes';
const globalErrorHandlers = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode : number = err.statusCode || 500;
    let message : string = err.message
    let success: boolean = err.success || false;
    let error = err

    if (err instanceof Prisma.PrismaClientKnownRequestError){
        if (err.code === 'P2002'){
            message = `Duplicate field value entered`;
            error = err.meta;
            statusCode = StatusCodes.CONFLICT
        }

        else if (err.code === 'P1001'){
            message = `Authentication failed against the database server`;
            error = err.meta;
            statusCode = StatusCodes.UNAUTHORIZED
        }

        else if (err.code === 'P2025'){
            message = `The record you are trying to update or delete does not exist`;
            error = err.meta;
            statusCode = StatusCodes.NOT_FOUND
        }

        else if (err.code === 'P2003'){
            message = `Foreign key constraint failed`;
            error = err.meta;
            statusCode = StatusCodes.BAD_REQUEST
        }
    }

    else if (err instanceof Prisma.PrismaClientValidationError) {
        message = `Validation error occurred`;
        statusCode = StatusCodes.BAD_REQUEST
        error = err.message
    }

    else if (err instanceof Prisma.PrismaClientUnknownRequestError){
        message = `An unknown error occurred`;
        error = err.message
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }

    else if (err instanceof Prisma.PrismaClientInitializationError){
        message = `Failed to initialize Prisma Client`;
        error = err.message
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }



    res.status(statusCode).json({
        success,
        message,
        error
    })
}

export default globalErrorHandlers;