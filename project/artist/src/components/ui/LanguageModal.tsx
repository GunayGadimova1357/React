import { useTranslation } from "react-i18next";
import { X, Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageModal = ({ isOpen, onClose }: Props) => {
  const { t, i18n } = useTranslation();

  if (!isOpen) return null;

  const languages = [
    { code: "en", label: "English" },
    { code: "ru", label: "Русский" },
  ];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-[320px] rounded-[32px] border border-zinc-900 bg-zinc-950 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900/50">
          <h2 className="text-sm font-semibold text-zinc-400">
            {t("settings.select_lang")}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-zinc-600 hover:text-zinc-200 transition-colors rounded-full hover:bg-zinc-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-3 space-y-1">
          {languages.map((lang) => {
            const isActive = i18n.language.startsWith(lang.code);
            
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300"
                }`}
              >
                <span className={`text-base font-medium ${isActive ? "text-zinc-100" : ""}`}>
                  {lang.label}
                </span>
                
                <div className={`transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
                  <div className="bg-white rounded-full p-0.5">
                    <Check size={12} className="text-black" strokeWidth={4} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;