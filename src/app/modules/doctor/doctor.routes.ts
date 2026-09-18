import { Router } from "express";
import { doctorController } from "./doctor.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../generated/client/enums";

const router = Router();

router.get(
    '/',
    doctorController.getAllFromDB
)

router.post('/suggestion', doctorController.getAiSuggestion);


router.patch(
    '/:id',
    doctorController.updateIntoDB
)

router.get(
    '/:id',
    doctorController.getDoctorById
)

router.delete(
    '/:id',
    auth(userRole.ADMIN, userRole.DOCTOR),
    doctorController.deleteDoctorFromDB
)


export const DoctorRoutes = router;