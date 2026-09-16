import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { userRole } from "../../../generated/client/enums";

const router = Router();

router.get('/',
    auth(userRole.ADMIN, userRole.DOCTOR),
    scheduleController.schedulesForDoctor
);

router.post('/',
    auth(userRole.ADMIN),
    scheduleController.insertIntoDB);

router.delete('/:id',
    auth(userRole.ADMIN),
    scheduleController.deleteScheduleFromDB
)

export const scheduleRoutes = router;