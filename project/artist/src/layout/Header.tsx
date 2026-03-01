import { useAuth } from "@/features/auth/useAuth";
import { toast } from "react-hot-toast";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Header() {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {

    toast.success(t("header.logout_success"), {
      style: {
        borderRadius: '12px',
        background: '#18181b', 
        color: '#f4f4f5',      
        border: '1px solid #27272a', 
      },
      iconTheme: {
        primary: '#71717a', 
        secondary: '#18181b',
      },
    });
    
    logout();
  };

  if (!isAuthenticated) return <header className="h-16 border-b border-zinc-900" />;

  return (
    <header className="flex h-16 items-center justify-end border-b border-zinc-900 px-6 bg-zinc-950/50 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          <span>{t("header.logout")}</span>
        </button>
      </div>
    </header>
  );
}