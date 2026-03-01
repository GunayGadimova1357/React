import axios from "axios";

export type SearchItemType = "song" | "artist" | "album" | "playlist";

export interface SearchResultItemDto {
    type: SearchItemType;
    id: string;
    title: string;
    subtitle?: string;
    coverUrl?: string;
}

export interface SearchResponseDto {
    page: number;
    pageSize: number;
    total: number;
    items: SearchResultItemDto[];
}

const API_BASE = "http://localhost:5191/api";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: false,
});

export async function searchAll(query: string, page = 1, pageSize = 8) {
  const res = await api.get<SearchResponseDto>("/Search", {
    params: { query, page, pageSize },
  });
  return res.data;
}