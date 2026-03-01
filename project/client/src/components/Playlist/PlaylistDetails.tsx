import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoIosArrowBack } from "react-icons/io";
import { Clock3, Music, Trash2, Camera, MoreHorizontal, Play, Pause, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import { FastAverageColor } from "fast-average-color";

import { playlistsApi } from "@/api/playlistsApi";
import { usePlayer } from "@/context/PlayerContext";
import MusicCover from "../MusicCover";
import EditPlaylistModal from "../modals/EditPlaylistModal";
import { recentHistory } from "@/utils/recentHistory";

const formatDuration = (value: any) => {
  if (value == null) return "0:00";
  if (typeof value === "string" && value.includes(":")) return value;
  
  const total = Math.max(0, Math.floor(Number(value) || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
};

const PlaylistDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playWithId, track: currentTrack, isPlaying } = usePlayer();

  const menuRef = useRef<HTMLDivElement>(null);

  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dominantColor, setDominantColor] = useState("#050505");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (id) fetchPlaylist();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fac = new FastAverageColor();
    if (!loading && playlist?.coverUrl) {
      const img = new Image();
      img.src = `https://images.weserv.nl/?url=${encodeURIComponent(playlist.coverUrl)}&output=jpg&q=10`;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        fac.getColorAsync(img, { algorithm: "sqrt" })
          .then((color) => { if (isMounted) setDominantColor(color.hex); })
          .catch(() => { if (isMounted) setDominantColor("#18181b"); });
      };
    } else {
      setDominantColor("#050505");
    }
    return () => { isMounted = false; fac.destroy(); };
  }, [loading, playlist?.coverUrl]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const data = await playlistsApi.getPlaylistById(id!);
      setPlaylist(data);
      
      // Сохраняем плейлист в историю
      if (data) {
        recentHistory.addPlaylist({
          id: data.id,
          name: data.title,
          image: data.coverUrl || "",
        });
      }
    } catch (err: any) {
      toast.error(t("playlist.errors.load_failed"));
      navigate("/library");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    try {
      await playlistsApi.delete(id!);
      toast.success(t("playlist.success.deleted"));
      navigate("/library");
    } catch (error) {
      toast.error(t("common.errors.action_failed"));
    } finally {
      setIsMenuOpen(false);
    }
  };

  const handleRemoveSong = async (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    try {
      await playlistsApi.removeSongFromPlaylist(id!, songId);
      toast.success(t("playlist.success.song_removed"));
      setPlaylist((prev: any) => ({
        ...prev,
        songs: prev.songs.filter((s: any) => s.id !== songId),
      }));
    } catch {
      toast.error(t("playlist.errors.remove_failed"));
    }
  };

  if (loading || !playlist) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#050505]">
        <div className="w-10 h-10 border-4 border-t-white border-white/10 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-[#050505] overflow-x-hidden overflow-y-auto custom-scrollbar">
      <div
        className="absolute inset-0 h-[500px] pointer-events-none opacity-40 transition-opacity duration-1000 z-0"
        style={{ background: `linear-gradient(to bottom, ${dominantColor}, #050505)` }}
      />

      <div className="sticky top-0 z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full text-zinc-400 hover:text-white transition active:scale-90">
          <IoIosArrowBack size={20} />
        </button>
        <h1 className="text-sm font-bold text-white truncate">{playlist.title}</h1>
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto pb-32 px-4 md:px-8">
        <div className="p-4 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 text-center md:text-left">
          <div
            className="group relative w-48 h-48 md:w-60 md:h-60 bg-zinc-900 flex items-center justify-center shrink-0 rounded shadow-2xl overflow-hidden cursor-pointer"
            onClick={() => setIsEditModalOpen(true)}
          >
            {playlist.coverUrl ? (
              <img src={playlist.coverUrl} className="w-full h-full object-cover transition group-hover:scale-105" alt="" />
            ) : (
              <Music size={64} className="text-zinc-800" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
              <Camera size={32} className="text-white" />
              <span className="text-[10px] font-bold text-white">{t("playlist.change_photo")}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full min-w-0">
            <p className="text-xs font-medium text-white/60">{t("playlist.type_label")}</p>
            <h2 onClick={() => setIsEditModalOpen(true)} className="text-3xl md:text-6xl font-bold text-white truncate leading-tight cursor-pointer hover:text-white/80 transition">
              {playlist.title}
            </h2>
            {playlist.description && <p className="text-sm text-white/50 line-clamp-2 max-w-2xl mt-1">{playlist.description}</p>}

            <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
              <span className="text-sm font-bold text-white pr-3 border-r border-white/10">{t("playlist.owner_label")}</span>
              <span className="text-sm text-white/50">{playlist.songs?.length || 0} {t("playlist.songs_count")}</span>

              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition active:bg-white/20"
                >
                  <MoreHorizontal size={24} />
                </button>

                {isMenuOpen && (
                  <div 
                    ref={menuRef} 
                    className="absolute right-0 md:left-0 mt-2 z-[100] w-52 bg-[#282828] border border-white/10 rounded shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-150 origin-top-right md:origin-top-left"
                  >
                    <button 
                      onClick={() => { setIsEditModalOpen(true); setIsMenuOpen(false); }} 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-200 hover:bg-white/10 transition text-left"
                    >
                      <Edit2 size={16} /> {t("playlist.edit_details")}
                    </button>
                    <div className="h-[1px] bg-white/5 my-1" />
                    <button 
                      onClick={handleDeletePlaylist} 
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-white/10 transition text-left"
                    >
                      <Trash2 size={16} /> {t("playlist.delete")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[32px_48px_1fr_120px] gap-4 px-4 py-2 border-b border-white/5 text-zinc-500 text-sm font-medium mb-4">
          <span>#</span>
          <span></span>
          <span>{t("playlist.table_title")}</span>
          <div className="flex justify-end pr-8"><Clock3 size={16} /></div>
        </div>

        <div className="flex flex-col gap-1 relative z-20">
          {playlist.songs?.map((song: any, index: number) => {
             const isTrackActive = currentTrack?.id === song.id;
             const isTrackPlaying = isTrackActive && isPlaying;

             return (
              <div
                key={song.id}
                onClick={() => playWithId(song.id)}
                className="group flex md:grid md:grid-cols-[32px_48px_1fr_120px] gap-4 items-center p-2 md:p-3 rounded-md hover:bg-white/5 transition cursor-pointer"
              >
                <div className="hidden md:flex items-center justify-center w-8 text-zinc-500">
                  {isTrackPlaying ? (
                    <Pause size={14} className="text-white" fill="currentColor" />
                  ) : (
                    <>
                      <span className="text-sm group-hover:hidden">{index + 1}</span>
                      <Play size={14} className="hidden group-hover:block text-white" fill="currentColor" />
                    </>
                  )}
                </div>

                <div className="shrink-0">
                  <MusicCover src={song.coverUrl} className="w-12 h-12 md:w-10 md:h-10 rounded shadow-md" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className={`text-sm font-medium truncate ${isTrackActive ? 'text-white' : 'text-zinc-100 group-hover:text-white'}`}>
                    {song.title}
                  </h3>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{song.artist?.artistName || t("playlist.unknown_artist")}</p>
                </div>

                <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0">
                  <button onClick={(e) => handleRemoveSong(e, song.id)} className="p-2 text-zinc-500 hover:text-red-500 transition opacity-100 md:opacity-0 md:group-hover:opacity-100 active:scale-90">
                    <Trash2 size={18} />
                  </button>
                  <span className="hidden md:block text-xs text-zinc-500 font-mono text-right w-12">{formatDuration(song.duration)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {isEditModalOpen && <EditPlaylistModal playlist={playlist} onClose={() => setIsEditModalOpen(false)} />}
    </div>
  );
};

export default PlaylistDetails;