import { musicApi } from "./clients";

export interface PlaylistInfo {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  songsCount: number;
}

export interface UpdatePlaylistRequest {
  title?: string;
  description?: string;
}

export const playlistsApi = {
  getMyPlaylists: async (): Promise<PlaylistInfo[]> => {
    const res = await musicApi.get("/playlists/my");
    return res.data;
  },

  getPlaylistById: async (id: string) => {
    
    const res = await musicApi.get(`/playlists/${id}`);
    return res.data;
  },

  create: async (title: string, description?: string) => {
    const res = await musicApi.post("/playlists", { 
        title: title, 
        description: description });
    return res.data;
  },

  update: async (playlistId: string, data: UpdatePlaylistRequest) => {
    const res = await musicApi.put(`/playlists/${playlistId}`, data);
    return res.data;
  },

  delete: async (playlistId: string) => {
    return await musicApi.delete(`/playlists/${playlistId}`);
  },

  addSongToPlaylist: async (playlistId: string, songId: string) => {
    const res = await musicApi.post(`/playlists/${playlistId}/songs/${songId}`);
    return res.data;
  },

  removeSongFromPlaylist: async (playlistId: string, songId: string) => {
    return await musicApi.delete(`/playlists/${playlistId}/songs/${songId}`);
  },

  updateCover: async (playlistId: string, file: File) => {
    const formData = new FormData();
    formData.append("cover", file);

    const res = await musicApi.put(`/playlists/${playlistId}/cover`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  removeCover: async (playlistId: string) => {
    return await musicApi.delete(`/playlists/${playlistId}/cover`);
  }
};