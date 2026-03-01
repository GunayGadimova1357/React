import { musicApi } from "@/api/clients";

export async function getArtistOverview(days = 30) {
  const res = await musicApi.get("/artist/analytics/overview", { params: { days } });
  return res.data as {
    days: number;
    totalStreams: number;
    monthlyListeners: number;
    avgListenSeconds: number;
    lastUpdatedUtc: string;
  };
}

export async function getArtistTopTracks(days = 28, take = 5) {
  const res = await musicApi.get("/artist/analytics/top-tracks", { params: { days, take } });
  return res.data as { songId: string; title: string; streams: number }[];
}

export async function getArtistStreamsPerDay(days = 28) {
  const res = await musicApi.get("/artist/analytics/streams-per-day", { params: { days } });
  return res.data as { date: string; streams: number }[];
}
