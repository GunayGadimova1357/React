import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useIsMobile from "../hooks/useIsMobile";
import { useAuthActions } from "../hooks/useAuthActions";

import { Home, Search, Library, Calendar, LogOut, Trash2 } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  const availableLanguages = ["en", "ru", "az"];
  const toggleLanguage = () => {
    const currentIndex = availableLanguages.indexOf(i18n.language);
    const nextLang =
      availableLanguages[(currentIndex + 1) % availableLanguages.length];
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobile &&
        isOpen &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen, onClose]);

  const { handleLogout, handleDeleteAccount } = useAuthActions();

  return (
    <div
      ref={ref}
      className={`
        h-screen z-50 bg-[#181818] p-2 text-white flex flex-col transition-transform duration-300
        ${
          isMobile
            ? isOpen
              ? "fixed top-0 left-0 w-[70%] sm:w-[50%] md:w-[40%] translate-x-0"
              : "fixed top-0 left-0 w-[70%] sm:w-[50%] md:w-[40%] -translate-x-full"
            : "fixed top-0 left-0 w-[20%]"
        }
      `}
    >

      <div className="flex justify-end pr-4 mb-2">
        <button
          onClick={toggleLanguage}
          className="text-xs text-gray-400 hover:text-white border border-gray-500 px-2 py-1 rounded"
        >
          {i18n.language.toUpperCase()}
        </button>
      </div>

      <div className="h-[15%] rounded flex flex-col justify-around">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 pl-8 cursor-pointer hover:text-gray-300"
        >
          <Home size={18} />
          <p>{t("sidebar.home")}</p>
        </div>
        <div
          onClick={() => navigate("/search")}
          className="flex items-center gap-3 pl-8 cursor-pointer hover:text-gray-300"
        >
          <Search size={18} />
          <p>{t("sidebar.search")}</p>
        </div>
      </div>

      <div className="h-[70%] rounded overflow-y-auto mt-2">
        <div
          onClick={() => navigate("/tasks")}
          className="p-4 flex items-center gap-3 cursor-pointer hover:text-gray-300"
        >
          <Library size={18} />
          <p>{t("sidebar.task")}</p>
        </div>

        <div
          onClick={() => navigate("/schedule")}
          className="p-4 flex items-center gap-3 cursor-pointer hover:text-gray-300"
        >
          <Calendar size={18} />
          <p>{t("sidebar.schedule")}</p>
        </div>
      </div>

      {!isMobile && (
        <div className="mt-auto flex flex-col gap-2 mb-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-2"
          >
            <LogOut size={18} /> <span>{t("sidebar.logout")}</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-3 px-6 py-2"
          >
            <Trash2 size={18} /> <span>{t("sidebar.deleteAccount")}</span>
          </button>
        </div>
      )}

      {isMobile && (
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded"
          >
            <LogOut size={18} /> <span>{t("sidebar.logout")}</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-3 px-4 py-2 bg-red-700 rounded"
          >
            <Trash2 size={18} /> <span>{t("sidebar.deleteAccount")}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
