import React, { useEffect, useState } from "react";
import { X, Music, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { playlistsApi, PlaylistInfo } from "@/api/playlistsApi";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface Props {
  songId?: string;
  onClose: () => void;
  onPlaylistCreated?: () => void;
}

const PlaylistModal: React.FC<Props> = ({
  songId,
  onClose,
  onPlaylistCreated,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<PlaylistInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(!songId);
  const [newTitle, setNewTitle] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const fetchPlaylists = async () => {
    if (!songId) return;
    try {
      setLoading(true);
      const data = await playlistsApi.getMyPlaylists();
      setPlaylists(data);
    } catch (err) {
      toast.error(t("playlist.errors.load_failed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [songId]);

  const handleAdd = async (playlistId: string) => {
    if (!songId) return;
    try {
      await playlistsApi.addSongToPlaylist(playlistId, songId);
      toast.success(t("playlist.success.added"));
      onClose();
    } catch (err) {
      toast.error(t("playlist.errors.add_failed"));
    }
  };

  const handleCreateAction = async () => {
    if (!newTitle.trim()) {
      toast.error(t("playlist.errors.empty_title"));
      return;
    }

    try {
      setCreateLoading(true);
      const created = await playlistsApi.create(newTitle.trim(), "");
      const playlistId = created.id || created.Id;

      if (!playlistId) throw new Error("ID not found");

      if (songId) {
        await playlistsApi.addSongToPlaylist(playlistId, songId);
        toast.success(t("playlist.success.created_and_added"));
      } else {
        toast.success(t("playlist.success.created"));
        navigate(`/playlist/${playlistId}`);
      }

      if (onPlaylistCreated) onPlaylistCreated();
      onClose();
    } catch (err) {
      toast.error(t("playlist.errors.create_failed"));
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-md bg-[#09090b] p-6 shadow-2xl border border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {isCreating && songId && (
              <button
                onClick={() => setIsCreating(false)}
                className="text-zinc-500 hover:text-zinc-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-sm font-black text-zinc-100">
              {isCreating
                ? t("playlist.create_title")
                : t("playlist.add_title")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {!isCreating ? (
          <div className="space-y-1">
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center gap-4 p-3 rounded-md bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition-all mb-4 group"
            >
              <div className="w-10 h-10 bg-zinc-800 rounded-sm flex items-center justify-center border border-zinc-700">
                <Plus
                  size={20}
                  className="text-zinc-400 group-hover:text-white"
                />
              </div>
              <span className="text-xs font-bold text-zinc-400 group-hover:text-white">
                {t("playlist.create_new_btn")}
              </span>
            </button>

            <div className="max-h-[320px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-zinc-600" size={24} />
                </div>
              ) : (
                playlists.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleAdd(p.id)}
                    className="flex items-center gap-4 p-2 rounded-md hover:bg-zinc-900 border border-transparent hover:border-zinc-800 cursor-pointer transition-all group"
                  >
                    <div className="w-10 h-10 bg-zinc-900 rounded-sm flex items-center justify-center overflow-hidden shrink-0 border border-zinc-800">
                      {p.coverUrl ? (
                        <img
                          src={p.coverUrl}
                          className="w-full h-full object-cover transition-all"
                        />
                      ) : (
                        <Music size={18} className="text-zinc-700" />
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-sm font-bold text-zinc-300 group-hover:text-white truncate transition-colors">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {p.songsCount} {t("playlist.tracks_count")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 block">
                {t("playlist.label_title")}
              </label>
              <input
                autoFocus
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={t("playlist.placeholder_title")}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md p-3 text-sm text-white placeholder:text-zinc-700 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-800 outline-none transition-all"
              />
            </div>
            <button
              disabled={createLoading || !newTitle.trim()}
              onClick={handleCreateAction}
              className="w-full py-3 bg-zinc-100 text-black text-xs font-black rounded-md hover:bg-white transition active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {createLoading && <Loader2 size={16} className="animate-spin" />}
              {songId
                ? t("playlist.btn_create_add")
                : t("playlist.btn_create_only")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistModal;
