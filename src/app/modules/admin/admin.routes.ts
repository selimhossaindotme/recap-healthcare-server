import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get(
    '/',
    adminController.getAllAdminFromDb
)

router.get(
    '/:id',
    adminController.getAdminById
)

router.patch(
    '/:id',
    adminController.updateAdminById
)

router.delete(
    '/:id',
    adminController.deleteAdminById
)



export const adminRoutes = router;