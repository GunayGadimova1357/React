import type { SongData } from "@/types/SongData";
import type { AlbumData } from "@/types/AlbumData";

export type UiSong = {
  id: string;
  name: string;
  artist: string;
  artistId?: string;
  image: string;
  audioUrl: string;
  duration: string;
  albumId?: string | null;
  albumName?: string | null;
  isLiked?: boolean;
};

export type UiAlbum = {
  id: string;
  name: string;
  desc: string;
  image: string;
};

function secToTime(s: number): string {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function mapSongToUi(x: SongData): UiSong {
  return {
    id: x.id,
    name: x.title,
    artist: x.artistName ?? "Unknown Artist",
    artistId: x.artistId,
    image: x.coverUrl,
    audioUrl: x.fileUrl,
    duration: secToTime(x.duration),
    albumId: x.albumId ?? null,
    albumName: x.albumName ?? null,
  };
}

export function mapAlbumToUi(x: AlbumData): UiAlbum {
  return {
    id: x.id,
    name: x.albumName,
    desc: x.artistName,
    image: x.coverUrl,
  };
}
