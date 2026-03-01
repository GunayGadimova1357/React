import React, { useState, useRef, useEffect } from "react";
import { X, Camera, Music } from "lucide-react";
import { playlistsApi } from "@/api/playlistsApi";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

interface EditPlaylistModalProps {
  playlist: any;
  onClose: () => void;
}

const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({ playlist, onClose }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(playlist?.title || playlist?.Title || "");
  const [description, setDescription] = useState(playlist?.description || playlist?.Description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(playlist?.coverUrl || playlist?.CoverUrl || null);

  useEffect(() => {
    if (playlist) {
      setTitle(playlist.title || playlist.Title || "");
      setDescription(playlist.description || playlist.Description || "");
      setPreviewUrl(playlist.coverUrl || playlist.CoverUrl || null);
    }
  }, [playlist]);

  if (!playlist) return null;

  const handleSave = async () => {
    const pId = playlist.id || playlist.Id;
    if (!title.trim()) return toast.error(t("playlist.errors.title_required"));

    try {
      setIsSubmitting(true);

      const updateData: any = { title: title.trim(), description: description.trim(), };

      await playlistsApi.update(pId, updateData);

      if (selectedFile) {
        await playlistsApi.updateCover(pId, selectedFile);
      }

      toast.success(t("playlist.success.updated"));
      window.location.reload();
      onClose();
    } catch (error: any) {
      console.error("Backend Error:", error.response?.data);
      toast.error(error.response?.data || t("playlist.errors.update_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#282828] w-full max-w-[524px] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 pb-4">
          <h1 className="text-2xl font-black text-white">{t("playlist.edit_details")}</h1>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition p-1"><X size={32} /></button>
        </div>
        <div className="p-6 pt-2 text-left">
          <div className="flex flex-col sm:flex-row gap-4">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <div className="relative group w-full sm:w-[180px] h-[180px] shrink-0 bg-[#333] shadow-2xl rounded overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover group-hover:brightness-[0.3] transition" alt="preview" /> : <div className="w-full h-full flex items-center justify-center text-zinc-500"><Music size={64} /></div>}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Camera size={54} className="text-white mb-2" />
                <span className="text-white text-[11px] font-bold">{t("playlist.choose_photo")}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-grow">
              <div className="relative group">
                <label className="absolute -top-2 left-3 px-1 text-[11px] font-bold text-zinc-400 bg-[#282828] z-10">{t("playlist.name_label")}</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#3e3e3e] border border-transparent focus:border-zinc-500 rounded px-3 py-3 text-sm text-white outline-none" />
              </div>
              <div className="relative group flex-grow">
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("playlist.description_placeholder")} className="w-full h-full min-h-[105px] bg-[#3e3e3e] border border-transparent focus:border-zinc-500 rounded px-3 py-3 text-sm text-white outline-none resize-none scrollbar-hide" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end mt-6">
            <button onClick={handleSave} disabled={isSubmitting} className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition min-w-[140px] disabled:opacity-50">
              {isSubmitting ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;