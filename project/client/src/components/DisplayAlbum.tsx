import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  Clock3,
  Heart,
  Plus,
  MoreVertical,
  ListPlus,
  MoreHorizontal,
  Play,
  Pause,
} from "lucide-react";
import { FastAverageColor } from "fast-average-color";

import { usePlayer } from "../context/PlayerContext";
import { useAuth } from "@/hooks/useAuth";
import { albumApi } from "@/api/albumApi";
import { libraryApi } from "@/api/libraryApi";

import MusicCover from "./MusicCover";
import AddToPlaylistModal from "./modals/PlaylistModal";

const DisplayAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { tracks, playWithId, track: currentTrack, playStatus } = usePlayer();

  const { userName } = useAuth();

  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savedSongsIds, setSavedSongsIds] = useState<Set<string>>(new Set());
  const [dominantColor, setDominantColor] = useState("#050505");

  const [activeMenuSongId, setActiveMenuSongId] = useState<string | null>(null);
  const [isAlbumMenuOpen, setIsAlbumMenuOpen] = useState(false);
  const [selectedSongIdForModal, setSelectedSongIdForModal] = useState<
    string | null
  >(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const albumMenuRef = useRef<HTMLDivElement>(null);

  const isAuthorized = !!userName;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setActiveMenuSongId(null);
      if (
        albumMenuRef.current &&
        !albumMenuRef.current.contains(e.target as Node)
      )
        setIsAlbumMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fac = new FastAverageColor();

    if (!loading && album?.coverUrl) {
      const img = new Image();
      img.src = `https://images.weserv.nl/?url=${encodeURIComponent(album.coverUrl)}&output=jpg&q=10`;
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        fac
          .getColorAsync(img, { algorithm: "sqrt" })
          .then((color) => {
            if (isMounted) setDominantColor(color.hex);
          })
          .catch(() => {
            if (isMounted) setDominantColor("#18181b");
          });
      };
    } else {
      setDominantColor("#050505");
    }

    return () => {
      isMounted = false;
      fac.destroy();
    };
  }, [loading, album?.coverUrl]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await albumApi.getById(id);
        setAlbum(data);

        if (isAuthorized) {
          const [savedAlbums, savedSongs] = await Promise.all([
            libraryApi.getSavedAlbums(),
            libraryApi.getSavedSongs(),
          ]);
          setIsSaved(savedAlbums.some((a) => a.id === id));
          setSavedSongsIds(new Set(savedSongs.map((s) => s.id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isAuthorized]);

  const handleToggleSaveAlbum = async () => {
    if (!isAuthorized) return toast.error(t("library.login_required"));
    try {
      if (isSaved) {
        await libraryApi.unsaveAlbum(id!);
        setIsSaved(false);
        toast.success(t("library.removed_success"));
      } else {
        await libraryApi.saveAlbum(id!);
        setIsSaved(true);
        toast.success(t("library.added_success"));
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setIsAlbumMenuOpen(false);
    }
  };

  const handleToggleSaveSong = async (songId: string) => {
    if (!isAuthorized) return toast.error(t("library.login_required"));
    const isCurrentlySaved = savedSongsIds.has(songId);
    try {
      if (isCurrentlySaved) {
        await libraryApi.unsaveSong(songId);
        setSavedSongsIds((prev) => {
          const next = new Set(prev);
          next.delete(songId);
          return next;
        });
        toast.success(t("library.song_removed"));
      } else {
        await libraryApi.saveSong(songId);
        setSavedSongsIds((prev) => new Set(prev).add(songId));
        toast.success(t("library.song_added"));
      }
    } catch {
      toast.error(t("common.error"));
    } finally {
      setActiveMenuSongId(null);
    }
  };

  const albumTracks = useMemo(
    () => (id ? tracks.filter((x) => x.albumId === id) : []),
    [tracks, id],
  );

  const totalDuration = useMemo(() => {
    const totalSeconds = albumTracks.reduce((acc, track) => {
      const parts = track.duration.split(":");
      return acc + parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }, 0);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.ceil((totalSeconds % 3600) / 60);
    return h > 0
      ? `${h} ${t("units.hours")} ${m} ${t("units.mins")}`
      : `${m} ${t("units.mins")}`;
  }, [albumTracks, t]);

  if (loading || !album) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#050505]">
        <div className="w-10 h-10 border-4 border-t-white border-white/10 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-[#050505] overflow-x-hidden overflow-y-auto custom-scrollbar">
      <div
        className="absolute left-0 right-0 h-[550px] pointer-events-none opacity-40 transition-opacity duration-1000 z-0"
        style={{
          top: "-210px",
          background: `linear-gradient(to bottom, ${dominantColor} 0%, #050505 100%)`,
        }}
      />

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pb-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 py-8 text-center md:text-left animate-in fade-in duration-500">
          <MusicCover
            src={album.coverUrl}
            alt={album.albumName}
            className="w-48 sm:w-56 shadow-2xl rounded"
          />
          <div className="flex flex-col gap-2 w-full min-w-0">
            <p className="text-xs font-medium text-white/60">
              {t("album.playlist")}
            </p>
            <h2 className="text-3xl sm:text-6xl font-bold text-white truncate leading-tight">
              {album.albumName}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-4">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => navigate(`/artist/${album.artistId}`)}
              >
                <img
                  src={album.artistImageUrl ?? ""}
                  className="w-7 h-7 rounded-full object-cover border border-white/10"
                  alt=""
                />
                <span className="font-bold text-white hover:underline">
                  {album.artistName}
                </span>
              </div>
              <span className="text-white/70 text-sm">
                • {albumTracks.length} {t("album.songs")}
              </span>
              <span className="hidden sm:inline text-white/50 text-sm">
                • {totalDuration}
              </span>

              <div className="relative">
                <button
                  onClick={() => setIsAlbumMenuOpen(!isAlbumMenuOpen)}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
                >
                  <MoreHorizontal size={24} />
                </button>

                {isAlbumMenuOpen && (
                  <div
                    ref={albumMenuRef}
                    className="absolute left-0 mt-2 z-50 w-64 bg-[#18181b] border border-white/10 rounded shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <button
                      onClick={handleToggleSaveAlbum}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition"
                    >
                      <Heart
                        size={18}
                        className={
                          isSaved ? "fill-white text-white" : "text-zinc-500"
                        }
                      />
                      {isSaved
                        ? t("library.actions.unsave_album")
                        : t("library.actions.save_album")}
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
          <span>{t("album.title")}</span>
          <div className="flex justify-end pr-8">
            <Clock3 size={16} />
          </div>
        </div>

        <div className="flex flex-col gap-1 relative z-20">
          {albumTracks.map((item: any, index: number) => {
            const isThisTrackActive = currentTrack?.id === item.id;
            const isThisTrackPlaying = isThisTrackActive && playStatus;
            const isThisSongSaved = savedSongsIds.has(item.id);

            return (
              <div
                key={item.id}
                onClick={() => playWithId(item.id)}
                className="group flex md:grid md:grid-cols-[32px_48px_1fr_120px] gap-4 items-center p-2 md:p-3 rounded-md hover:bg-white/5 transition cursor-pointer"
              >
                <div className="hidden md:flex items-center justify-center w-8">
                  {isThisTrackPlaying ? (
                    <Pause
                      size={16}
                      className="text-white"
                      fill="currentColor"
                    />
                  ) : (
                    <>
                      <span className="text-sm font-medium text-zinc-500 group-hover:hidden">
                        {index + 1}
                      </span>
                      <Play
                        size={16}
                        className="hidden group-hover:block text-white"
                        fill="currentColor"
                      />
                    </>
                  )}
                </div>

                <div className="shrink-0">
                  <MusicCover
                    src={item.image}
                    className="w-12 h-12 md:w-10 md:h-10 rounded shadow-md"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="text-sm font-medium truncate text-zinc-100 group-hover:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {album.artistName}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 md:gap-4 shrink-0">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuSongId(
                          activeMenuSongId === item.id ? null : item.id,
                        );
                      }}
                      className="p-2 hover:bg-white/10 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                    >
                      <MoreVertical
                        size={20}
                        className="text-zinc-400 hover:text-white"
                      />
                    </button>

                    {activeMenuSongId === item.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-10 z-50 w-56 bg-[#18181b] border border-white/10 rounded shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSaveSong(item.id);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition"
                        >
                          {isThisSongSaved ? (
                            <Heart
                              size={16}
                              className="fill-white text-white"
                            />
                          ) : (
                            <Plus size={16} />
                          )}
                          {isThisSongSaved
                            ? t("library.actions.unsave")
                            : t("library.actions.save")}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isAuthorized)
                              return toast.error(t("library.login_required"));
                            setSelectedSongIdForModal(item.id);
                            setActiveMenuSongId(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition"
                        >
                          <ListPlus size={16} /> {t("playlist.add_to_playlist")}
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="hidden md:block text-xs text-zinc-500 font-mono text-right w-12">
                    {item.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {selectedSongIdForModal && (
        <AddToPlaylistModal
          songId={selectedSongIdForModal}
          onClose={() => setSelectedSongIdForModal(null)}
        />
      )}
    </div>
  );
};

export default DisplayAlbum;
