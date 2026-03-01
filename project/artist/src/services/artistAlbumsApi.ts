import { musicApi } from "@/api/clients";

export type AlbumResponseDto = {
  id: string;
  albumName: string;
  artistId: string;
  artistName: string;
  coverUrl?: string | null;
  releaseDate: string;
  isSingle: boolean;
  year?: number | null;
};

export type CreateArtistAlbumPayload = {
  albumName: string;
  releaseDate: string;
  isSingle: boolean;
  coverFile?: File | null;
};

export type UpdateArtistAlbumPayload = {
  albumName: string;
  releaseDate: string;
  isSingle: boolean;
  coverFile?: File | null;
};

function toFormData(payload: {
  albumName: string;
  releaseDate: string;
  isSingle: boolean;
  coverFile?: File | null;
}) {
  const fd = new FormData();

  fd.append("AlbumName", payload.albumName);
  fd.append("ReleaseDate", new Date(payload.releaseDate).toISOString());
  fd.append("IsSingle", String(payload.isSingle));

  if (payload.coverFile) {
    fd.append("CoverUrl", payload.coverFile);
  }

  return fd;
}

export async function getMyArtistAlbums() {
  const res = await musicApi.get<AlbumResponseDto[]>("/artist/albums/my");
  return res.data;
}

export async function createArtistAlbum(payload: CreateArtistAlbumPayload) {
  const fd = toFormData(payload);
  const res = await musicApi.post<AlbumResponseDto>("/artist/albums", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateArtistAlbum(id: string, payload: UpdateArtistAlbumPayload) {
  const fd = toFormData(payload);
  const res = await musicApi.put<AlbumResponseDto>(`/artist/albums/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteArtistAlbum(id: string) {
  const res = await musicApi.delete<{ success: boolean }>(`/artist/albums/${id}`);
  return res.data;
}

export async function getMyAlbumsCount(): Promise<number> {
  const res = await musicApi.get<{ count: number }>("/artist/albums/my/count");
  return res.data.count;
}
