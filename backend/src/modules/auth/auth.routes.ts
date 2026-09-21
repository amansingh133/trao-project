import { Router } from "express";
import * as authController from "./auth.controller.js";
import { requireAuth } from "./auth.middleware.js";
import { authRateLimiter } from "../../shared/middlewares/rateLimiter.middleware.js";
import { validateBody } from "../../shared/middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.validator.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  authRateLimiter,
  validateBody(registerSchema),
  authController.register,
);
authRouter.post(
  "/login",
  authRateLimiter,
  validateBody(loginSchema),
  authController.login,
);
authRouter.post("logout", authController.logout);
authRouter.get("/me", requireAuth, authController.me);
