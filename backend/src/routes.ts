import { Router } from "express";
import { authRouter } from "./modules/auth/index.js";

export const router = Router();

router.use("/auth", authRouter);
