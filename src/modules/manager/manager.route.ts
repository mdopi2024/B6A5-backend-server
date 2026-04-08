import { Router } from "express";
import validateRequest from "../../middleware/zodValidate";
import { managerController } from "./manager.controller";
import { createManagerSchema } from "./manager.validator";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";


const router = Router();

router.post(
    "/register-manager",
    checkAuth(Role.ADMIN),
    validateRequest(createManagerSchema),
    managerController.createManager
);

export const managerRouter = router;
