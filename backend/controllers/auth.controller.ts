import { ApiError } from "../utils/ApiError";
import { sendSuccess } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

import {
  loginUser,
  registerUser,
  toPublicUser,
  updateProfile,
  changePassword,
} from "../services/auth.service";
import { TInputUser, TUser } from "../types/types";
import { deleteUser } from "../repositories/user.repo";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body as TInputUser;
  if (!name || !email || password)
    throw ApiError.badRequest("Name, Email and Password are required");

  const { user, token } = await registerUser({ name, email, password });
  sendSuccess(res, {
    statusCode: 201,
    message: "Account created successfully",
    data: { user, token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw ApiError.badRequest("Email and password are required");

  const { user, token } = await loginUser({ email, password });
  sendSuccess(res, {
    message: "Logged successfully",
    data: { user, token },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { data: toPublicUser(req.user as unknown as TUser) });
});

export const patchProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user?._id as string, req.body);
  sendSuccess(res, { message: "Profile updated", data: { user } });
});

export const patchPassword = asyncHandler(async (req, res) => {
  await changePassword(req.user?._id as string, req.body);
  sendSuccess(res, { message: "Password updated" });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await deleteUser(req.user?._id as string);
  sendSuccess(res, { message: "Account deleted" });
});
