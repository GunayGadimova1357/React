import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, UserCircle, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAuthActions } from "../hooks/useAuthActions";
import useIsMobile from "../hooks/useIsMobile";

const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, loading } = useAuth();

  const availableLanguages = ["en", "ru", "az"];
  const toggleLanguage = () => {
    const currentIndex = availableLanguages.indexOf(i18n.language);
    const nextLang =
      availableLanguages[(currentIndex + 1) % availableLanguages.length];
    i18n.changeLanguage(nextLang);
  };

  const { handleLogout, handleDeleteAccount } = useAuthActions();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  if (loading) return null;



  return (
    <>
      <div className="h-14 flex items-center justify-between px-6 fixed top-0 right-0 ml-[20%] z-40">
        {!isMobile && (
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <div className="flex items-center gap-4 mr-6">
                <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-1.5 rounded-full border border-gray-400 text-sm font-medium text-white"
                >
                    {t("navbar.login")}
                </button>
                <button
                    onClick={() => navigate("/signup")}
                    className="px-4 py-1.5 rounded-full bg-white text-sm font-medium text-black"
                >
                    {t("navbar.signup")}
                </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/profile")}
                className="hover:text-[#a52a2a] transition"
                title={user.email || "Account"}
              >
                <UserCircle className="w-7 h-7" />
              </button>
            )}
          </div>
        )}
        {isMobile && (
          <button onClick={() => setIsMenuOpen(true)} className="cursor-pointer">
            <Menu className="w-6 h-6" />
          </button>
        )}
      </div>
      {isMobile && (
        <div
          ref={menuRef}
          className={`fixed top-0 right-0 h-full w-64 bg-[#353535] text-white z-50 transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col px-6 gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-white text-left"
                >
                  {t("navbar.login")}
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-white text-left"
                >
                  {t("navbar.signup")}
                </button>
              </>
            ) : (
                <>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 text-white text-left"
                title={user.email || "Account"}
              >
                <UserCircle className="w-5 h-5" />
              </button>
              <button 
               onClick={handleLogout}
               className="flex items-center gap-2 text-left text-gray-300">
                <LogOut size={18}/>
                {t("sidebar.logout")}
              </button>
              <button 
               onClick={handleDeleteAccount}
               className="flex items-center gap-2 text-left text-gray-300">
                <Trash2 size={18}/>
                {t("sidebar.deleteAccount")}
              </button>
              </>
            )}<hr className="my-4 border-gray-600" />

            <button
              className="text-xs text-gray-400 hover:text-white border border-gray-500 px-2 py-1 rounded"
              onClick={toggleLanguage}
            >
              {i18n.language.toUpperCase()}
            </button>
            
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;