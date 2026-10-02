import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { isProd } from "../config/env";

interface IError extends Error {
  errors?: Error[];
  details?: string;
  statusCode: number;
  code?: number;
  path?: string;
  value?: string;
}

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHander(
  err: IError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  let error = err;

  if (error.name === "ValidationError") {
    const details =
      error.errors &&
      Object.values(error.errors)
        .map((e) => e.message)
        .join(",\n");
    error = ApiError.badRequest("Validation Failed: ", details);
  } else if (error.name === "CastError") {
    error = ApiError.badRequest(`Invalid ${error.path} ${error.value}`);
  } else if (!(error instanceof ApiError)) {
    error = ApiError.internal(error.message);
  }

  if (!isProd && error.statusCode >= 500) {
    console.log(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
  });
}
