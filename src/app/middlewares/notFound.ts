import type { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'this route does not exist',
        error: {
            path: req.originalUrl,
            message: 'Your requested path is not found'
        }
    })
}

export default notFound;