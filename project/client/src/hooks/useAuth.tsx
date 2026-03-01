import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authApi as api } from "@/api/clients";
import {
  setAccessToken,
  clearAccessToken,
  getAccessToken,
} from "@/services/TokenStore";

interface AuthContextType {
  userName: string | null;
  userEmail: string | null;
  userPicture: string | null;
  isEmailVerified: boolean;
  passwordSet: boolean;

  loading: boolean;

  login: (
    accessToken: string,
    name: string,
    email: string,
    picture?: string,
  ) => Promise<void>;
  logout: () => void;
  setEmailVerified: (verified: boolean) => void;
  updateUserPicture: (picture: string) => void;
  setPasswordSet: (isSet: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("userName"),
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    localStorage.getItem("userEmail"),
  );
  const [userPicture, setUserPicture] = useState<string | null>(
    localStorage.getItem("userPicture"),
  );
  const [isEmailVerified, setIsEmailVerified] = useState(
    localStorage.getItem("isEmailVerified") === "true",
  );
  const [passwordSet, setPasswordSetState] = useState(
    localStorage.getItem("passwordSet") === "true",
  );

  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await api.post("/Auth/logout", {});
    } catch {
      /* ignore */
    }

    setUserName(null);
    setUserEmail(null);
    setUserPicture(null);
    setIsEmailVerified(false);
    setPasswordSetState(false);

    [
      "userName",
      "userEmail",
      "userPicture",
      "isEmailVerified",
      "passwordSet",
    ].forEach((k) => localStorage.removeItem(k));
    clearAccessToken();

    window.dispatchEvent(new CustomEvent("userLogout"));
    navigate("/");
  };

  const login = async (
    token: string,
    name: string,
    email: string,
    picture?: string,
  ) => {
    setAccessToken(token);

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    setUserName(name);
    setUserEmail(email);

    if (picture) {
      localStorage.setItem("userPicture", picture);
      setUserPicture(picture);
    }

    try {
      const passRes = await api.get("/Account/HasPassword");
      const hasPassword =
        !!passRes.data?.hasPassword ?? !!passRes.data?.data?.hasPassword;
      setPasswordSetState(hasPassword);
      localStorage.setItem("passwordSet", String(hasPassword));
    } catch {
      /* empty */
    }

    try {
      const verifyRes = await api.get("/Account/VerificationStatus");
      const verified =
        !!verifyRes.data?.isEmailVerified ??
        !!verifyRes.data?.data?.isEmailVerified;
      setIsEmailVerified(verified);
      localStorage.setItem("isEmailVerified", String(verified));
      if (!verified) navigate("/verify-email");
    } catch {
      /* empty */
    }

    window.dispatchEvent(
      new CustomEvent("userLogin", {
        detail: { userName: name, userEmail: email, userPicture: picture },
      }),
    );
  };

  const setEmailVerified = (verified: boolean) => {
    setIsEmailVerified(verified);
    localStorage.setItem("isEmailVerified", String(verified));
  };

  const updateUserPicture = (picture: string) => {
    setUserPicture(picture);
    localStorage.setItem("userPicture", picture);
    window.dispatchEvent(
      new CustomEvent("userPictureUpdate", {
        detail: { userPicture: picture },
      }),
    );
  };

  const setPasswordSet = (isSet: boolean) => {
    setPasswordSetState(isSet);
    localStorage.setItem("passwordSet", String(isSet));
  };

  useEffect(() => {
    const handleLogin = (e: Event) => {
      const detail = (
        e as CustomEvent<{
          userName: string;
          userEmail: string;
          userPicture?: string;
        }>
      ).detail;
      if (!detail) return;

      setUserName(detail.userName);
      setUserEmail(detail.userEmail);

      if (detail.userPicture) setUserPicture(detail.userPicture);
    };

    const handleLogout = () => {
      setUserName(null);
      setUserEmail(null);
      setUserPicture(null);
      setIsEmailVerified(false);
      setPasswordSetState(false);
    };

    const handlePictureUpdate = (e: Event) => {
      const detail = (e as CustomEvent<{ userPicture: string }>).detail;
      if (detail) setUserPicture(detail.userPicture);
    };

    window.addEventListener("userLogin", handleLogin as EventListener);
    window.addEventListener("userLogout", handleLogout);
    window.addEventListener(
      "userPictureUpdate",
      handlePictureUpdate as EventListener,
    );

    return () => {
      window.removeEventListener("userLogin", handleLogin as EventListener);
      window.removeEventListener("userLogout", handleLogout);
      window.removeEventListener(
        "userPictureUpdate",
        handlePictureUpdate as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      let cancelled = false;
      setLoading(true);
      api
        .get("/Account/me")
        .then((res) => {
          if (cancelled) return;
          const data = res.data.data || res.data;
          const name = data.userName || data.name;
          const email = data.email;
          const picture = data.avatarUrl || data.picture;

          if (name) {
            setUserName(name);
            localStorage.setItem("userName", name);
          }
          if (email) {
            setUserEmail(email);
            localStorage.setItem("userEmail", email);
          }
          if (picture) {
            setUserPicture(picture);
            localStorage.setItem("userPicture", picture);
          }

          // Optionally update verification status
          if (data.isEmailVerified !== undefined) {
            setIsEmailVerified(data.isEmailVerified);
            localStorage.setItem("isEmailVerified", String(data.isEmailVerified));
          }
          if (data.hasPassword !== undefined) {
            setPasswordSetState(data.hasPassword);
            localStorage.setItem("passwordSet", String(data.hasPassword));
          }
        })
        .catch(() => {
          if (!cancelled) logout();
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });

      return () => {
        cancelled = true;
      };
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userName,
        userEmail,
        userPicture,
        isEmailVerified,
        passwordSet,
        login,
        logout,
        setEmailVerified,
        updateUserPicture,
        setPasswordSet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
