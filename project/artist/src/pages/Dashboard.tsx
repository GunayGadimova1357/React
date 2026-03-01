import { Link } from "react-router-dom";
import { Play, Disc, ArrowUpRight, Activity } from "lucide-react";
import { dashboardData } from "@/data/dashboard";
import { releasesData } from "@/data/releases";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/useAuth";
import { useState, useEffect } from "react";
import { getMyAlbumsCount, getMyArtistAlbums, type AlbumResponseDto } from "@/services/artistAlbumsApi";
import { toast } from "react-hot-toast";

const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-6 w-40 rounded bg-zinc-900/70" />
        <div className="mt-2 h-4 w-64 rounded bg-zinc-900/60" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-6 h-48">
          <div className="h-3 w-20 rounded bg-zinc-900/70" />
          <div className="mt-12 h-10 w-20 rounded bg-zinc-900/60" />
          <div className="mt-3 h-3 w-28 rounded bg-zinc-900/60" />
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-4 h-48 flex gap-4">
          <div className="h-32 w-32 rounded-xl bg-zinc-900/70" />
          <div className="flex flex-1 flex-col justify-between py-1">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-zinc-900/70" />
              <div className="h-4 w-40 rounded bg-zinc-900/60" />
              <div className="h-3 w-20 rounded bg-zinc-900/60" />
            </div>
            <div className="h-3 w-20 rounded bg-zinc-900/60" />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 h-48 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-900 bg-zinc-900/20">
            <div className="h-3 w-24 rounded bg-zinc-900/70" />
          </div>
          <div className="space-y-3 p-4">
            <div className="h-3 w-52 rounded bg-zinc-900/60" />
            <div className="h-3 w-44 rounded bg-zinc-900/60" />
            <div className="h-3 w-48 rounded bg-zinc-900/60" />
          </div>
          <div className="px-4 pb-4">
            <div className="h-3 w-24 rounded bg-zinc-900/60" />
          </div>
        </div>
      </div>

      <div className="h-px bg-zinc-900 mt-4" />
    </div>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [albumsCount, setAlbumsCount] = useState(0);
  const [lastRelease, setLastRelease] = useState<AlbumResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        getMyAlbumsCount(),
        getMyArtistAlbums()
      ])
        .then(([count, albums]) => {
          setAlbumsCount(count);
          // Get the most recent album (first in the list, assuming sorted by date)
          setLastRelease(albums[0] || null);
        })
        .catch((e) => {
          console.error("Failed to load dashboard data:", e);
          toast.error("Failed to load dashboard data");
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <DashboardSkeleton />;
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">{t("dashboard.welcome")}</h1>
        <p className="text-sm text-zinc-500 mt-1">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-6 flex flex-col justify-between h-48 hover:border-zinc-800 transition-colors">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-zinc-500">{t("dashboard.library")}</span>
            <Disc size={16} className="text-zinc-700" />
          </div>
          <div className="mt-auto">
             <h3 className="text-4xl font-semibold text-zinc-100 tracking-tight">{albumsCount}</h3>
             <p className="text-xs text-zinc-500 font-medium mt-1">{t("dashboard.active_releases")}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-4 flex gap-4 items-center h-48 group hover:border-zinc-800 transition-colors">
          <div className="h-32 w-32 flex-shrink-0 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
            {lastRelease?.coverUrl ? (
              <img src={lastRelease.coverUrl} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" alt="" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-zinc-700 font-medium">{t("dashboard.no_cover")}</div>
            )}
          </div>
          <div className="flex flex-col justify-between h-32 py-1">
            <div>
              <span className="text-[11px] font-semibold text-emerald-500">{t("dashboard.latest_release")}</span>
              <h3 className="text-sm font-semibold text-zinc-100 mt-1 line-clamp-2 leading-snug">{lastRelease?.albumName}</h3>
              <p className="text-xs text-zinc-500 mt-1">{lastRelease?.isSingle ? t("releases.types.single") : t("releases.types.album")}</p>
            </div>
            <Link to="/releases" className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
              {t("dashboard.manage")} <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
          

      </div>

      <div className="h-px bg-zinc-900 mt-4" />
    </div>
  );
};

export default Dashboard;
