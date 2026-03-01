import { authApi } from "./clients";

export type ArtistRequestStatus = "Pending" | "Approved" | "Rejected";

export interface CreateArtistRequestDto {
  stageName: string;
  message?: string | null;
}

export interface MyArtistRequestResponse {
  id: string;
  userId: string;
  stageName: string;
  message: string | null;
  status: ArtistRequestStatus;
  createdAt: string;
  reviewedAt: string | null;
  reviewedByAdminId: string | null;
  rejectReason: string | null;
}

export const artistApplicationApi = {
  // отправить заявку (ApplyArtist)
  create: (dto: CreateArtistRequestDto) =>
    authApi.post("/account/artist-request", dto).then((res) => res.data),

  // получить СВОЮ заявку/статус (ApplicationStatus)
  getMy: () =>
    authApi.get<MyArtistRequestResponse>("/account/artist-request").then((res) => res.data),

  // обновить access token после approve, чтобы роль Artist появилась
  refresh: () => authApi.post("/auth/refresh").then((res) => res.data),
};
