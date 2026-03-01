import { authApi, musicApi } from "../api/clients";

export async function getMusicDashboardStats() {
  const res = await musicApi.get("/admin/stats/dashboard");
  return res.data;
}

export async function getUsersCount() {
  const res = await authApi.get("/admin/stats/users");
  return res.data;
}

export async function getListenersGrowth() {
  const res = await musicApi.get("/admin/stats/listeners-growth");
  return res.data;
}

export async function getTopArtists() {
  const res = await musicApi.get("/admin/stats/top-artists");
  return res.data;
}

export async function getMonthlyListenersCount() {
  const res = await musicApi.get("/admin/stats/monthly-listeners");
  return res.data;
}