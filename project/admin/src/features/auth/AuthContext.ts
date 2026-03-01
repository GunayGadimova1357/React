import { createContext } from "react";

export type AdminAuthState = {
  isAuthenticated: boolean;
  userName?: string;
  email?: string;
  avatarUrl?: string;
};

export type AdminAuthContextType = AdminAuthState & {
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AdminAuthContextType | null>(null);
