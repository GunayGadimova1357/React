import { Home, Search, Library } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const items = [
    { path: "/", icon: <Home size={22} />, label: t("sidebar.home") },
    { path: "/search", icon: <Search size={22} />, label: t("sidebar.search") },
    { path: "/tasks", icon: <Library size={22} />, label: t("sidebar.task") },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-[#121212] text-white flex justify-around items-center z-50 lg:hidden">
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center text-xs ${
            location.pathname === item.path ? "text-white" : "text-gray-400"
          }`}
        >
          {item.icon}
          <span className="text-[11px] mt-0.5">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;