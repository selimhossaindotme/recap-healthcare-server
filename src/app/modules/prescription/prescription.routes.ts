import { Router } from "express";
import auth from "../../middlewares/auth";
import { userRole } from "../../../generated/client/enums";
import { prescriptionController } from "./prescription.controller";

const router = Router();

router.post(
    '/',
    auth(userRole.DOCTOR),
    prescriptionController.createPrescription
)

export const prescriptionRoutes = router;