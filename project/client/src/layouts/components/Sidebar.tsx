import React, { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useIsMobile from "../../hooks/useIsMobile";
import { Settings, Home, Search, Library, X, Menu } from "lucide-react";
import logo from "@/assets/logo.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onToggle }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isOpen, onClose]);

  const navItemClass = `
    flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all duration-300 
    text-gray-400 hover:text-white hover:bg-white/10 group w-full
  `;

  const navItemClassMini = `
    flex items-center justify-center p-3 rounded-xl transition-all duration-300 
    text-gray-400 hover:text-white hover:bg-white/10 group relative
  `;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        ref={ref}
        onMouseEnter={() => !isMobile && !isOpen && setIsHovered(true)}
        onMouseLeave={() => !isMobile && !isOpen && setIsHovered(false)}
        className={`
          h-full z-50 bg-black text-white flex flex-col gap-3 transition-all duration-300
          ${
            isMobile
              ? `fixed top-0 left-0 w-[75%] sm:w-[50%] p-3 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
              : `relative ${isOpen ? "w-[250px] lg:w-[280px] p-3" : "w-[72px] p-2"} ${isOpen ? "translate-x-0" : "translate-x-0"} overflow-hidden`
          }
        `}
      >
        <div className="bg-[#121212] flex-1 rounded-2xl overflow-hidden flex flex-col shadow-xl relative">
          <div
            className={`${isOpen ? "px-6 py-6" : "px-2 py-4"} flex items-center ${isOpen ? "justify-between" : "justify-center"} transition-all duration-300`}
          >
            {isOpen ? (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-3 group transition-all flex-1 min-w-0"
                >
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center transition-all duration-300 group-hover:border-zinc-500 group-hover:scale-105 shadow-2xl flex-shrink-0">
                    <img
                      src={logo}
                      alt="Logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[17px] font-bold text-zinc-100 group-hover:text-white transition-colors leading-none truncate">
                      eclipse
                    </span>
                  </div>
                </Link>
                {!isMobile && onToggle && (
                  <button
                    onClick={onToggle}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white flex-shrink-0"
                    title="Закрыть sidebar"
                  >
                    <X size={18} />
                  </button>
                )}
              </>
            ) : (
              <>
                {!isMobile && (
                  <div className="relative w-full flex items-center justify-center">
                    {isHovered && onToggle ? (
                      <button
                        onClick={onToggle}
                        className="flex items-center justify-center transition-all relative cursor-pointer"
                      >
                        <div className="relative h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-2xl">
                          <Menu className="w-5 h-5 text-white" />
                        </div>
                      </button>
                    ) : (
                      <Link
                        to="/"
                        className="flex items-center justify-center group transition-all relative"
                      >
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-2xl">
                          <img
                            src={logo}
                            alt="Logo"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-zinc-700">
                          eclipse
                        </div>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          <div className={`${isOpen ? "p-2" : "p-1"} flex flex-col gap-1`}>
            {/* <button
            onClick={() => { navigate('/'); if(isMobile) onClose(); }}
            className={isOpen ? navItemClass : navItemClassMini}
          >
            <Home className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            {isOpen && <p className="font-bold text-sm">{t('sidebar.home')}</p>}
            {!isOpen && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-zinc-700">
                {t('sidebar.home')}
              </div>
            )}
          </button> */}

            <button
              onClick={() => {
                navigate("/search");
                if (isMobile) onClose();
              }}
              className={isOpen ? navItemClass : navItemClassMini}
              title={!isOpen && !isMobile ? t("sidebar.search") : undefined}
            >
              <Search className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {isOpen && (
                <p className="font-bold text-sm">{t("sidebar.search")}</p>
              )}
              {!isOpen && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-zinc-700">
                  {t("sidebar.search")}
                </div>
              )}
            </button>

            <button
              onClick={() => {
                navigate("/library");
                if (isMobile) onClose();
              }}
              className={isOpen ? navItemClass : navItemClassMini}
              title={!isOpen && !isMobile ? t("sidebar.library") : undefined}
            >
              <Library className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {isOpen && (
                <p className="font-bold text-sm">{t("sidebar.library")}</p>
              )}
              {!isOpen && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-zinc-700">
                  {t("sidebar.library")}
                </div>
              )}
            </button>
          </div>


          <div
            className={`${isOpen ? "mx-6" : "mx-2"} border-t border-white/5 my-2`}
          ></div>

          <div
            className={`${isOpen ? "p-4" : "p-1"} mt-auto border-t border-white/5`}
          >
            <button
              onClick={() => {
                navigate("/settings");
                if (isMobile) onClose();
              }}
              className={isOpen ? navItemClass : navItemClassMini}
              title={
                !isOpen && !isMobile
                  ? t("profile.settings") || "Settings"
                  : undefined
              }
            >
              <Settings className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
              {isOpen && (
                <p className="font-bold text-sm">
                  {t("profile.settings") || "Settings"}
                </p>
              )}
              {!isOpen && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-zinc-700">
                  {t("profile.settings") || "Settings"}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
