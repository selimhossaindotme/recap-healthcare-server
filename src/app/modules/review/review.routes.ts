import { Router } from "express";
import auth from "../../middlewares/auth";
import { userRole } from "../../../generated/client/enums";
import { reviewController } from "./review.controller";

const router = Router();

router.post('/',
    auth(userRole.PATIENT),
    reviewController.insertIntoDb
)

export const reviewRoutes = router;