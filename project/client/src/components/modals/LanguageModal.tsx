import React from "react";
import { useTranslation } from "react-i18next";
import { X, Check } from "lucide-react";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  const languages = [
    { code: "ru", name: "Русский", nativeName: "Русский" },
    { code: "en", name: "English", nativeName: "English" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-[#181818] rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="font-bold text-lg">{t("settings.choose_lang")}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/5 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
                onClose();
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl transition-colors"
            >
              <div className="flex flex-col items-start">
                <span
                  className={`font-semibold ${i18n.language === lang.code ? "text-white" : "text-gray"}`}
                >
                  {lang.name}
                </span>
                <span className="text-xs text-gray-400">{lang.nativeName}</span>
              </div>
              {i18n.language === lang.code && (
                <Check className="w-5 h-5 text-white" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;
