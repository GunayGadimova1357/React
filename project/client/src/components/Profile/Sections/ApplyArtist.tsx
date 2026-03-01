import React, { useEffect, useState } from "react";
import { Music, Loader2, AlertCircle, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SettingsSection } from "../SettingsComponents";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { artistApplicationApi } from "@/api/artistApplicationApi";
import { AccountService } from "@/api/userApi";

const baseField =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-zinc-700 focus:border-white/30 focus:bg-white/[0.06]";
const baseTextarea = `${baseField} min-h-[120px] resize-none`;

export default function ApplyArtist() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [stageName, setStageName] = useState("");
  const [about, setAbout] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // 1. Проверяем наличие пароля
        const passRes = await AccountService.hasPassword();
        if (!passRes.hasPassword) {
          setShowPasswordModal(true);
          setChecking(false);
          return; // Прекращаем дальнейшие проверки, если пароля нет
        }

        // 2. Проверяем наличие существующей заявки
        await artistApplicationApi.getMy();
        navigate("/profile/artist-status", { replace: true });
      } catch (e: any) {
        // 404 = заявки нет, можно оставаться на форме
        if (e?.response?.status !== 404) {
          toast.error(e?.response?.data?.message || "Failed to check application status");
        }
      } finally {
        // Если пароль есть, убираем лоадер. Если пароля нет, лоадер убрали выше.
        if (!showPasswordModal) setChecking(false);
      }
    })();
  }, [navigate]);

  const canSubmit = stageName.trim().length >= 2 && agree;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;

    try {
      setSubmitting(true);
      await artistApplicationApi.create({
        stageName: stageName.trim(),
        message: about.trim() ? about.trim() : null,
      });

      toast.success(t("artist.apply_submit_success", "Application submitted"));
      navigate("/profile/artist-status");
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data || t("common.error", "Something went wrong");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-zinc-500" size={20} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900/60 border border-white/5 shadow-lg">
          <Music className="text-white" size={28} />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-white">
            {t("artist.apply_title", "Apply to become an artist")}
          </h1>
          <p className="text-sm text-zinc-500">
            {t("artist.apply_subtitle", "Submit an application. Admin will review it.")}
          </p>
        </div>
      </div>

      <div className="space-y-12">
        <div className="rounded-xl border border-white/5 bg-zinc-900/50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <CheckCircle2 size={18} className="text-blue-500" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">
                {t("artist.apply_info_title", "How it works")}
              </div>
              <p className="text-sm text-zinc-400">
                {t("artist.apply_info_text", "Fill in your stage name and short description. After approval you'll get the Artist role.")}
              </p>
            </div>
          </div>
        </div>

        <SettingsSection title={t("artist.apply_section_basic", "Basic information")} description={t("artist.apply_basic_desc", "Tell us who you are.")}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-zinc-400">
                            {t("artist.stage_name", "Artist / stage name")} <span className="text-red-400">*</span>
                        </label>
                        {stageName.trim().length > 0 && stageName.trim().length < 2 && (
                            <span className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {t("artist.stage_name_short", "Too short")}
                            </span>
                        )}
                    </div>
                    <input value={stageName} onChange={(e) => setStageName(e.target.value)} placeholder={t("artist.stage_name_placeholder", "Your stage name")} className={baseField} />
                </div>
            </div>
        </SettingsSection>

        <SettingsSection title={t("artist.about", "Message")}>
          <div className="space-y-2">
            <textarea value={about} onChange={(e) => { const v = e.target.value; if (v.length <= 500) setAbout(v); }} placeholder={t("artist.about_placeholder", "Tell us about your music (optional)")} className={baseTextarea} />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>{t("artist.about_hint", "Optional")}</span>
              <span>{about.length}/500</span>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title={t("artist.apply_section_rights", "Confirmation")} description={t("artist.apply_rights_desc", "You must agree before submitting.")}>
          <label className="flex items-start gap-3 rounded-xl border border-white/5 bg-zinc-900/50 p-4 cursor-pointer">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-white" />
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">
                {t("artist.rights_title", "I confirm I own the rights")}
                <span className="text-red-400"> *</span>
              </div>
              <p className="text-sm text-zinc-400">
                {t("artist.rights_text", "I confirm that I have the rights to upload and distribute my content.")}
              </p>
            </div>
          </label>
        </SettingsSection>

        <div className="pt-2 space-y-3">
          <button onClick={handleSubmit} disabled={!canSubmit || submitting} className="w-full rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-20 transition-all">
            {submitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : t("artist.submit_btn", "Submit")}
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <Lock className="text-red-500" size={28} />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">
                  {t("artist.password_required_title", "Password Required")}
                </h2>
                <p className="text-sm text-zinc-400">
                  {t("artist.password_required_desc", "To become an artist, you must first set a password for your account to ensure security.")}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/profile/security")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                {t("artist.go_to_security", "Set Password")}
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full px-4 py-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
              >
                {t("common.back", "Go back")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}