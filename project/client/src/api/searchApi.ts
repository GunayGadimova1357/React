import { musicApi } from "./clients";

export type SearchResultType = "song" | "artist" | "album" | "playlist";

export interface SearchResultItem {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle?: string;
  coverUrl?: string;
}

export interface SearchResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  items: SearchResultItem[];
}

export const searchApi = {
  search: async (
    query: string,
    page: number = 1,
    pageSize: number = 20,
    signal?: AbortSignal,
  ): Promise<SearchResponse> => {
    const res = await musicApi.get<SearchResponse>("/search", {
      params: {
        query,
        page,
        pageSize,
      },
      signal,
    });
    return res.data;
  },
};
