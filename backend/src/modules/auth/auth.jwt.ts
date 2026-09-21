import jwt from "jsonwebtoken";
import { env } from "../../shared/config/env.js";

export interface SessionPayload {
  sub: string;
  email: string;
}

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifySession(token: string): SessionPayload {
  return jwt.verify(token, env.JWT_SECRET) as SessionPayload;
}

export const SESSION_COOKIE = "session";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
