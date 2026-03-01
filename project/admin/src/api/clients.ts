import axios from "axios";

const TOKEN_KEY = "admin_access_token";

function readAccessFromResponse(payload: any): string | null {
  const p = payload ?? {};
  return (
    p?.data?.token ?? p?.data?.Token ??
    p?.Data?.token ?? p?.Data?.Token ??
    p?.token ?? p?.Token ??
    null
  );
}

function isAuthRefreshRequest(config: any): boolean {
  const url = config?.url ?? "";
  return url.includes("/Auth/refresh");
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  withCredentials: true,
});

export const musicApi = axios.create({
  baseURL: import.meta.env.VITE_MUSIC_API_URL,
  withCredentials: true,
});

// attach access token
authApi.interceptors.request.use((config) => {
  const t = getAccessToken();
  if (t) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function doRefresh(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = authApi
      .post("/Auth/refresh", {}, { headers: { Authorization: "" as any } })
      .then((res) => {
        const newToken = readAccessFromResponse(res.data);
        if (!newToken) throw new Error("No access token in refresh response");
        setAccessToken(newToken);
        return newToken;
      })
      .finally(() => (refreshPromise = null));
  }
  return refreshPromise;
}

authApi.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config || {};

    if (error?.response?.status === 401 && isAuthRefreshRequest(original)) {
      clearAccessToken();
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const t = await doRefresh();
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${t}`;
        return authApi(original);
      } catch {
        clearAccessToken();
      }
    }

    return Promise.reject(error);
  }
);
