import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { scheduleRoutes } from "../modules/schedule/schedule.routes.js";
import { doctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.routes.js";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.routes.js";

const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/schedules',
        route: scheduleRoutes
    }, 
    {
        path: '/doctor-schedules',
        route: doctorScheduleRoutes
    },
     {
        path: '/specialties',
        route: SpecialtiesRoutes
    }
];

moduleRoutes.forEach((route) => router.use(
    route.path, route.route
))

export default router;