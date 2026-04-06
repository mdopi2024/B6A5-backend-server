import { Router } from "express";
import { authController } from "./auth.contorller";


const router = Router();

// POST /auth/register - Create a new user
router.post("/register", authController.registerUser);

// POST /auth/login - Login existing user
router.post("/login",authController.loginUser );

export const authRoter = router;
