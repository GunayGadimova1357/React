import { usePlayer } from "@/context/PlayerContext";
import MusicCover from "./MusicCover";
import { Play, Pause } from "lucide-react";

type SongItemProps = {
  image: string;
  name: string;
  desc: string;
  id: string;
};

const SongItem = ({ image, name, desc, id }: SongItemProps) => {
  const { playWithId, track, playStatus } = usePlayer();

  const isActive = track?.id === id;

  const handleClick = () => {
    void playWithId(id);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <div className="relative mb-2">
        <MusicCover src={image} alt={name} className="w-full aspect-square" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className={`absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 shadow-lg transition-opacity duration-150 ${
            isActive && playStatus ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {isActive && playStatus ? (
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

export default SongItem;