import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
  Settings,
  ArrowLeft,
} from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import { useAuth } from "@/hooks/useAuth";
import { authApi as api } from "@/api/clients";

const API_URL = import.meta.env.VITE_AUTH_API_URL?.replace("/api", "") || "";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const { userName, userPicture, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fullAvatarUrl = userPicture
    ? userPicture.startsWith("http")
      ? userPicture
      : `${API_URL}${userPicture}`
    : null;

  useEffect(() => {
    let cancelled = false;
    if (userName) {
      api.get("/Account/me").catch(() => {
        if (!cancelled) logout();
      });
    }
    return () => {
      cancelled = true;
    };
  }, [logout, userName]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        isUserDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen, isUserDropdownOpen]);

  return (
    <nav className="w-full flex flex-col gap-4 px-6 py-4 transition-all duration-300 ease-out sticky top-0 z-[100]">
      <div className="w-full flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate(-1)}
            className="w-8 h-8 bg-black/40 flex items-center justify-center rounded-full cursor-pointer hover:bg-black/60 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {userName ? (
            <>
              {isMobile ? (
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="active:scale-90 border-2 border-white/10 rounded-full transition-transform overflow-hidden"
                >
                  {fullAvatarUrl ? (
                    <img
                      src={fullAvatarUrl}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-zinc-800 flex items-center justify-center rounded-full text-zinc-400">
                      <User size={20} />
                    </div>
                  )}
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 bg-black/50 py-1 pl-1 pr-3 rounded-full hover:bg-black/70 transition-all border border-white/5"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-800">
                      {fullAvatarUrl ? (
                        <img
                          src={fullAvatarUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User
                          size={14}
                          className="m-auto mt-1.5 text-zinc-500"
                        />
                      )}
                    </div>
                    <span className="text-white text-sm font-bold truncate max-w-[120px]">
                      {userName}
                    </span>
                    {isUserDropdownOpen ? (
                      <ChevronUp className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white" />
                    )}
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-md shadow-2xl z-[100] border border-white/5 p-1 animate-in fade-in zoom-in-95 duration-150">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setIsUserDropdownOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded"
                      >
                        <span>{t("navbar.profile")}</span>
                        <User className="w-4 h-4" />
                      </button>

                      <div className="h-[1px] bg-white/5 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded"
                      >
                        <span>{t("navbar.logout")}</span>
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-4">
              {!isMobile && (
                <button
                  onClick={() => navigate("/signup")}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-bold px-3"
                >
                  {t("navbar.signup")}
                </button>
              )}
              <button
                onClick={() =>
                  isMobile ? setIsMenuOpen(true) : navigate("/login")
                }
                className={`font-bold rounded-full transition-all ${
                  isMobile
                    ? "p-2 bg-black/20 text-white"
                    : "bg-white text-black text-sm px-7 py-2.5 hover:scale-105"
                }`}
              >
                {isMobile ? <Menu className="w-6 h-6" /> : t("navbar.login")}
              </button>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <>
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            ref={menuRef}
            className={`fixed top-0 right-0 h-full w-[280px] bg-[#121212] z-[1200] shadow-2xl transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex justify-between items-center p-5 border-b border-white/5">
              <span className="font-bold text-lg text-white">
                {t("profile.title")}
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col p-4 gap-2">
              {userName ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-4 text-white border border-white/10">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800">
                      {fullAvatarUrl ? (
                        <img
                          src={fullAvatarUrl}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <User className="m-auto mt-2 text-zinc-600" />
                      )}
                    </div>
                    <span className="font-bold truncate">{userName}</span>
                  </div>
                  <MobileMenuItem
                    icon={<User className="w-5 h-5" />}
                    label={t("navbar.profile")}
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                  />
                  <MobileMenuItem
                    icon={<Settings className="w-5 h-5" />}
                    label={t("profile.settings")}
                    onClick={() => {
                      navigate("/settings");
                      setIsMenuOpen(false);
                    }}
                  />
                  <MobileMenuItem
                    icon={<LogOut className="w-5 h-5 text-red-400" />}
                    label={t("navbar.logout")}
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    color="text-red-400"
                  />
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <MobileMenuItem
                    label={t("navbar.login")}
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                  />
                  <MobileMenuItem
                    label={t("navbar.signup")}
                    onClick={() => {
                      navigate("/signup");
                      setIsMenuOpen(false);
                    }}
                  />

                  <div className="h-[1px] bg-white/5 my-2" />
                  <MobileMenuItem
                    icon={<Settings className="w-5 h-5" />}
                    label={t("profile.settings")}
                    onClick={() => {
                      navigate("/settings");
                      setIsMenuOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

const MobileMenuItem = ({
  icon,
  label,
  onClick,
  color = "text-white",
}: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-4 hover:bg-white/5 rounded-xl transition-colors active:bg-white/10 ${color}`}
  >
    {icon}
    <span className="font-bold text-sm">{label}</span>
  </button>
);

export default Navbar;
