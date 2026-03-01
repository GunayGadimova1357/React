import { musicApi } from "./clients";

export interface ArtistSong {
  id: string;
  title: string;
  coverUrl: string;
  duration: number;
}

export interface ArtistAlbum {
  id: string;
  title: string;
  coverUrl: string;
  releaseDate: string;
}

export interface ArtistResponse {
  id: string;
  artistName: string;
  photoUrl: string | null;
  bio: string | null;
  songs: ArtistSong[];
  albums: ArtistAlbum[];
}

export const artistApi = {
  getArtistProfile: (id: string) => 
    musicApi.get<ArtistResponse>(`/Artists/${id}`).then(res => res.data),
    
  getAllArtists: () => 
    musicApi.get<ArtistResponse[]>("/Artists").then(res => res.data),
};