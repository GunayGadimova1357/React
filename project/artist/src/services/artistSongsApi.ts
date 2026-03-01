import { musicApi } from "@/api/clients";

export type SongResponseDto = {
  id: string;
  title: string;
  artistId: string;
  artistName?: string | null;
  albumId?: string | null;
  albumName?: string | null;
  fileUrl: string;
  coverUrl: string;
  duration: number;
  genres?: string[];
  genreIds?: string[];
};

export type CreateArtistSongPayload = {
  title: string;
  albumId?: string | null;
  audioFile: File;
  coverFile?: File | null;
  genreIds?: string[];
};

export type UpdateArtistSongPayload = {
  title?: string;
  albumId?: string | null;
  audioFile?: File | null;
  coverFile?: File | null;
  genreIds?: string[];
};

function toFormDataCreate(p: CreateArtistSongPayload) {
  const fd = new FormData();
  fd.append("Title", p.title);
  if (p.albumId) fd.append("AlbumId", p.albumId);
  fd.append("AudioFile", p.audioFile);
  if (p.coverFile) fd.append("CoverFile", p.coverFile);

  if (p.genreIds && p.genreIds.length) {
    p.genreIds.forEach((id) => fd.append("GenreIds", id));
  }

  return fd;
}

function toFormDataUpdate(p: UpdateArtistSongPayload) {
  const fd = new FormData();
  if (p.title !== undefined) fd.append("Title", p.title);

  if (p.albumId !== undefined) {
    if (p.albumId) fd.append("AlbumId", p.albumId);
    else fd.append("AlbumId", "");
  }

  if (p.audioFile) fd.append("AudioFile", p.audioFile);
  if (p.coverFile) fd.append("CoverFile", p.coverFile);

  if (p.genreIds) {
    p.genreIds.forEach((id) => fd.append("GenreIds", id));
  }

  return fd;
}

export async function getMyArtistSongs() {
  const res = await musicApi.get<SongResponseDto[]>("/artist/songs/my");
  return res.data;
}

export async function uploadArtistSong(payload: CreateArtistSongPayload) {
  const fd = toFormDataCreate(payload);
  const res = await musicApi.post<SongResponseDto>("/artist/songs/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateArtistSong(id: string, payload: UpdateArtistSongPayload) {
  const fd = toFormDataUpdate(payload);
  const res = await musicApi.put<SongResponseDto>(`/artist/songs/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteArtistSong(id: string) {
  await musicApi.delete(`/artist/songs/${id}`);
}
