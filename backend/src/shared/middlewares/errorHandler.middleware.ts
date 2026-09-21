import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../config/logger.js";

/** Centralized error handler. Every thrown/rejected error in the app lands here. */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    if (!err.isOperational || err.statusCode >= 500) {
      logger.error({ err, path: req.path }, err.message);
    }
    res
      .status(err.statusCode)
      .json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: err.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; "),
      },
    });
    return;
  }

  logger.error({ err, path: req.path }, "Unhandled error");
  res
    .status(500)
    .json({ error: { code: "INTERNAL", message: "Internal server error" } });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `No route for ${req.method} ${req.path}`,
    },
  });
}
