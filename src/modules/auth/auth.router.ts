import { Router } from "express";
import { authController } from "./auth.contorller";
import validateRequest from "../../middleware/zodValidate";
import { loginValidationSchema } from "./auth.validator";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";


const router = Router();

// POST /auth/register - Create a new user
router.post("/register", authController.registerUser);

// POST /auth/login - Login existing user
router.post("/login", validateRequest(loginValidationSchema), authController.loginUser);

// GET /auth/users - Get all users (admin only)
router.get("/users", checkAuth(Role.ADMIN), authController.getAllUsersController);

// PATCH /auth/delete-users/:id - Delete or restore user (admin only)
router.patch("/delete-users/:id", checkAuth(Role.ADMIN), authController.deleteUserController);

// POST /auth/logout - Logout user
router.post("/logout", checkAuth(), authController.logoutUser);

export const authRoter = router;
