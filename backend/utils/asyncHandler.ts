import { NextFunction, Request, Response } from "express";

export const asyncHandler =
  (fn: (arg0: Request, arg1: Response, arg2: NextFunction) => void) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
