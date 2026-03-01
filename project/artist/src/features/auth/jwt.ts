import { jwtDecode } from "jwt-decode";

const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export function getRolesFromToken(token: string): string[] {
  const decoded: any = jwtDecode(token);

  const raw =
    decoded?.role ??
    decoded?.roles ??
    decoded?.Roles ??
    decoded?.[ROLE_CLAIM];

  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  return [String(raw)];
}

export function isArtistToken(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      return false; // Token expired
    }
    const roles = getRolesFromToken(token);
    return roles.includes("Artist");
  } catch (error) {
    return false; // Invalid token
  }
}
