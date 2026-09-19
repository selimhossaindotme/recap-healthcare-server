import { Router } from "express";
import { appointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../generated/client/enums";

const router = Router();

router.get(
    '/my-appointments',
    auth(userRole.PATIENT, userRole.DOCTOR),
    appointmentController.getMyAppointments
)

router.post('/',
    auth(userRole.PATIENT), 
    appointmentController.createAppointment
)

router.patch(
    "/:id",
    auth(userRole.DOCTOR),
    appointmentController.updateAppointmentStatus
)

export const appointmentRoutes = router;