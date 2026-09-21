import { Router } from "express";
import { patientController } from "./patient.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../generated/client/enums";

const router = Router();

router.get('/',
    patientController.getAllFromDB
)

router.get(
    '/:id',
    patientController.getPatientById
)

router.delete(
    '/:id',
    patientController.deletePatientById
)
router.patch(
    '/',
    auth(userRole.PATIENT),
    patientController.updateIntoDB
)



export const patientRoutes = router;