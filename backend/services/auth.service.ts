import bcript from "bcryptjs";

import { ApiError } from "../utils/ApiError";
import { signToken } from "../utils/token";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPassword,
  updateUserProfile,
} from "../repositories/user.repo";
import { TUser, TInputUser } from "../types/types";

type TPublicUser = Omit<TUser, "password" | "_id"> & { id: string };

const AVATAR_COLORS = [
  "#0c8b7c",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#059669",
];

function pickAvatarColor(seed: string) {
  const sum = [...seed].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export function toPublicUser(user: TUser): TPublicUser {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarColor: user.avatarColor,
    createdAt: user.createdAt,
  };
}

export async function registerUser({
  name,
  email,
  password,
}: TInputUser): Promise<{
  user: TPublicUser;
  token: string;
}> {
  if (name.trim().length < 2)
    throw ApiError.badRequest("Name must be at least 2 characters");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]/.test(email))
    throw ApiError.badRequest("Please provide a valid email");
  if (password.length < 4)
    throw ApiError.badRequest("Password must be a least 4 characters");

  const existingUser = await findUserByEmail(email);
  if (existingUser)
    throw ApiError.conflict("An account with this email already exists");

  const hash = await bcript.hash(password, 10);
  const user = (await createUser({
    name: name.trim(),
    email,
    password: hash,
    avatar_color: pickAvatarColor(email),
  })) as TUser;

  const token = signToken({ id: user?._id });

  return { user: toPublicUser(user), token };
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = (await findUserByEmail(email, { withPassword: true })) as TUser;
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isMatch = await bcript.compare(password, user.password as string);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  const token = signToken({ id: user._id });

  return { user: toPublicUser(user), token };
}

export async function updateProfile(
  userId: string,
  { name, avatarColor }: { name: string; avatarColor: string },
) {
  const user = (await updateUserProfile(userId, {
    name: name?.trim() ?? null,
    avatarColor,
  })) as TUser;
  if (!user) throw ApiError.notFound("User not found");

  return toPublicUser(user);
}

export async function changePassword(
  userId: string,
  {
    currentPassword,
    newPassword,
  }: { currentPassword: string; newPassword: string },
) {
  if (!currentPassword || !newPassword)
    throw ApiError.badRequest("Current and new password are required");
  if (newPassword.length < 4)
    throw ApiError.badRequest("New password must be at least 4 characters");

  const user = await findUserById(userId, { withPassword: true });
  if (!user) throw ApiError.notFound("User not found");

  const isMatch = await bcript.compare(
    currentPassword,
    user.password as string,
  );
  if (!isMatch) throw ApiError.unauthorized("Current password is incorrect");

  await updateUserPassword(userId, await bcript.hash(newPassword, 10));
}
