import { musicApi } from "../api/clients";

export interface Genre {
  id: string;
  name: string;
}

export const GenreService = {
  getAll: async (query?: string): Promise<Genre[]> => {
    const res = await musicApi.get("/genres", {
      params: { query }
    });
    return res.data;
  }
};