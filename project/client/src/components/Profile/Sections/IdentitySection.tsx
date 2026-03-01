import React, { useEffect, useState } from "react";
import {
  User,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Check,
} from "lucide-react";
import { AccountService, UserProfile } from "@/api/userApi";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_AUTH_API_URL?.replace("/api", "") || "";

export default function IdentitySection() {
  const { t } = useTranslation();
  const { login } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userName, setUserName] = useState("");

  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [errorText, setErrorText] = useState("");

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await AccountService.getMe();
      setProfile(data);
      setUserName(data.userName || "");
    } catch (error) {
      toast.error(t("profile.load_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await AccountService.uploadAvatar(file);
      const newPath = result.data;

      if (newPath) {
        const timestampedUrl = `${newPath}?t=${new Date().getTime()}`;
        setProfile((prev) =>
          prev ? { ...prev, avatarUrl: timestampedUrl } : null,
        );
        const token = localStorage.getItem("accessToken") || "";
        login(token, userName, profile?.email || "", timestampedUrl);
        toast.success(t("profile.upload_success"));
      }
    } catch (error: any) {
      toast.error(t("profile.upload_error"));
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (userName === profile?.userName) {
      setIsAvailable(true);
      setErrorText("");
      return;
    }
    if (!userName.trim() || userName.length < 3) {
      setIsAvailable(false);
      setErrorText(userName.length > 0 ? t("profile.username_too_short") : "");
      return;
    }
    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      try {
        const available = await AccountService.checkUsername(userName);
        setIsAvailable(available);
        setErrorText(available ? "" : t("profile.username_taken"));
      } catch (err) {
        console.error(err);
      } finally {
        setIsChecking(false);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [userName, profile, t]);

  const handleSave = async () => {
    if (!userName.trim() || !isAvailable) return;

    try {
      setIsSaving(true);
      const updatedProfile = await AccountService.updateProfile({ userName });
      setProfile(updatedProfile);
      setUserName(updatedProfile.userName || "");

      const token = localStorage.getItem("accessToken") || "";
      login(
        token,
        updatedProfile.userName,
        updatedProfile.email,
        updatedProfile.avatarUrl,
      );

      toast.success(t("profile.save_success"));
    } catch (error: any) {
      toast.error(t("profile.save_error"));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20 bg-[#121212]">
        <Loader2 className="animate-spin text-zinc-700" />
      </div>
    );

  const renderAvatar = () => {
    if (!profile?.avatarUrl)
      return <User size={40} className="text-zinc-800" />;
    const src = profile.avatarUrl.startsWith("http")
      ? profile.avatarUrl
      : `${API_URL}${profile.avatarUrl}`;
    return (
      <img src={src} className="h-full w-full object-cover" alt="Avatar" />
    );
  };

  return (
    <div className="bg-[#121212] text-zinc-100 animate-in fade-in duration-500 pb-20 px-4 max-w-md mx-auto">
      <div className=" space-y-10">
        <div className="flex flex-col items-center">
          <div className="group relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-zinc-800 bg-zinc-900 shadow-xl relative">
              {renderAvatar()}
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                  <Loader2 size={20} className="animate-spin text-white" />
                </div>
              )}
              <label
                className={`absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity rounded-full backdrop-blur-sm ${!isUploading && "group-hover:opacity-100"}`}
              >
                <Camera size={18} className="text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-xl font-semibold text-white">
                {profile?.userName}
              </h1>
              {profile?.isConfirmed && (
                <CheckCircle2 size={16} className="text-blue-500" />
              )}
            </div>
            <p className="text-sm text-zinc-500">{profile?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-zinc-400">
                {t("profile.display_name")}
              </label>
              {userName && userName !== profile?.userName && (
                <div className="text-xs">
                  {isChecking ? (
                    <Loader2 size={12} className="animate-spin text-zinc-500" />
                  ) : isAvailable ? (
                    <span className="text-green-500 flex items-center gap-1">
                      <Check size={12} /> {t("profile.username_available")}
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} /> {errorText}
                    </span>
                  )}
                </div>
              )}
            </div>
            <input
              type="text"
              value={userName}
              placeholder={t("profile.username_placeholder")}
              onChange={(e) => setUserName(e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 text-sm text-zinc-100 outline-none transition-all ${
                !isAvailable && userName !== profile?.userName
                  ? "border-red-500/50 bg-red-500/5 focus:border-red-500"
                  : "border-zinc-800 bg-zinc-900 focus:border-zinc-700"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">
              {t("profile.email")}
            </label>
            <input
              type="email"
              value={profile?.email || ""}
              disabled
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-500 cursor-not-allowed opacity-60"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={
                isSaving ||
                userName === profile?.userName ||
                !isAvailable ||
                isChecking ||
                isUploading
              }
              className="w-full rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-20 transition-all"
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin mx-auto" />
              ) : (
                t("profile.update_btn")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
