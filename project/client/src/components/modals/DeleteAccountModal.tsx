import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Loader2, Trash2, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DarkInput } from "@/components/Profile/SettingsComponents";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (code: string) => void; 
  isLoading: boolean;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm, isLoading }: DeleteModalProps) {
  const { t } = useTranslation();
  const [otpCode, setOtpCode] = useState("");

  useEffect(() => {
    if (!isOpen) setOtpCode("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (otpCode.length > 0) {
      onConfirm(otpCode);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={!isLoading ? onClose : undefined} 
      />

      <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-900 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose} 
          disabled={isLoading}
          className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors disabled:opacity-0"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="p-4 bg-red-500/10 rounded-full text-red-500 mb-6">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-2 mb-6">
            <h2 className="text-xl font-semibold text-white">
              {t("account.delete_modal_title")}
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed px-2">
              {t("account.delete_confirm_msg")}
            </p>
          </div>

          <div className="w-full mb-8">
            <DarkInput
              label={t("security.otp_label")}
              type="text"
              value={otpCode}
              onChange={(e: any) => setOtpCode(e.target.value)}
              placeholder="000000"
              className="text-center font-bold text-lg"
              maxLength={6}
            />
          </div>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={handleConfirm}
              disabled={isLoading || otpCode.length < 3}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Trash2 size={18} />
                  {t("account.delete_confirm_btn")}
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-3.5 text-zinc-400 font-semibold text-sm rounded-lg hover:text-white hover:bg-white/5 transition-all disabled:opacity-0"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}