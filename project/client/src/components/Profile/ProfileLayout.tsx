import React, { useEffect } from "react";
import {
  Outlet,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  User,
  ChevronRight,
  Lock,
  Music,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import BottomNavigation from "@/components/BottomNavigation";
import logo from "@/assets/logo.png";

const API_URL = "http://localhost:5017";

const base =
  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200";
const active = "bg-zinc-900 text-zinc-100 font-medium";
const inactive = "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50";

const ProfileLayout = () => {
  const { t } = useTranslation();
  const { logout, userName, userPicture } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRootProfile =
    location.pathname === "/profile" || location.pathname === "/profile/";

  const fullAvatarUrl = userPicture
    ? userPicture.startsWith("http")
      ? userPicture
      : `${API_URL}${userPicture}`
    : null;

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop && isRootProfile) {
        navigate("/profile/identity", { replace: true });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isRootProfile, navigate]);

  const menuItems = [
    {
      id: "general",
      path: "/profile/identity",
      icon: <User size={20} />,
      label: t("profile.personal_info"),
    },
    {
      id: "security",
      path: "/profile/security",
      icon: <Shield size={20} />,
      label: t("profile.security"),
    },
    {
      id: "account",
      path: "/profile/account",
      icon: <Lock size={20} />,
      label: t("profile.account_management"),
    },
    {
      id: "apply-artist",
      path: "/profile/apply",
      icon: <Music size={20} />,
      label: t("profile.apply_artist"),
    },
    {
      id: "preferences",
      path: "/profile/settings",
      icon: <Settings size={20} />,
      label: t("profile.preferences"),
    },
  ];

  return (
    <div className="flex h-screen bg-[#121212] text-zinc-100 overflow-hidden font-sans">
      <aside className="hidden lg:flex flex-col w-64 bg-[#121212] border-r border-zinc-900 p-5">
        <Link
          to="/"
          className="mb-10 px-2 flex items-center gap-3 group transition-all"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-white/5 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center transition-all duration-300 group-hover:border-zinc-500 group-hover:scale-105 shadow-2xl">
              <img
                src={logo}
                alt="Logo"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <span className="text-[17px] font-bold text-zinc-100 group-hover:text-white transition-colors leading-none">
            eclipse
          </span>
        </Link>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `${base} ${isActive ? active : inactive}`
              }
            >
              <span className="opacity-70">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-zinc-900 pt-5">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-red-400 transition-colors w-full group"
          >
            <LogOut
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="font-medium text-sm">{t("common.sign_out")}</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#121212]">
        {!isRootProfile && (
          <header className="lg:hidden relative flex items-center h-16 bg-[#121212] border-b border-zinc-900 sticky top-0 z-50 px-4">
            <button
              onClick={() => navigate("/profile")}
              className="relative z-10 p-2 text-zinc-100 -ml-2 active:scale-90 transition-transform"
            >
              <ChevronLeft size={28} />
            </button>
            <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold pointer-events-none text-zinc-100">
              {menuItems.find((item) => location.pathname.includes(item.path))
                ?.label || t("profile.title")}
            </span>
          </header>
        )}

        <main className="flex-1 overflow-y-auto bg-[#121212] pb-32 lg:pb-16">
          <div className="max-w-4xl mx-auto px-6 py-10 md:p-12 lg:p-16">
            <div className="lg:hidden">
              {isRootProfile ? (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <Link
                    to="/profile/identity"
                    className="flex flex-col items-center text-center space-y-4 group active:opacity-70 transition-opacity"
                  >
                    <div className="h-24 w-24 rounded-full bg-zinc-900 border-2 border-zinc-800 overflow-hidden shadow-2xl transition-transform group-active:scale-95">
                      {fullAvatarUrl ? (
                        <img
                          src={fullAvatarUrl}
                          className="h-full w-full object-cover"
                          alt="Avatar"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-700">
                          <User size={48} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-zinc-100">
                        {userName || "User"}
                      </h2>
                      <div className="flex items-center justify-center gap-1 text-zinc-500 text-xs font-medium">
                        <span>{t("sidebar.profile_settings")}</span>
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  </Link>

                  <nav className="divide-y divide-zinc-900/50">
                    {menuItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        className="flex items-center justify-between py-5 active:opacity-50 transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div className="text-zinc-500">{item.icon}</div>
                          <span className="text-lg font-medium text-zinc-200">
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight size={20} className="text-zinc-800" />
                      </Link>
                    ))}
                  </nav>

                  <div className="pt-8 flex justify-center">
                    <button
                      onClick={logout}
                      className="flex items-center justify-center gap-3 py-3 px-8 bg-zinc-100 text-zinc-950 rounded-full font-bold text-sm shadow-xl active:scale-[0.95] transition-all"
                    >
                      {t("common.sign_out")}
                    </button>
                  </div>
                </div>
              ) : (
                <Outlet />
              )}
            </div>
            <div className="hidden lg:block">
              <Outlet />
            </div>
          </div>
        </main>

        <BottomNavigation />
      </div>
    </div>
  );
};

export default ProfileLayout;
