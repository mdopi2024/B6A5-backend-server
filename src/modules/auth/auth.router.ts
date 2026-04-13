import { Router } from "express";
import { authController } from "./auth.contorller";
import validateRequest from "../../middleware/zodValidate";
import { loginValidationSchema, updateRoleValidationSchema } from "./auth.validator";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../generated/prisma/enums";


const router = Router();

// POST /auth/register - Create a new user
router.post("/register", authController.registerUser);

// POST /auth/login - Login existing user
router.post("/login", validateRequest(loginValidationSchema), authController.loginUser);

// GET /auth/users - Get all users (admin only)
router.get("/users", checkAuth(Role.ADMIN), authController.getAllUsersController);
router.get("/user/:id", checkAuth(Role.ADMIN), authController.getUserByIdController);

// PATCH /auth/delete-restore/:id - Delete or restore user (admin only)
router.patch("/delete-restore/:id", checkAuth(Role.ADMIN), authController.deleteUserController);
router.patch("/update-role/:id", checkAuth(Role.ADMIN), validateRequest(updateRoleValidationSchema), authController.updateUserRole);

// POST /auth/logout - Logout user
router.post("/logout", checkAuth(), authController.logoutUser);

export const authRoter = router;
