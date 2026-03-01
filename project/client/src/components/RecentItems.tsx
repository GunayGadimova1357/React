import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { recentHistory, RecentArtist, RecentPlaylist } from "@/utils/recentHistory";
import { usePlayer } from "@/context/PlayerContext";
import MusicCover from "./MusicCover";

interface RecentItemsProps {
  isOpen: boolean;
  isMobile: boolean;
  onItemClick?: () => void;
}

const RecentItems: React.FC<RecentItemsProps> = ({ isOpen, isMobile, onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { track, playStatus } = usePlayer();
  const [recentData, setRecentData] = useState<{
    artists: RecentArtist[];
    playlists: RecentPlaylist[];
  }>({ artists: [], playlists: [] });
  const [activeFilter, setActiveFilter] = useState<"all" | "artists" | "playlists">("all");

  useEffect(() => {
    const loadRecent = () => {
      const data = recentHistory.getAllRecent();
      setRecentData(data);
    };

    loadRecent();
    // Обновляем каждые 2 секунды для синхронизации
    const interval = setInterval(loadRecent, 2000);
    return () => clearInterval(interval);
  }, []);

  const allItems = [
    ...recentData.artists.map((a) => ({ ...a, type: "artist" as const })),
    ...recentData.playlists.map((p) => ({ ...p, type: "playlist" as const })),
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6);

  const filteredItems =
    activeFilter === "all"
      ? allItems
      : allItems.filter((item) =>
          activeFilter === "artists" ? item.type === "artist" : item.type === "playlist",
        );

  if (allItems.length === 0) return null;

  const handleClick = (item: (RecentArtist | RecentPlaylist) & { type: "artist" | "playlist" }) => {
    if (item.type === "artist") {
      navigate(`/artist/${item.id}`);
    } else {
      navigate(`/playlist/${item.id}`);
    }
    if (isMobile && onItemClick) {
      onItemClick();
    }
  };

  const isNowPlaying = (
    item: (RecentArtist | RecentPlaylist) & { type: "artist" | "playlist" },
  ) => {
    if (!playStatus) return false;
    if (item.type === "artist") return !!track?.artistId && track.artistId === item.id;
    // Для плейлистов: считаем “активным”, если вы на странице плейлиста и музыка играет
    return location.pathname === `/playlist/${item.id}`;
  };

  const NowPlayingBars = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-end gap-0.5 ${className}`}>
      <span
        className="h-2 w-[2px] origin-bottom rounded-full bg-zinc-100 motion-reduce:animate-none animate-[equalizer_1s_ease-in-out_infinite]"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="h-3 w-[2px] origin-bottom rounded-full bg-zinc-100 motion-reduce:animate-none animate-[equalizer_1s_ease-in-out_infinite]"
        style={{ animationDelay: "120ms" }}
      />
      <span
        className="h-2.5 w-[2px] origin-bottom rounded-full bg-zinc-100 motion-reduce:animate-none animate-[equalizer_1s_ease-in-out_infinite]"
        style={{ animationDelay: "240ms" }}
      />
    </div>
  );

  if (!isOpen) {
    // Закрытый вид - только карточки в ряд
    return (
      <div className="px-2 py-2">
        <div className="flex flex-col gap-2">
          {allItems.slice(0, 4).map((item) => (
            <div key={`${item.type}-${item.id}`} className="relative shrink-0">
            <button
              onClick={() => handleClick(item)}
              className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 hover:bg-zinc-700 transition-all group relative"
              title={item.name}
            >
              <MusicCover
                src={item.image}
                className={`w-full h-full ${item.type === "artist" ? "rounded-full" : "rounded-lg"}`}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
            {isNowPlaying(item) && (
              <div className="absolute bottom-1 right-1 rounded-sm bg-black/50 px-1.5 py-1 backdrop-blur">
                <NowPlayingBars />
              </div>
            )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Открытый вид - карточки с названиями
  return (
    <div className="px-2 py-2">
      <div className="px-4 mb-3 flex items-center justify-between gap-2">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-[11px] font-semibold text-zinc-300">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeFilter === "all" ? "bg-white text-black" : "hover:bg-white/10"
            }`}
          >
            {t("sidebar.recently_played")}
          </button>
          <button
            onClick={() => setActiveFilter("playlists")}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeFilter === "playlists" ? "bg-white text-black" : "hover:bg-white/10"
            }`}
          >
            {t("sidebar.playlist")}
          </button>
          <button
            onClick={() => setActiveFilter("artists")}
            className={`px-2.5 py-1 rounded-full transition-colors ${
              activeFilter === "artists" ? "bg-white text-black" : "hover:bg-white/10"
            }`}
          >
            {t("sidebar.artist")}
          </button>
        </div>
      </div>
      <div className="space-y-1">
        {filteredItems.map((item) => {
          const active = isNowPlaying(item);
          return (
          <button
            key={`${item.type}-${item.id}`}
            onClick={() => handleClick(item)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
              active ? "bg-white/5 hover:bg-white/10" : "hover:bg-white/10"
            }`}
          >
            <div className="shrink-0 relative">
              <MusicCover
                src={item.image}
                className={`w-10 h-10 ${item.type === "artist" ? "rounded-full" : "rounded-md"} shadow-md`}
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-zinc-200 group-hover:text-white truncate">
                {item.name}
              </p>
              <p className="text-xs text-zinc-500">
                {item.type === "artist" ? t("sidebar.artist") : t("sidebar.playlist")}
              </p>
            </div>
            {active && <NowPlayingBars className="ml-2" />}
          </button>
        )})}
      </div>
    </div>
  );
};

export default RecentItems;
