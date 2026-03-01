import { musicApi } from "../api/clients";

export interface Artist {
  id: string;
  name: string
  coverUrl?: string;
}

const mapArtist = (data: any): Artist => ({
  id: data.id,
  name: data.artistName,
  coverUrl: data.photoUrl,
});

export async function getArtists(): Promise<Artist[]> {
  const res = await musicApi.get("/artists");
  return res.data.map(mapArtist);
}

export async function getArtistById(id: string): Promise<Artist> {
  const res = await musicApi.get(`/artists/${id}`);
  return mapArtist(res.data);
}

export async function createArtist(name: string, photo?: File): Promise<Artist> {
  const formData = new FormData();
  formData.append("ArtistName", name); 
  if (photo) {
    formData.append("PhotoFile", photo);
  }

  const res = await musicApi.post("/artists", formData);
  return mapArtist(res.data);
}

export async function updateArtist(id: string, name: string, photo?: File): Promise<Artist> {
  const formData = new FormData();
  formData.append("ArtistName", name);
  if (photo) {
    formData.append("PhotoFile", photo);
  }

  const res = await musicApi.put(`/artists/${id}`, formData);
  return mapArtist(res.data);
}

export async function deleteArtist(id: string): Promise<void> {
  await musicApi.delete(`/artists/${id}`);
}