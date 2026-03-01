import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Loader2, Play, Pause, Music, Disc } from "lucide-react";
import { useTranslation } from "react-i18next";

import { artistApi, ArtistResponse as ArtistData } from "@/api/artistsApi";
import { usePlayer } from "@/context/PlayerContext";
import MusicCover from "@/components/MusicCover";
import { formatDuration } from "@/lib/formatDuration";
import { recentHistory } from "@/utils/recentHistory";
import { EmptyState } from "@/components/VisualHelper";

const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { playWithId, track: currentTrack, playStatus } = usePlayer();

  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await artistApi.getArtistProfile(id);
        setArtist(data);
        
        // Сохраняем артиста в историю
        recentHistory.addArtist({
          id: data.id,
          name: data.artistName,
          image: data.photoUrl || "",
        });
      } catch (err) {
        console.error("Failed to fetch artist profile:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
        <Loader2 className="animate-spin text-zinc-700" size={32} />
      </div>
    );
  }

  if (!artist) return null;

  const handlePlayAll = () => {
    if (artist.songs?.length > 0) {
      playWithId(artist.songs[0].id);
    }
  };

  return (
    <div className="w-full h-full bg-[#050505] text-zinc-100 overflow-x-hidden overflow-y-auto custom-scrollbar">
      <header className="px-6 md:px-10 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-black/40 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-black/60 transition active:scale-90"
        >
          <IoIosArrowBack size={24} />
        </button>

        <div className="flex items-center gap-6">
          <div className="relative overflow-hidden rounded-lg shadow-lg shrink-0">
            <img
              src={artist.photoUrl || ""}
              className="w-32 h-32 object-cover"
              alt={artist.artistName}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-500 text-[10px] font-bold uppercase rounded-sm text-white">
                Verified
              </span>
              <p className="text-sm font-medium text-zinc-300">
                {t("search.type.artist")}
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              {artist.artistName}
            </h1>

            {artist.bio && (
              <p className="text-sm text-zinc-400 mb-4 max-w-md leading-relaxed">
                {artist.bio}
              </p>
            )}

            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <Play size={20} fill="black" />
                {t("common.play") || "Play"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-8 text-white">
              {t("artist.popular_songs") || "Popular Tracks"}
            </h2>

            {artist.songs.length > 0 ? (
              <div className="flex flex-col gap-1">
                {artist.songs.map((song, index) => {
                  const isActive = currentTrack?.id === song.id;
                  const isPlaying = isActive && playStatus;

                  return (
                    <div
                      key={song.id}
                      onClick={() => playWithId(song.id)}
                      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900/40 transition-colors cursor-pointer border border-transparent hover:border-zinc-800/30"
                    >
                      <div className="hidden md:flex items-center justify-center w-8">
                        {isPlaying ? (
                          <Pause
                            size={14}
                            className="text-white"
                            fill="currentColor"
                          />
                        ) : isActive ? (
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

                      <div className="relative overflow-hidden rounded shadow-lg shrink-0">
                        <MusicCover src={song.coverUrl} className="w-12 h-12" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-zinc-300 group-hover:text-white"}`}
                        >
                          {song.title}
                        </h3>
                        <p className="text-xs text-zinc-500 truncate mt-0.5">
                          {artist.artistName}
                        </p>
                      </div>

                      <div className="text-zinc-500 text-xs font-mono">
                        {formatDuration(song.duration)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title={t("library.empty.no_tracks") || "No tracks available"}
                message={t("library.empty.no_tracks_desc") || "This artist doesn't have any tracks yet."}
                icon={Music}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <h2 className="text-2xl font-bold mb-8 text-white">
                {t("search.type.album") + "s"}
              </h2>

              {artist.albums.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {artist.albums.map((album) => (
                    <div
                      key={album.id}
                      onClick={() => navigate(`/album/${album.id}`)}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-md shadow-2xl shrink-0">
                        <MusicCover
                          src={album.coverUrl}
                          className="w-20 h-20 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white truncate">
                          {album.title}
                        </h4>
                        <p className="text-xs text-zinc-500 mt-1">
                          {new Date(album.releaseDate).getFullYear()} •{" "}
                          {t("search.type.album")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={t("library.empty.no_albums") || "No albums available"}
                  message={t("library.empty.no_albums_desc") || "This artist doesn't have any albums yet."}
                  icon={Disc}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtistProfile;
