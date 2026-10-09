import { Response } from "express";

interface ISucessess<T, K> {
  statusCode?: number;
  message?: string;
  data?: T | null;
  meta?: K;
}

export const sendSuccess = <T, K>(
  res: Response,
  {
    statusCode = 200,
    message = "Ok",
    data = null,
    meta
  }: ISucessess<T, K>,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  });
};
