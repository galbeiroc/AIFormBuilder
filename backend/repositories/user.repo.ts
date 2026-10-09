import { query } from "../config/db";
import { IRow, TInputUser, TUser } from "../types/types";

function mapUser(row: IRow): TUser | null {
  if (!row) return null;

  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    avatarColor: row.avatar_color,
    createdAt: row.created_at,
  };
}

export async function createUser({
  name,
  email,
  password,
  avatar_color,
}: TInputUser & { avatar_color: string }) {
  const { rows } = await query(
    `
    INSERT INTO users (name, email, password, avatar_color) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email.toLowerCase(), password, avatar_color || "#0c8b7c"],
  );

  return mapUser(rows[0]);
}

export async function findUserByEmail(
  email: string,
  { withPassword = false } = {},
) {
  const { rows } = await query(`SELECT * FROM users WHERE email = $1`, [
    email.toLowerCase(),
  ]);
  const user = mapUser(rows[0]) as Partial<IRow>;

  if (user && !withPassword) delete user.password;

  return user;
}

export async function findUserById(id: string, { withPassword = false } = {}) {
  const { rows } = await query(`SELECT * FROM users WHERE id = $1`, [id]);
  const user = mapUser(rows[0]) as Partial<IRow>;

  if (user && !withPassword) delete user.password;

  return user;
}

export async function updateUserProfile(
  id: string,
  { name, avatarColor }: { name: string; avatarColor: string },
) {
  const { rows } = await query(
    `UPDATE users SET name = COALESCE($2, name), avatar_color = COALESCE($3, avatarColor) WHERE id = $1`,
    [id, name ?? null, avatarColor ?? null],
  );
  const user = mapUser(rows[0]) as Partial<IRow>;

  if (user) delete user.password;

  return user;
}

export async function updateUserPassword(id: string, passwordHash: string) {
  await query(`UPDATE users SET password = $2 WHERE id = $1`, [
    id,
    passwordHash,
  ]);
}

export async function deleteUser(id: string) {
  await query(`DELETE FROM users WHERE id = $1`, [id]);
}
