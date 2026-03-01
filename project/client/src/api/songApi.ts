import { musicApi } from "./musicClient";
import type { SongData } from "@/types/SongData";

export const songApi = {
  async getAll(): Promise<SongData[]> {
    const res = await musicApi.get<SongData[]>("/Songs");
    return res.data;
  },

  async getById(id: string): Promise<SongData> {
    const res = await musicApi.get<SongData>(`/Songs/${id}`);
    return res.data;
  },
};