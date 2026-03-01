import { musicApi } from "./clients";

export interface GenreResponse {
  id: string;
  name: string;
}

export interface GenreDetailResponse extends GenreResponse {
  songs: {
    id: string;
    title: string;
    artistName: string;
    coverUrl: string;
    duration: number;
    albumTitle?: string;
  }[];
}

export const genreApi = {
  getGenres: async (query?: string, signal?: AbortSignal): Promise<GenreResponse[]> => {
    const res = await musicApi.get<GenreResponse[]>("/genres", {
      params: { query },
      signal
    });
    return res.data;
  },

  getGenreSongs: async (genreId: string): Promise<GenreDetailResponse> => {
    const res = await musicApi.get<GenreDetailResponse>(`/genres/${genreId}/songs`);
    return res.data;
  }
};