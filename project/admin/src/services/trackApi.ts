import { musicApi } from "../api/clients";

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName?: string;
  albumId?: string;
  albumName?: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  genreIds?: string[];
  genres?: string[];
}

const mapTrack = (data: any): Track => ({
  id: data.id,
  title: data.title,
  artistId: data.artistId,
  artistName: data.artistName,
  albumId: data.albumId || undefined,
  albumName: data.albumName,
  duration: data.duration,
  audioUrl: data.fileUrl,
  coverUrl: data.coverUrl,
  genreIds: data.genreIds || [],
  genres: data.genres || [],
});

export async function getTracks(): Promise<Track[]> {
  const res = await musicApi.get("/songs");
  return res.data.map(mapTrack);
}

export async function uploadTrack(
  title: string, 
  artistId: string, 
  audioFile: File, 
  albumId?: string, 
  coverFile?: File,
  genreIds: string[] = []
): Promise<Track> {
  const formData = new FormData();
  formData.append("Title", title);
  formData.append("ArtistId", artistId);
  formData.append("AudioFile", audioFile);
  
  if (albumId) formData.append("AlbumId", albumId);
  if (coverFile) formData.append("CoverFile", coverFile);

  // Ключ "GenreIds" должен совпадать с именем в UploadSongRequestDto
  if (genreIds && genreIds.length > 0) {
    genreIds.forEach(id => formData.append("GenreIds", id));
  }

  const res = await musicApi.post("/songs/upload", formData);
  return mapTrack(res.data);
}

export async function updateTrack(
  id: string, 
  title: string, 
  audioFile?: File, 
  albumId?: string, 
  coverFile?: File,
  genreIds: string[] = []
): Promise<Track> {
  const formData = new FormData();
  formData.append("Title", title);
  
  if (audioFile) formData.append("AudioFile", audioFile);
  
  if (albumId) {
    formData.append("AlbumId", albumId);
  } else {
    formData.append("AlbumId", ""); 
  }

  if (coverFile) formData.append("CoverFile", coverFile);

  if (genreIds && genreIds.length > 0) {
    genreIds.forEach(id => formData.append("GenresIds", id));
  }

  const res = await musicApi.put(`/songs/${id}`, formData);
  return mapTrack(res.data);
}

export async function deleteTrack(id: string): Promise<void> {
  await musicApi.delete(`/songs/${id}`);
}