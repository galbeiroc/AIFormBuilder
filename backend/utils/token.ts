import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function signToken(payload: string | Buffer | object) {
  const secret = env.jwtSecret as jwt.Secret;
  const expiresIn = env.jwtExpireIn as jwt.SignOptions["expiresIn"];

  return jwt.sign(payload, secret, { expiresIn }) as string;
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret);
}
