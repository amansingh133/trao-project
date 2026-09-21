import type { Request, Response } from "express";
import * as authService from "./auth.service.js";
import { SESSION_COOKIE, sessionCookieOptions } from "./auth.jwt.js";
import type { LoginInput, RegisterInput } from "./auth.validator.js";

export async function register(req: Request, res: Response) {
  const { token, user } = await authService.registerUser(
    req.body as RegisterInput,
  );
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const { token, user } = await authService.authenticateUser(
    req.body as LoginInput,
  );
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions);
  res.status(200).json({ user });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
  res.status(200).json({ ok: true });
}

export async function me(req: Request, res: Response) {
  const user = await authService.getUserById(req.userId as string);
  res.status(200).json({ user });
}
