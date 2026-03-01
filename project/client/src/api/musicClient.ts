import axios from "axios";
import { getAccessToken } from "@/services/TokenStore";

export const musicApi = axios.create({
  baseURL: import.meta.env.VITE_MUSIC_API_URL,
  withCredentials: true,
});

musicApi.interceptors.request.use((config) => {
  const t = getAccessToken();
  if (t) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});
