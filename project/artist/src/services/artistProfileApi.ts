import { musicApi } from "@/api/clients";

export type ArtistMeDto = {
  id: string;
  artistName: string;
  photoUrl?: string | null;
  bio?: string | null;
};

export async function getMe() {
  const res = await musicApi.get<ArtistMeDto>("/artist/account/me");
  return res.data;
}

export async function updateProfile(payload: { artistName: string; bio?: string | null }) {
  const res = await musicApi.put<ArtistMeDto>("/artist/account/profile", payload);
  return res.data;
}

export async function uploadPhoto(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await musicApi.post<{ photoUrl: string }>(
    "/artist/account/photo",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data.photoUrl;
}
