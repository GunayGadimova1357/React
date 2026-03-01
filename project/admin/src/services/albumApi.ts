import { musicApi } from "../api/clients";

export interface Album {
  id: string;
  title: string;
  coverUrl?: string;
  artistId: string;
  artistName?: string;
}

const mapAlbum = (data: any): Album => ({
  id: data.id,
  title: data.albumName,
  coverUrl: data.coverUrl,
  artistId: data.artistId,
  artistName: data.artistName,  
});

export async function getAlbums(): Promise<Album[]> {
  const res = await musicApi.get("/albums");
  console.log("[API] GET /albums response:", res.data);
  return res.data.map(mapAlbum);
}

export async function getAlbumById(id: string): Promise<Album> {
  const res = await musicApi.get(`/albums/${id}`);
  return mapAlbum(res.data);
}

export async function createAlbum(title: string, artistId: string, photo?: File): Promise<string> {
  const formData = new FormData();
  formData.append("AlbumName", title);
  formData.append("ArtistId", artistId);
  if (photo) {
    formData.append("CoverUrl", photo);
  }

  console.log("[API] POST /albums request data:");
  formData.forEach((value, key) => console.log(`  ${key}:`, value));

  const res = await musicApi.post("/albums", formData);
  return res.data; 
}

export async function updateAlbum(id: string, title: string, artistId: string, photo?: File): Promise<Album> {
  const formData = new FormData();
  formData.append("AlbumName", title);
  formData.append("ArtistId", artistId);
  if (photo) {
    formData.append("CoverUrl", photo);
  }
  console.log("updateAlbum payload", { id, title, artistId, photo });

  const res = await musicApi.put(`/albums/${id}`, formData);
  console.log("[API] PUT /albums response:", res.data);
  return mapAlbum(res.data);
}

export async function deleteAlbum(id: string): Promise<{ success: boolean }> {
  const res = await musicApi.delete(`/albums/${id}`);
  return res.data;
}