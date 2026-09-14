import { Router, type NextFunction, type Request, type Response } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { userValidation } from "./user.validation";

const router = Router();

router.post('/create-patient', 
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatientZodSchema.parse(JSON.parse(req.body.data));
        return userController.createPatient(req, res, next)
    }
)

router.post('/create-admin',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdminZodSchema.parse(JSON.parse(req.body.data));

        return userController.createAdmin(req, res, next)
    }
)

router.post('/create-doctor',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createDoctorZodSchema.parse(JSON.parse(req.body.data));
        return userController.createDoctor(req, res, next)
    }
)


export const userRoutes = router