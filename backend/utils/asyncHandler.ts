import { NextFunction, Request, Response } from "express";
import { IRow } from "../repositories/user.repo";

export interface IRequest extends Request {
  user?: IRow;
}

export const asyncHandler =
  (fn: (arg0: IRequest, arg1: Response, arg2: NextFunction) => void) =>
  (req: IRequest, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
