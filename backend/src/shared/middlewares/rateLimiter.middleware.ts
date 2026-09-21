import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

/** General API rate limit — protects the app and, transitively, the LLM/token budget behind it. */
export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests, please slow down",
    },
  },
});

/** Tighter limit on auth endpoints to blunt credential-stuffing / brute force. */
export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: "RATE_LIMITED",
      message: "Too many auth attempts, please slow down.",
    },
  },
});
