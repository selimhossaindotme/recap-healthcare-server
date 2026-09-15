import type { NextFunction, Request, Response } from "express"

const auth = (...roles: string[]) => {
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.get('accessToken');

            if(!token) {
                throw new Error("You are not authorized to access this route");
            }

            

        } catch (error) {
            next(error)
        }
    }
}