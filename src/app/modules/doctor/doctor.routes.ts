import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get(
    '/',
    doctorController.getAllFromDB
)

router.patch(
    '/:id',
    doctorController.updateIntoDB
)

export const DoctorRoutes = router;