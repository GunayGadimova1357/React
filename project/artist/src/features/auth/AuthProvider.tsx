import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { LogOut, BadgeCheck, ShieldX } from "lucide-react";

import { AuthContext } from "./AuthContext";
import { login as loginApi, logout as logoutApi } from "./authApi";
import { isArtistToken } from "./jwt";
import { getMe } from "@/services/artistProfileApi";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  getUserName,
  setUserName,
  getEmail,
  setEmail,
  getAvatarUrl,
  setAvatarUrl,
} from "@/services/TokenStore";

type State = {
  isAuthenticated: boolean;
  userName: string;
  email: string;
  avatarUrl: string;
};

const emptyState: State = {
  isAuthenticated: false,
  userName: "",
  email: "",
  avatarUrl: "",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(() => {
    const t = getAccessToken();
    if (t && isArtistToken(t)) {
      return {
        isAuthenticated: true,
        userName: getUserName() || "",
        email: getEmail() || "",
        avatarUrl: getAvatarUrl() || "",
      };
    }
    if (t) clearAccessToken();
    return emptyState;
  });

  const login = async (identifier: string, password: string) => {
    const res = await loginApi(identifier, password);

    if (!isArtistToken(res.token)) {
      clearAccessToken();
      toast.error("Access denied: Artist only", {
        icon: <ShieldX size={18} className="text-red-400" />,
      });
      throw new Error("Artist role required");
    }

    setAccessToken(res.token);

    setUserName(res.userName ?? "");
    setEmail(res.email ?? "");
    setAvatarUrl(res.avatarUrl ?? "");

    setState({
      isAuthenticated: true,
      userName: res.userName ?? "",
      email: res.email ?? "",
      avatarUrl: res.avatarUrl ?? "",
    });

    // Загружаем актуальные данные профиля
    try {
      const me = await getMe();
      updateUserData({
        userName: me.artistName ?? res.userName ?? "",
        avatarUrl: me.photoUrl ?? res.avatarUrl ?? "",
      });
    } catch (error) {
      // Игнорируем ошибку, используем данные из логина
    }

    toast.success(`Welcome, ${res.userName}!`, {
      icon: <BadgeCheck size={18} className="text-emerald-400" />,
    });
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAccessToken();
      setState(emptyState);

      toast.success("Signed out", {
        icon: <LogOut size={18} className="text-zinc-400" />,
      });
    }
  };

  const updateUserData = (data: Partial<Pick<State, 'userName' | 'email' | 'avatarUrl'>>) => {
    setState((prev) => {
      const newState = { ...prev, ...data };
      // Сохраняем в localStorage
      if (data.userName !== undefined) setUserName(data.userName);
      if (data.email !== undefined) setEmail(data.email);
      if (data.avatarUrl !== undefined) setAvatarUrl(data.avatarUrl);
      return newState;
    });
  };

  const value = useMemo(() => ({ ...state, login, logout, updateUserData }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
