let ACCESS_TOKEN: string | null = localStorage.getItem("token");

export function setAccessToken(t: string) {
  ACCESS_TOKEN = t;
  localStorage.setItem("token", t);
}

export function getAccessToken(): string | null {
  return ACCESS_TOKEN;
}

export function clearAccessToken() {
  ACCESS_TOKEN = null;
  localStorage.removeItem("token");
}