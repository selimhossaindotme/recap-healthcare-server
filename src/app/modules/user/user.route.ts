import { Router, type NextFunction, type Request, type Response } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { userRole } from "../../../generated/client/enums";

const router = Router();

router.get('/',
    auth(userRole.ADMIN),
    userController.getallFromBD)

router.post('/create-patient',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatientZodSchema.parse(JSON.parse(req.body.data));
        return userController.createPatient(req, res, next)
    }
)

router.get(
    '/me',
    auth(userRole.PATIENT, userRole.DOCTOR, userRole.ADMIN),
    userController.getMyProfile
)

router.post('/create-admin',
    auth(userRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdminZodSchema.parse(JSON.parse(req.body.data));

        return userController.createAdmin(req, res, next)
    }
)

router.post('/create-doctor',
    auth(userRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createDoctorZodSchema.parse(JSON.parse(req.body.data));
        return userController.createDoctor(req, res, next)
    }
)

router.patch(
    '/:id/status',
    auth(userRole.ADMIN),
    userController.changeProfileStatus
)


export const userRoutes = router