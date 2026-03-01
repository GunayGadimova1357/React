import { authApi as api } from "../../api/clients";
import type { TypedResult, AuthResponse } from "./types";

function pick<T = any>(obj: any, ...keys: string[]): T | undefined {
  for (const k of keys) if (obj && obj[k] !== undefined) return obj[k];
  return undefined;
}

export function extractAuth(resData: any) {
  const data = pick<any>(resData, "data") ?? null;
  const token = pick<string>(data, "token") ?? null;

  const ok = pick<boolean>(resData, "isSuccess");
  const message = pick<string>(resData, "message") ?? "";

  return { data, token, ok: ok ?? true, message };
}

export async function login(identifier: string, password: string) {
  const res = await api.post<TypedResult<AuthResponse>>("/Auth/login", {
    Identifier: identifier,
    Password: password,
  })
  console.log("LOGIN RAW:", res.data);

  const parsed = extractAuth(res.data);

  if (!parsed.ok) throw new Error(parsed.message || "Login failed");
  if (!parsed.token) throw new Error("Token missing in response");

  return {
    token: parsed.token,
    userName: pick<string>(parsed.data, "userName") ?? "",
    email: pick<string>(parsed.data, "email") ?? "",
    avatarUrl: pick<string>(parsed.data, "avatarUrl") ?? "",
  };
}

export async function logout() {
  await api.post("/Auth/logout");
}
