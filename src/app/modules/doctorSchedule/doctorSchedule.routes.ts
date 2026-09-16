import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedule.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../generated/client/enums";
import validateRequest from "../../middlewares/validateRequest";
import { doctorScheduleValidation } from "./doctorSchedule.validation";

const router = Router();

router.post('/',
    auth(userRole.DOCTOR),
    validateRequest(doctorScheduleValidation.createDoctorScheduleSchemaValidation),
    doctorScheduleController.insertIntoDB
)

export const doctorScheduleRoutes = router;
