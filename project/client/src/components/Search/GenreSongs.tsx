import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Loader2, Play, Pause } from "lucide-react";
import { useTranslation } from "react-i18next";

import { genreApi } from "@/api/genreApi";
import { usePlayer } from "@/context/PlayerContext";
import MusicCover from "@/components/MusicCover";
import { formatDuration } from "@/lib/formatDuration";

const GenreSongs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { playWithId, track: currentTrack, playStatus } = usePlayer();

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const result = await genreApi.getGenreSongs(id);
        setData(result);
      } catch (err) {
        console.error("Error loading genre:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#121212]">
        <Loader2 className="animate-spin text-zinc-500" size={32} />
      </div>
    );
  }

  const genreName = data?.name ?? data?.Name ?? t("genre.unknown");
  const songs = data?.songs ?? data?.Songs ?? [];

  return (
    <div className="w-full h-full bg-[#121212] text-zinc-100 overflow-x-hidden overflow-y-auto custom-scrollbar">
      <header className="sticky top-0 z-20 bg-[#121212]/95 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-zinc-500 hover:text-white transition active:scale-90 p-1"
          >
            <IoIosArrowBack size={24} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-white truncate">
              {genreName}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-2 md:px-6 py-4 md:py-8 pb-32">
        <div className="flex flex-col gap-1">
          <div className="hidden md:grid grid-cols-[16px_48px_1fr_80px] gap-4 px-4 py-2 border-b border-zinc-900 text-zinc-500 text-sm font-medium mb-2">
            <span>#</span>
            <span></span>
            <span>{t("album.title")}</span>
            <span className="text-right">
              {t("album.duration_short") || "Time"}
            </span>
          </div>

          {songs.length > 0 ? (
            songs.map((song: any, index: number) => {
              const songId = song.id ?? song.Id;
              const songTitle = song.title ?? song.Title;
              const artistName = song.artistName ?? song.ArtistName;
              const cover = song.coverUrl ?? song.CoverUrl;
              const duration = song.duration ?? song.Duration;

              const isThisTrackActive = currentTrack?.id === songId;
              const isThisTrackPlaying = isThisTrackActive && playStatus;

              return (
                <div
                  key={songId}
                  onClick={() => playWithId(songId)}
                  className="group flex md:grid md:grid-cols-[16px_48px_1fr_80px] items-center gap-3 md:gap-4 p-2 md:p-3 rounded-md hover:bg-zinc-900/60 active:bg-zinc-900 transition cursor-pointer overflow-hidden"
                >
                  <div className="hidden md:flex items-center justify-center">
                    {isThisTrackPlaying ? (
                      <Pause
                        size={14}
                        className="text-white"
                        fill="currentColor"
                      />
                    ) : isThisTrackActive ? (
                      <Play
                        size={14}
                        className="text-white"
                        fill="currentColor"
                      />
                    ) : (
                      <>
                        <span className="text-zinc-500 text-sm group-hover:hidden">
                          {index + 1}
                        </span>
                        <Play
                          size={14}
                          className="hidden group-hover:block text-white"
                          fill="currentColor"
                        />
                      </>
                    )}
                  </div>

                  <div className="shrink-0">
                    <MusicCover
                      src={cover}
                      className="w-12 h-12 md:w-10 md:h-10 rounded shadow-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3
                      className={`text-sm font-medium truncate ${isThisTrackActive ? "text-white" : "text-zinc-300 group-hover:text-white"}`}
                    >
                      {songTitle || t("song.untitled")}
                    </h3>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {artistName || t("artist.unknown")}
                    </p>
                  </div>

                  <div className="shrink-0 text-right pr-2">
                    <span className="text-[11px] md:text-xs text-zinc-500 font-mono">
                      {formatDuration(duration)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center text-zinc-600 italic">
              {t("genre.no_songs")}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GenreSongs;
