import { Router } from "express";
import { authController } from "./auth.contorller";
import validateRequest from "../../middleware/zodValidate";
import { loginValidationSchema } from "./auth.validator";


const router = Router();

// POST /auth/register - Create a new user
router.post("/register", authController.registerUser);

// POST /auth/login - Login existing user
router.post("/login",validateRequest(loginValidationSchema),authController.loginUser );

export const authRoter = router;
