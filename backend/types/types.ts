export type TInputUser = {
  name: string;
  email: string;
  password: string;
};

export interface IRow extends TInputUser {
  id: string;
  avatar_color: string;
  created_at: Date;
}

export type TUser = TInputUser & {
  _id: string;
  avatarColor: string;
  createdAt: Date;
}