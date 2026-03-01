export type TypedResult<T> = {
  message?: string;
  isSuccess?: boolean;
  statusCode?: number;
  data?: T;
};

export type AuthResponse = {
  token?: string;
  userName?: string;
  email?: string;
  avatarUrl?: string;
};

export type LoginPayload = {
  Identifier: string;
  Password: string;
};
