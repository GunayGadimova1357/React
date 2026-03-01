import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Languages, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LanguageModal from "../modals/LanguageModal";

export default function GeneralSettings() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentLanguageName = i18n.language === "en" ? "English" : "Русский";

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8 animate-in fade-in duration-500">
        <header className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl sm:text4xl font-bold">
            {t("settings.general") || "Общие настройки"}
          </h1>
        </header>

        <section className="bg-[#181818] rounded-2xl border border-white/5 overflow-hidden shadow-xl transition-transform active:scale-[0.99]">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-300">
                <Languages className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold">{t("settings.language")}</h3>
                <p className="text-sm text-gray-400">
                  {t("settings.change_ui_lang")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-white font-medium">
                {currentLanguageName}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </div>
          </button>
        </section>
      </div>

      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
