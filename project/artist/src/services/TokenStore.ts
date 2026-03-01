const KEY = "artist_access_token";
const USER_NAME_KEY = "artist_user_name";
const EMAIL_KEY = "artist_email";
const AVATAR_KEY = "artist_avatar_url";

export function getAccessToken(): string | null {
  return localStorage.getItem(KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(AVATAR_KEY);
}

export function getUserName(): string | null {
  return localStorage.getItem(USER_NAME_KEY);
}

export function setUserName(name: string) {
  localStorage.setItem(USER_NAME_KEY, name);
}

export function getEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

export function setEmail(email: string) {
  localStorage.setItem(EMAIL_KEY, email);
}

export function getAvatarUrl(): string | null {
  return localStorage.getItem(AVATAR_KEY);
}

export function setAvatarUrl(url: string) {
  localStorage.setItem(AVATAR_KEY, url);
}
