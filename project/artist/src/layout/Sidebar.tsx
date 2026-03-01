import { NavLink } from "react-router-dom";
import { LogIn, Settings, User, LayoutDashboard, Disc, Music, BarChart3 } from "lucide-react"; 
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/useAuth";
import { useState, useEffect } from "react";

const base =
  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200";
const active = "bg-zinc-900 text-zinc-100 font-medium";
const inactive = "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50";

export function Sidebar() {
  const { t } = useTranslation();
  const { isAuthenticated, userName: authName, avatarUrl: authAvatar } = useAuth();
  
  // Локальные состояния для немедленного отображения изменений
  const [currentName, setCurrentName] = useState(authName);
  const [currentAvatar, setCurrentAvatar] = useState(authAvatar);
  const [imgError, setImgError] = useState(false);

  // Синхронизация с глобальным событием (если профиль обновился в другом компоненте)
  useEffect(() => {
    setCurrentName(authName);
    setCurrentAvatar(authAvatar);
  }, [authName, authAvatar]);

  useEffect(() => {
    const handleProfileUpdate = (e: any) => {
      if (e.detail.artistName) setCurrentName(e.detail.artistName);
      if (e.detail.photoUrl) {
        setCurrentAvatar(e.detail.photoUrl);
        setImgError(false);
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-zinc-900 p-5 bg-zinc-950">
      {isAuthenticated ? (
        <NavLink
          to="/profile"
          className="mb-8 flex items-center gap-3 rounded-2xl p-2 transition-all hover:bg-zinc-900 group"
        >
          <div className="h-10 w-10 overflow-hidden rounded-full bg-zinc-900 ring-2 ring-transparent group-hover:ring-zinc-800 transition-all flex-shrink-0 flex items-center justify-center">
            {currentAvatar && !imgError ? (
              <img
                src={currentAvatar}
                alt={currentName || ""}
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600">
                <User size={20} />
              </div>
            )}
          </div>

          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-zinc-100 truncate">
              {currentName || t("sidebar.artist")}
            </span>
            <span className="text-[11px] font-medium text-zinc-500">
              {t("sidebar.view_profile")}
            </span>
          </div>
        </NavLink>
      ) : (
        <NavLink to="/login" className="mb-8 flex items-center gap-3 rounded-2xl p-2 transition-all hover:bg-zinc-900 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 group-hover:text-zinc-200 transition-colors">
            <LogIn size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-100">{t("sidebar.login")}</span>
            <span className="text-[11px] text-zinc-500">{t("sidebar.login_prompt")}</span>
          </div>
        </NavLink>
      )}

      <nav className="flex flex-1 flex-col space-y-1">
        <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
          <LayoutDashboard size={18} />
          {t("sidebar.dashboard")}
        </NavLink>

        <NavLink to="/releases" className={({ isActive }) => `${base} ${isAuthenticated ? (isActive ? active : inactive) : 'opacity-50 cursor-not-allowed'}`}>
          <Disc size={18} />
          {t("sidebar.releases")}
        </NavLink>

        <NavLink to="/tracks" className={({ isActive }) => `${base} ${isAuthenticated ? (isActive ? active : inactive) : 'opacity-50 cursor-not-allowed'}`}>
          <Music size={18} />
          {t("sidebar.tracks")}
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `${base} ${isAuthenticated ? (isActive ? active : inactive) : 'opacity-50 cursor-not-allowed'}`}>
          <BarChart3 size={18} />
          {t("sidebar.analytics")}
        </NavLink>

        <div className="mt-auto pt-4 border-t border-zinc-900">
          <NavLink to="/settings" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
            <Settings size={18} />
            <span>{t("sidebar.settings")}</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}