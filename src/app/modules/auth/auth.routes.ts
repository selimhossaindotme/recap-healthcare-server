import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post('/login', authController.credentialsLogin)
router.get('/me', authController.getMe)
export const authRoutes = router