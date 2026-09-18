import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { scheduleRoutes } from "../modules/schedule/schedule.routes.js";
import { doctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.routes.js";
import { SpecialtiesRoutes } from "../modules/specialties/specialties.routes.js";
import { DoctorRoutes } from "../modules/doctor/doctor.routes.js";
import { appointmentRoutes } from "../modules/appointment/appointment.routes.js";
import { patientRoutes } from "../modules/patient/patient.routes.js";
import { adminRoutes } from "../modules/admin/admin.routes.js";

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
    },
    {
       path: '/doctors',
       route: DoctorRoutes 
    }, 
    {
        path: '/patients',
        route: patientRoutes
    },
    {
        path: '/admins',
        route: adminRoutes
    },
    {
        path: '/appointment',
        route: appointmentRoutes
    }
];

moduleRoutes.forEach((route) => router.use(
    route.path, route.route
))

export default router;