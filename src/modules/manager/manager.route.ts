import { Router } from "express";
import validateRequest from "../../middleware/zodValidate";
import { managerController } from "./manager.controller";
import { createManagerSchema } from "./manager.validator";


const router = Router();

router.post(
    "/register-manager",
    validateRequest(createManagerSchema),
    managerController.createManager
);

export const managerRouter = router;
