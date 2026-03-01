import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, ChevronRight } from 'lucide-react';
import LanguageModal from '@/components/modals/LanguageModal';

export default function SettingsSection() {
    const { t, i18n } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentLanguageName = i18n.language === 'en' ? 'English' : 'Русский';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="hidden lg:block mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                    {t("profile.preferences")}
                </h1>
                <p className="text-zinc-500 text-sm">
                    {t("settings.customize_experience")}
                </p>
            </div>
            <div className="flex flex-col">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-between py-5 border-b border-zinc-900/50 group active:opacity-60 transition-all outline-none"
                >
                    <div className="flex items-center gap-4 lg:gap-5">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-zinc-900/50 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all">
                            <Languages size={22} />
                        </div>
                        
                        <div className="text-left">
                            <h3 className="text-base lg:text-lg font-semibold text-zinc-100 leading-tight">
                                {t("settings.language")}
                            </h3>
                            <p className="text-[13px] lg:text-sm text-zinc-500 mt-0.5 lg:mt-1">
                                {t("settings.change_ui_lang")}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 lg:gap-3">
                        <span className="text-[13px] font-medium text-zinc-400 lg:bg-zinc-900 lg:px-3 lg:py-1 lg:rounded-full">
                            {currentLanguageName}
                        </span>
                        <ChevronRight className="w-5 h-5 text-zinc-800 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </button>
            </div>
            <LanguageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
}