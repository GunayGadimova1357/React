import React, { useState, useEffect } from "react";
import { Trash2, AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import { AccountService } from "@/api/userApi";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { SettingsSection } from "../SettingsComponents";
import toast from "react-hot-toast";
import OtpVerifyModal from "@/components/modals/OtpVerifyModal";
import { recentHistory } from "@/utils/recentHistory";

export default function AccountSection() {
  const { t } = useTranslation();
  const { logout, userEmail } = useAuth();
  
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);

  useEffect(() => {
    AccountService.hasPassword()
      .then(res => setHasPassword(res.hasPassword))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestOtp = async () => {
    try {
      setIsRequestingOtp(true);
      await AccountService.requestDeleteAccountOtp();
      toast.success(t("security.otp_sent"));
      setIsModalOpen(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("common.errors.action_failed"));
    } finally {
      setIsRequestingOtp(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20 bg-[#121212]">
      <Loader2 className="animate-spin text-zinc-700" size={24} />
    </div>
  );

  return (
    <div className="max-w-md mx-auto space-y-10 animate-in fade-in duration-500 pb-20 px-4">
      <SettingsSection 
        title={t("account.danger_zone_title")} 
        description={t("account.danger_zone_desc")}
      >
        <div className="space-y-6">
          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg flex gap-4">
            <AlertTriangle className="text-red-500 shrink-0" size={20} />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-red-500">{t("account.delete_warning_title")}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{t("account.delete_warning_text")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-white/5 rounded-lg">
            <ShieldAlert className="text-zinc-600 shrink-0" size={16} />
            <p className="text-xs text-zinc-500">
              {hasPassword ? t("account.otp_delete_note") : t("account.google_delete_note")}
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={handleRequestOtp}
              disabled={isRequestingOtp}
              className="group flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-lg font-semibold text-sm transition-all bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white disabled:opacity-20"
            >
              {isRequestingOtp ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  <Trash2 size={18} className="transition-transform group-hover:scale-110" />
                  {t("account.delete_btn")}
                </>
              )}
            </button>
          </div>
        </div>
      </SettingsSection>

      {isModalOpen && (
        <OtpVerifyModal 
          email={userEmail || ""}
          title={t("account.delete_modal_title")}
          description={t("account.delete_confirm_msg")}
          variant="danger"
          onClose={() => setIsModalOpen(false)}
          onVerify={(code) => AccountService.confirmDeleteAccount(code)}
          onSuccess={() => {
            toast.success(t("account.delete_success"));
            recentHistory.clearAll();
            logout();
          }}
        />
      )}
    </div>
  );
}
