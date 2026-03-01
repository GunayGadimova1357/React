import React from "react";
import { useTranslation } from "react-i18next";

const DeletePlaylistModal = ({
  open,
  onClose,
  playlistName
}: {
  open: boolean;
  onClose: () => void;
  playlistName: string;
}) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f] w-[420px] p-6 rounded-lg">

        <h2 className="text-xl font-semibold mb-2">
          {t("modal.delete_title")}
        </h2>

        <p className="text-gray-400 mb-6">
          {t("modal.delete_text", { name: playlistName })}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            {t("modal.cancel")}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full font-medium bg-[#1ed760] text-black hover:scale-105 transition"
          >
            {t("modal.delete")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlaylistModal;
