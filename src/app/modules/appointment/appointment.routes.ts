import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../generated/client/enums";

const router = Router();

router.post('/',
    auth(userRole.PATIENT), 
    appointmentController.createAppointment
)

export const appointmentRoutes = router;