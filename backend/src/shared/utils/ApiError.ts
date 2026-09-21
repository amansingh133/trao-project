/**
 * A typed, operational error carrying an HTTP status code and a stable
 * machine-readable code. Thrown anywhere in the request lifecycle (or the
 * pipeline) and caught by the centralized error-handling middleware, which
 * decides how to serialize it for the client.
 */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational = true;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code = "BAD_REQUEST"): ApiError {
    return new ApiError(400, code, message);
  }

  static unauthorized(
    message = "Authentication required",
    code = "UNAUTHORIZED",
  ): ApiError {
    return new ApiError(401, code, message);
  }

  static forbidden(message = "Not allowed", code = "FORBIDDEN"): ApiError {
    return new ApiError(403, code, message);
  }

  static notFound(message = "Not found", code = "NOT_FOUND"): ApiError {
    return new ApiError(404, code, message);
  }

  static conflict(message: string, code = "CONFLICT"): ApiError {
    return new ApiError(409, code, message);
  }

  static tooManyRequests(
    message = "Too many requests",
    code = "RATE_LIMITED",
  ): ApiError {
    return new ApiError(429, code, message);
  }

  static internal(
    message = "Internal server error",
    code = "INTERNAL",
  ): ApiError {
    return new ApiError(500, code, message);
  }
}
