import type { NextFunction, Request, Response } from "express"
import { jwtHelper } from "../helper/jwtHelpers";
import { envVars } from "../config";
import apiError from "../errors/apiError";
import { StatusCodes } from "http-status-codes";

const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.accessToken;

            if(!token) {
                throw new apiError(StatusCodes.UNAUTHORIZED, "You are not authorized to access this route");
            }

            const verifyUser = jwtHelper.VerifyToken( token, envVars.JWT.secret as string );

            req.user =  verifyUser; 

            if( roles.length && !roles.includes(verifyUser.role) ){
                throw new apiError(StatusCodes.FORBIDDEN, "You are not authorized to access this route");
            }

            next();


        } catch (error) {
            next(error)
        }
    }
}

export default auth