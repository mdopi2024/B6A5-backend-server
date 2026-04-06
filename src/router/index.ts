import { Router } from "express";
import { authRoter } from "../modules/auth/auth.router";

const router = Router();

router.use("/auth", authRoter);

export default router