import { authApi } from "../api/clients";

export type ArtistRequestStatus = "Pending" | "Approved" | "Rejected";
export type ApiArtistRequestStatus = ArtistRequestStatus | 0 | 1 | 2;

export interface AdminArtistRequestItem {
  id: string;
  userId: string;
  userName: string;
  email: string;
  stageName: string;
  message: string | null;
  status: ApiArtistRequestStatus;
  createdAt: string;
  reviewedAt?: string | null;
  rejectReason?: string | null;
}

export interface RejectRequestDto {
  reason: string;
}

export function normalizeStatus(s: ApiArtistRequestStatus): ArtistRequestStatus {
  if (typeof s === "number") {
    if (s === 1) return "Approved";
    if (s === 2) return "Rejected";
    return "Pending";
  }
  return s;
}

export const adminArtistRequestsApi = {
  getAll: (status?: ArtistRequestStatus) =>
    authApi
      .get<AdminArtistRequestItem[]>("/admin/artist-requests", {
        params: status ? { status } : undefined,
      })
      .then((r) =>
      r.data.map((x) => ({
        ...x,
        status: normalizeStatus(x.status),
      }))),

  approve: (id: string) =>
    authApi
      .post<{ success: boolean }>(`/admin/artist-requests/${id}/approve`)
      .then((r) => r.data),

  reject: (id: string, reason: string) =>
    authApi
      .post<{ success: boolean }>(`/admin/artist-requests/${id}/reject`, {
        reason,
      } satisfies RejectRequestDto)
      .then((r) => r.data),
};
