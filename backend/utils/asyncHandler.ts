import { NextFunction, Request, Response } from "express";
import { TUser } from "../types/types";

export interface IRequest extends Request {
  user?: TUser;
}

export const asyncHandler =
  (fn: (arg0: IRequest, arg1: Response, arg2: NextFunction) => void) =>
  (req: IRequest, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
