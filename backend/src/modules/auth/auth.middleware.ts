import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../../shared/utils/ApiError.js";
import {
  SESSION_COOKIE,
  sessionCookieOptions,
  verifySession,
} from "./auth.jwt.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

/**
 * Verifies the session cookie and attaches `req.userId`. An expired or
 * tampered token clears the cookie (so the browser stops resending a dead
 * session) and reports a clean 401 rather than a stack trace.
 */

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[SESSION_COOKIE];

  if (!token) {
    next(ApiError.unauthorized("Sign in required", "NOT_AUTHENTICATED"));
    return;
  }

  try {
    const payload = verifySession(token);
    req.userId = payload.sub;
    next();
  } catch {
    res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
    next(
      ApiError.unauthorized(
        "Session expired or invalid, please sign in again",
        "SESSION_EXPIRED",
      ),
    );
  }
}
