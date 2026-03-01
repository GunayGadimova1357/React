import { musicApi } from "./musicClient";
import type { AlbumData } from "@/types/AlbumData";
import type { SongData } from "@/types/SongData";

export type AlbumWithSongs = AlbumData & { songs: SongData[] }; 

export const albumApi = {
  async getAll(): Promise<AlbumData[]> {
    const res = await musicApi.get<AlbumData[]>("/Albums");
    return res.data;
  },

  async getById(id: string): Promise<any> {
    const res = await musicApi.get(`/Albums/${id}`);
    return res.data;
  },
};
