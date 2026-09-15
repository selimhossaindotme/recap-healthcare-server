import { Router } from "express";
import { scheduleController } from "./schedule.controller";

const router = Router();

router.post('/', scheduleController.insertIntoDB);

export const scheduleRoutes = router;