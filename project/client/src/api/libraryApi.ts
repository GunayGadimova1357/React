import { musicApi } from "./clients";

export interface SavedAlbum {
  id: string;
  albumName: string;
  coverUrl: string;
  artistId: string;
  savedAt: string;
}

export interface SavedSong {
  id: string;
  title: string;
  fileUrl: string;
  coverUrl: string;
  duration: string;
  artistId: string;
  albumId: string;
  savedAt: string;
}

export const libraryApi = {
  getSavedAlbums: async (): Promise<SavedAlbum[]> => {
    const res = await musicApi.get("/library/albums");
    return res.data;
  },

  saveAlbum: async (albumId: string) => {
    return await musicApi.post(`/library/albums/${albumId}`);
  },

  unsaveAlbum: async (albumId: string) => {
    return await musicApi.delete(`/library/albums/${albumId}`);
  },

  getSavedSongs: async (): Promise<SavedSong[]> => {
    const res = await musicApi.get("/library/songs");
    return res.data;
  },

  saveSong: async (songId: string) => {
    return await musicApi.post(`/library/songs/${songId}`);
  },
  
  unsaveSong: async (songId: string) => {
    return await musicApi.delete(`/library/songs/${songId}`);
  }
};