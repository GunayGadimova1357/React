import { useMemo, useState, useEffect } from "react";
import { analyticsData } from "@/data/analytics";
import { tracksData } from "@/data/tracks";
import { useTranslation } from "react-i18next";
import { getArtistOverview, getArtistTopTracks, getArtistStreamsPerDay } from "@/services/artistAnalyticalApi";
import { toast } from "react-hot-toast";

const Analytics = () => {
  const { t } = useTranslation();
  const [overviewData, setOverviewData] = useState(analyticsData.overview);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState(analyticsData.lastUpdated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        console.log("Loading analytics data...");

        const [overview, topTracksData] = await Promise.all([
          getArtistOverview(),
          getArtistTopTracks()
        ]);

        console.log("Analytics data loaded successfully:", { overview, topTracksData });

        const transformedOverview = [
          {
            label: "Total Streams",
            value: overview.totalStreams.toLocaleString(),
            change: `${overview.totalStreamsChangePct >= 0 ? '+' : ''}${overview.totalStreamsChangePct}%`,
            isUp: overview.totalStreamsChangePct >= 0
          },
          {
            label: "Monthly Listeners",
            value: overview.monthlyListeners.toLocaleString(),
            change: `${overview.monthlyListenersChangePct >= 0 ? '+' : ''}${overview.monthlyListenersChangePct}%`,
            isUp: overview.monthlyListenersChangePct >= 0
          },
          {
            label: "Avg. Listen Time",
            value: `${Math.floor(overview.avgListenSeconds / 60)}:${(overview.avgListenSeconds % 60).toString().padStart(2, '0')}`,
            change: `${overview.avgListenSecondsChangePct >= 0 ? '+' : ''}${overview.avgListenSecondsChangePct}%`,
            isUp: overview.avgListenSecondsChangePct >= 0
          }
        ];

        setOverviewData(transformedOverview);
        setTopTracks(topTracksData);
        setLastUpdated(overview.lastUpdatedUtc);
      } catch (error: any) {
        console.error("Failed to load analytics:", error);
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });

        console.log("Using mock data as fallback due to API error");
        setOverviewData(analyticsData.overview);
        setTopTracks(tracksData.slice(0, 5));
        setLastUpdated(analyticsData.lastUpdated);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const lastUpdate = new Date(lastUpdated).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="h-8 w-48 bg-zinc-900/70 rounded" />
          <div className="h-6 w-32 bg-zinc-900/60 rounded" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-6">
              <div className="h-4 w-24 bg-zinc-900/70 rounded mb-3" />
              <div className="h-8 w-16 bg-zinc-900/60 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">{t("analytics.title")}</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {t("analytics.subtitle")}
          </p>
        </div>
        <div className="inline-flex items-center text-xs font-medium text-zinc-500 bg-zinc-900/50 px-3 py-2 rounded-xl border border-zinc-800 w-fit">
          {t("analytics.last_update")}: {lastUpdate}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {overviewData.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-6 transition-colors hover:border-zinc-800"
          >
            <p className="text-sm font-medium text-zinc-500">
              {t(`analytics.overview.${item.label.toLowerCase().replace(/\s+/g, '_')}`) || item.label}
            </p>
            <div className="mt-3 flex items-baseline justify-between">
              <h3 className="text-2xl font-semibold text-zinc-100 tracking-tight">
                {item.value}
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                  item.isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6">

        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 overflow-hidden">
          <div className="border-b border-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-zinc-200">
              {t("analytics.popularity")}
            </h2>
          </div>
          <div className="divide-y divide-zinc-900">
            {topTracks.map((track, i) => (
              <div
                key={track.songId || i}
                className="flex items-center justify-between p-4 hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-zinc-600 w-4">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {track.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {track.streams?.toLocaleString() || 0} streams
                    </p>
                  </div>
                </div>
                <div className="w-24">
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-100/20 rounded-full"
                      style={{ width: `${Math.max(10, 100 - i * 15)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;