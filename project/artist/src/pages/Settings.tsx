import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronRight } from "lucide-react";
import LanguageModal from "@/components/ui/LanguageModal";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentLanguageName = i18n.language === "ru" ? "Русский" : "English";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">
          {t("settings.title")}
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {t("settings.subtitle")}
        </p>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="rounded-3xl border border-zinc-900 bg-zinc-950/50 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-zinc-900/50 bg-zinc-900/10">
            <h2 className="text-sm font-semibold text-zinc-400">
              {t("settings.appearance")}
            </h2>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full p-6 flex items-center justify-between hover:bg-zinc-900/40 transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-zinc-200 group-hover:border-zinc-700 transition-all">
                <Globe size={22} />
              </div>
              <div className="text-left">
                <p className="text-base font-medium text-zinc-200">{t("settings.language")}</p>
                <p className="text-sm text-zinc-500 mt-0.5">{t("settings.change_ui_lang")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 transition-colors group-hover:border-zinc-700">
              <span className="text-xs font-medium text-zinc-300">
                {currentLanguageName}
              </span>
              <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-300 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </div>

      <LanguageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Settings;