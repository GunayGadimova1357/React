export interface SongData {
  id: string;
  title: string;
  artistId: string;
  artistName?: string | null;
  albumId?: string | null;
  albumName?: string | null;
  fileUrl: string;
  coverUrl: string;
  duration: number;
}