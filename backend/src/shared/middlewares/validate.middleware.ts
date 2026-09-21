import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

/** Validates and replaces req.body with the parsed (and coerced) result of `schema`. */
export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
}
