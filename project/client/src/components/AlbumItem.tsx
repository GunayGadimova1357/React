import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import MusicCover from "./MusicCover";
import { usePlayer } from "@/context/PlayerContext";

type AlbumItemProps = {
  image: string;
  name: string;
  desc: string;
  id: string;
};

const AlbumItem = ({ image, name, desc, id }: AlbumItemProps) => {
  const navigate = useNavigate();
  const { tracks, track, playStatus, playWithId, pause } = usePlayer();

  const albumTracks = useMemo(
    () => tracks.filter((t) => t.albumId === id),
    [tracks, id],
  );

  const isAlbumActive = !!track?.albumId && track.albumId === id;

  const handleCardClick = () => {
    // По умолчанию поведение как раньше — переход на страницу альбома
    navigate(`/album/${id}`);
  };

  const handlePlayPauseClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isAlbumActive && playStatus) {
      pause();
      return;
    }

    if (albumTracks.length > 0) {
      const first = albumTracks[0];
      void playWithId(first.id, albumTracks);
    } else {
      // Если треков нет, просто открываем страницу альбома
      navigate(`/album/${id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <div className="relative mb-2">
        <MusicCover src={image} alt={name} className="w-full aspect-square" />

        <button
          type="button"
          onClick={handlePlayPauseClick}
          className={`absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 shadow-lg transition-opacity duration-150 ${
            isAlbumActive && playStatus ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {isAlbumActive && playStatus ? (
            <Pause className="w-4 h-4 text-zinc-100" />
          ) : (
            <Play className="w-4 h-4 text-zinc-100" fill="currentColor" />
          )}
        </button>
      </div>

      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc}</p>
    </div>
  );
};

export default AlbumItem;