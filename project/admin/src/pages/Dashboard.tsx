import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Loader2 } from "lucide-react";

import { StatCard } from "../components/ui/StatCard";
import {
  getMusicDashboardStats,
  getUsersCount,
  getListenersGrowth,
  getTopArtists,
  getMonthlyListenersCount,
} from "../services/adminStats";

type StatsState = {
  artists: number | null;
  tracks: number | null;
  users: number | null;
  monthlyListeners: number | string | null;
};

type GrowthPoint = {
  month: string;
  listeners: number;
};

type TopArtistPoint = {
  name: string;
  listeners: number;
};

export function Dashboard() {
  const [stats, setStats] = useState<StatsState>({
    artists: null,
    tracks: null,
    users: null,
    monthlyListeners: null,
  });

  const [growth, setGrowth] = useState<GrowthPoint[]>([]);
  const [top, setTop] = useState<TopArtistPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const safeFetch = async (promise: Promise<any>) => {
          try {
            const res = await promise;
            return res?.data || res;
          } catch (e) {
            console.error("API Fetch error:", e);
            return null;
          }
        };

        const [music, users, growthRes, topRes, monthlyCount] = await Promise.all([
          safeFetch(getMusicDashboardStats()),
          safeFetch(getUsersCount()),
          safeFetch(getListenersGrowth()),
          safeFetch(getTopArtists()),
          safeFetch(getMonthlyListenersCount()),
        ]);

        if (!alive) return;

        setStats({
          artists: music?.artists ?? music?.Artists ?? 0,
          tracks: music?.tracks ?? music?.Tracks ?? 0,
          users: users?.users ?? users?.Users ?? 0,
          monthlyListeners: monthlyCount ?? music?.monthlyListeners ?? music?.MonthlyListeners ?? "0",
        });

        if (Array.isArray(growthRes)) {
          setGrowth(growthRes.map((x: any) => ({
            month: String(x?.month ?? x?.Month ?? ""),
            listeners: Number(x?.listeners ?? x?.Listeners ?? 0),
          })));
        }

        if (Array.isArray(topRes)) {
          setTop(topRes.map((x: any) => ({
            name: String(x?.name ?? x?.Name ?? x?.artistName ?? "Unknown"),
            listeners: Number(x?.listeners ?? x?.Listeners ?? 0),
          })));
        }

      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchData();
    return () => { alive = false; };
  }, []);

  const statValue = (v: any) => (v === null ? "…" : v);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Overview of platform statistics
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Artists" value={statValue(stats.artists)} loading={loading} />
        <StatCard title="Tracks" value={statValue(stats.tracks)} loading={loading} />
        <StatCard title="Users" value={statValue(stats.users)} loading={loading} />
        <StatCard title="Monthly listeners" value={statValue(stats.monthlyListeners)} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4">
          <h2 className="mb-4 text-sm font-medium text-zinc-300">Listener growth (M)</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth}>
                <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", color: "#fafafa" }}
                />
                <Line type="monotone" dataKey="listeners" stroke="#e4e4e7" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#fafafa" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {!loading && growth.length === 0 && <p className="mt-3 text-xs text-zinc-500 text-center">No data yet</p>}
        </div>
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-4">
          <h2 className="mb-4 text-sm font-medium text-zinc-300">Top artists (M listeners)</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              {top.length > 0 ? (
                <BarChart data={top}>
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{ background: "#09090b", border: "1px solid #27272a", borderRadius: "8px", color: "#fafafa" }}
                  />
                  <Bar
                    dataKey="listeners"
                    fill="#d4d4d8"
                    radius={[6, 6, 0, 0]}
                    activeBar={{ fill: "#fafafa" }}
                    barSize={40}
                  />
                </BarChart>
              ) : (
                <div className="flex h-full items-center justify-center">
                  {loading ? <Loader2 className="animate-spin text-zinc-800" /> : <span className="text-xs text-zinc-600">No data yet</span>}
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>



      </div>
    </div>
  );
}