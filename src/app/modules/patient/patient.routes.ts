import { Router } from "express";
import { patientController } from "./patient.controller";

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
    '/:id',
    patientController.updatePatientById
)



export const patientRoutes = router;