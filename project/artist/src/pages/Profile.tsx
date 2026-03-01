import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { User, Camera, Loader2 } from "lucide-react";
import { getMe, updateProfile, uploadPhoto } from "@/services/artistProfileApi";
import { useAuth } from "@/features/auth/useAuth";

export function Profile() {
  const { t } = useTranslation();
  const { updateUserData } = useAuth();

  // Состояния загрузки
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Данные профиля
  const [avatar, setAvatar] = useState<string | null>(null);
  const [artistName, setArtistName] = useState("");
  const [bio, setBio] = useState("");

  // Рефы для отслеживания изменений (чтобы знать, изменились ли данные)
  const initialData = useRef({ name: "", bio: "", photo: "" as string | null });

  useEffect(() => {
    getMe()
      .then((me) => {
        const name = me.artistName ?? "";
        const biography = me.bio ?? "";
        const photo = me.photoUrl ?? null;

        setArtistName(name);
        setBio(biography);
        setAvatar(photo);

        // Запоминаем начальные данные
        initialData.current = { name, bio: biography, photo };
      })
      .catch((e) => toast.error(e?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  // Проверка: изменились ли текстовые данные
  const isDirty = artistName !== initialData.current.name || bio !== initialData.current.bio;

  const handleSave = async () => {
    if (saving || !isDirty) return;
    setSaving(true);
    try {
      const updated = await updateProfile({ artistName, bio });
      
      // Обновляем локальный эталон
      initialData.current.name = updated.artistName ?? "";
      initialData.current.bio = updated.bio ?? "";

      // Обновляем глобальное состояние
      updateUserData({ userName: updated.artistName });

      // Оповещаем Sidebar
      window.dispatchEvent(new CustomEvent("profileUpdated", { 
        detail: { artistName: updated.artistName } 
      }));

      toast.success(t("profile.save_success", "Profile updated"));
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profile.error_file_too_large", "File is too large"));
      return;
    }

    setUploading(true);
    const preview = URL.createObjectURL(file);
    const oldAvatar = avatar;
    setAvatar(preview); 

    try {
      const url = await uploadPhoto(file);
      setAvatar(url);
      initialData.current.photo = url;

      // Обновляем глобальное состояние
      updateUserData({ avatarUrl: url });

      // Оповещаем Sidebar о новом фото
      window.dispatchEvent(new CustomEvent("profileUpdated", { 
        detail: { photoUrl: url } 
      }));

      toast.success(t("profile.photo_updated", "Photo uploaded"));
    } catch (e: any) {
      setAvatar(oldAvatar); // Возвращаем старый аватар при ошибке
      toast.error(e?.message || "Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-zinc-500" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 p-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Секция Аватара */}
        <div className="space-y-4">
          <div className="group relative h-48 w-48 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 transition-all hover:border-zinc-700 shadow-2xl">
            {avatar ? (
              <img 
                src={avatar} 
                className={`h-full w-full object-cover transition-all duration-500 ${uploading ? 'scale-110 blur-sm opacity-50' : 'scale-100 opacity-100'}`} 
                alt="Avatar" 
                onError={() => setAvatar(null)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900/50 text-zinc-500">
                <User size={40} className="mb-2 opacity-20" />
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-medium italic">
                  {t("profile.no_photo", "No Photo")}
                </span>
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-white" size={32} />
              </div>
            )}

            <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={24} className="mb-2 text-white transform group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-white px-2 text-center">
                {uploading ? t("profile.uploading", "Uploading...") : t("profile.change_photo", "Change Photo")}
              </span>
              <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={handlePhotoChange} />
            </label>
          </div>
          <p className="text-[11px] text-zinc-500 px-1 leading-relaxed">
            {t("profile.photo_hint", "Recommended: Square format, PNG or JPG, up to 5MB")}
          </p>
        </div>

        {/* Форма данных */}
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-zinc-200">
                {t("profile.public_settings", "Public Settings")}
              </h2>
              <div className="h-px flex-1 bg-zinc-900" />
            </div>

            <div className="grid gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-400 ml-1">
                  {t("profile.display_name", "Display Name")}
                </label>
                <input
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-sm text-zinc-200 outline-none focus:border-zinc-500 focus:bg-zinc-900/30 transition-all placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-400 ml-1">
                  {t("profile.about_bio", "Bio")}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-sm text-zinc-200 outline-none focus:border-zinc-500 focus:bg-zinc-900/30 transition-all"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={saving || uploading || !isDirty}
              className="group flex items-center gap-2 rounded-xl bg-white px-10 py-3.5 text-sm font-bold text-zinc-950 hover:bg-zinc-200 active:scale-95 transition-all shadow-lg disabled:opacity-20 disabled:pointer-events-none"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : null}
              {saving ? t("profile.saving", "Saving...") : t("profile.update_btn", "Update Profile")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}