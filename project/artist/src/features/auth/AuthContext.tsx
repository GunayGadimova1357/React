import { createContext } from "react";

export type ArtistAuthState = {
  isAuthenticated: boolean;
  userName?: string;
  email?: string;
  avatarUrl?: string;
};

export type ArtistAuthContextType = ArtistAuthState & {
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<Pick<ArtistAuthState, 'userName' | 'email' | 'avatarUrl'>>) => void;
};

export const AuthContext = createContext<ArtistAuthContextType | null>(null);
