import axios from "axios";
import i18next from "i18next";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/services/TokenStore";

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  withCredentials: true, // refresh-cookie
});

export const musicApi = axios.create({
  baseURL: import.meta.env.VITE_MUSIC_API_URL,
  withCredentials: true,
});

function readAccessFromResponse(payload: any): string | null {
  const p = payload ?? {};
  return (
    p?.data?.token ??
    p?.data?.Token ??
    p?.Data?.token ??
    p?.Data?.Token ??
    p?.token ??
    p?.Token ??
    null
  );
}

function isAuthRefreshRequest(config: any): boolean {
  const url = config?.url ?? "";
  return url.includes("/Auth/refresh");
}

function attachRequestInterceptor(api: typeof authApi) {
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    config.headers = config.headers ?? {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = i18next.language || "en";

    return config;
  });
}

attachRequestInterceptor(authApi);
attachRequestInterceptor(musicApi);

let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = authApi
      .post(
        "/Auth/refresh",
        {},
        {
          // чтобы request interceptor не добавил старый токен
          headers: { Authorization: "" as any },
        },
      )
      .then((res) => {
        const newToken = readAccessFromResponse(res.data);
        if (!newToken) throw new Error("No access token in refresh response");
        setAccessToken(newToken);
        return newToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function attachResponseInterceptor(api: typeof authApi) {
  api.interceptors.response.use(
    (r) => r,
    async (error) => {
      const original = error.config || {};

      // если refresh сам упал — выходим
      if (error?.response?.status === 401 && isAuthRefreshRequest(original)) {
        clearAccessToken();
        return Promise.reject(error);
      }

      if (error?.response?.status === 401 && !original._retry) {
        original._retry = true;

        try {
          const newToken = await doRefresh();
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch {
          clearAccessToken();
        }
      }

      return Promise.reject(error);
    },
  );
}

attachResponseInterceptor(authApi);
attachResponseInterceptor(musicApi);
