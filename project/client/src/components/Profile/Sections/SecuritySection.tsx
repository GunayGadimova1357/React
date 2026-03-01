import React, { useEffect, useState } from "react";
import { Lock, Mail, Loader2, ShieldCheck, ShieldAlert, KeyRound } from "lucide-react";
import { AccountService } from "@/api/userApi";
import { useTranslation } from "react-i18next";
import { DarkInput, SettingsSection } from "../SettingsComponents";
import OtpVerifyModal from "../../modals/OtpVerifyModal";
import toast from "react-hot-toast";

export default function SecuritySection() {
  const { t } = useTranslation();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [newEmail, setNewEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOtpModal, setShowOtpModal] = useState(false);

  useEffect(() => {
    checkPasswordStatus();
  }, []);

  const checkPasswordStatus = async () => {
    try {
      const res = await AccountService.hasPassword();
      setHasPassword(res.hasPassword);
    } catch (e) {
      console.error("Failed to check password status");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error(t("security.pass_mismatch"));
    }
    
    if (newPassword.length < 6) {
      return toast.error(t("security.pass_too_short"));
    }

    try {
      setIsSaving(true);
      
      await AccountService.changePassword({ 
        currentPassword: hasPassword ? currentPassword : "", 
        newPassword: newPassword, 
        confirmNewPassword: confirmPassword 
      });

      toast.success(hasPassword ? t("security.pass_success") : t("security.set_password_success"));
      
      setCurrentPassword(""); 
      setNewPassword(""); 
      setConfirmPassword("");
      
      await checkPasswordStatus(); 
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || e.response?.data || t("security.pass_error");
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailChangeRequest = async () => {
    if (!newEmail.includes("@")) return toast.error(t("security.invalid_email"));
    
    try {
      setIsSaving(true);
      await AccountService.requestEmailChangeOtp(newEmail);
      setTempEmail(newEmail);
      setShowOtpModal(true);
      toast.success(t("security.otp_sent"));
    } catch (e: any) {
      toast.error(e.response?.data || t("security.email_error"));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20 bg-[#121212]">
      <Loader2 className="animate-spin text-zinc-100/20" size={24} />
    </div>
  );

  return (
    <div className="max-w-md mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <SettingsSection 
        title={t("security.password_title")} 
        description={hasPassword ? t("security.password_desc") : t("security.set_password_desc")}
      >
        {!hasPassword && (
          <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl mb-6">
            <ShieldAlert className="text-amber-500 shrink-0" size={18} />
            <p className="text-xs text-amber-200/70 leading-relaxed font-medium">
              {t("security.no_password_warning")}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {hasPassword && (
            <DarkInput 
              label={t("security.current_password")}
              type="password"
              value={currentPassword}
              onChange={(e: any) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DarkInput 
              label={t("security.new_password")}
              type="password"
              value={newPassword}
              onChange={(e: any) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
            <DarkInput 
              label={t("security.confirm_password")}
              type="password"
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            onClick={handlePasswordChange}
            disabled={isSaving || !newPassword || !confirmPassword || (hasPassword && !currentPassword)}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-zinc-100 text-zinc-950 font-semibold text-sm rounded-lg hover:bg-white active:scale-[0.98] transition-all disabled:opacity-20"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
            {hasPassword ? t("security.update_password_btn") : t("security.set_password_btn")}
          </button>
        </div>
      </SettingsSection>

      <SettingsSection 
        title={t("security.email_title")} 
        description={t("security.email_desc")}
      >
        <div className="space-y-6">
          <DarkInput 
            label={t("security.new_email_label")}
            type="email"
            value={newEmail}
            onChange={(e: any) => setNewEmail(e.target.value)}
            placeholder="new-email@mail.com"
          />
          
          <button 
            onClick={handleEmailChangeRequest}
            disabled={isSaving || !newEmail}
            className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 border border-zinc-800 text-white font-semibold text-sm rounded-lg hover:bg-zinc-900 active:scale-[0.98] transition-all disabled:opacity-10"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
            {t("security.request_change_btn")}
          </button>
        </div>
      </SettingsSection>

      {showOtpModal && (
        <OtpVerifyModal 
          email={tempEmail}
          onClose={() => setShowOtpModal(false)}
          onSuccess={() => {
            setShowOtpModal(false);
            setNewEmail("");
          } } onVerify={function (code: string): Promise<any> {
            throw new Error("Function not implemented.");
          } }        />
      )}
    </div>
  );
}