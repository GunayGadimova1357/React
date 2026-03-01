import React, { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginApi, logout as logoutApi } from "./authApi";
import { clearAccessToken, getAccessToken, setAccessToken } from "../../api/clients";
import { isAdminToken } from "./jwt";
import { toast } from "react-hot-toast";
import { LogOut, ShieldCheck, ShieldX } from "lucide-react";

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
  const [state, setState] = useState<State>(emptyState);

  useEffect(() => {
    const t = getAccessToken();

    if (t && isAdminToken(t)) {
      setState((s) => ({ ...s, isAuthenticated: true }));
      return;
    }

    if (t) clearAccessToken();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await loginApi(identifier, password);

    if (!isAdminToken(res.token)) {
      clearAccessToken();
      toast.error("Access denied: Admin only", {
        icon: <ShieldX size={18} className="text-red-400" />,
      });
    }

    setAccessToken(res.token);

    setState({
      isAuthenticated: true,
      userName: res.userName ?? "",
      email: res.email ?? "",
      avatarUrl: res.avatarUrl ?? "",
    });

    toast.success(`Welcome back, ${res.userName}!`, {
      icon: <ShieldCheck size={18} className="text-indigo-400" />,
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

  const value = useMemo(() => ({ ...state, login, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
