import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminArtistRequestsApi } from "../services/adminArtistRequestsApi";
import type { AdminArtistRequestItem } from "../services/adminArtistRequestsApi";
import { Modal } from "../components/ui/Modal";

type UiStatus = "all" | "pending" | "approved" | "rejected";

function apiStatusToUi(status: any): Exclude<UiStatus, "all"> {
  if (typeof status === "number") {
    if (status === 1) return "approved";
    if (status === 2) return "rejected";
    return "pending";
  }

  const s = String(status ?? "").toLowerCase();
  if (s === "approved") return "approved";
  if (s === "rejected") return "rejected";
  if (s === "pending") return "pending";

  return "pending";
}

function uiToApiStatusParam(s: UiStatus): string | undefined {
  if (s === "pending") return "Pending";
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  return undefined;
}

function fmtDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export function ArtistApplications() {
  const [apps, setApps] = useState<AdminArtistRequestItem[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<UiStatus>("all");
  const [loading, setLoading] = useState(true);

  // MODAL STATE
  const [reviewing, setReviewing] = useState<AdminArtistRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const data = await adminArtistRequestsApi.getAll(
        status === "all" ? undefined : (uiToApiStatusParam(status) as any),
      );

      setApps(data ?? []);
    } catch (e: any) {
      console.error("[ArtistApplications] load error", e);
      toast.error(e?.response?.data ?? "Failed to load applications");
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const approve = async (id: string) => {
    try {
      setActionLoading(true);
      await adminArtistRequestsApi.approve(id);
      toast.success("Approved");
      setReviewing(null);
      await load();
    } catch (e: any) {
      console.error("[ArtistApplications] approve error", e);
      toast.error(e?.response?.data ?? "Approve failed");
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async (id: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Reject reason is required");
      return;
    }

    try {
      setActionLoading(true);
      await adminArtistRequestsApi.reject(id, reason.trim());
      toast.success("Rejected");
      setReviewing(null);
      setRejectReason("");
      await load();
    } catch (e: any) {
      console.error("[ArtistApplications] reject error", e);
      toast.error(e?.response?.data ?? "Reject failed");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return apps
      .filter((a) => {
        const matchesQuery =
          !q ||
          (a.stageName ?? "").toLowerCase().includes(q) ||
          (a.email ?? "").toLowerCase().includes(q) ||
          (a.userName ?? "").toLowerCase().includes(q);

        if (!matchesQuery) return false;

        if (status === "all") return true;

        const ui = apiStatusToUi((a as any).status);
        return ui === status;
      })
      .sort((x, y) => (y.createdAt ?? "").localeCompare(x.createdAt ?? ""));
  }, [apps, query, status]);

  const pendingCount = apps.filter((a) => apiStatusToUi((a as any).status) === "pending").length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Reviews</h1>
          <p className="mt-1 text-sm text-zinc-400">Review and manage incoming artist requests</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
          <span className="text-zinc-500">Pending</span>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200">
            {pendingCount}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by artist, email, or username..."
          className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-100"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as UiStatus)}
          className="admin-select px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <div className="text-sm text-zinc-400">
          {loading ? "Loading..." : `${filtered.length} items`}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-900">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">Artist</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">Email</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-400">User</th>
              <th className="px-4 py-3 text-center font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a) => {
              const ui = apiStatusToUi((a as any).status);
              const isPending = ui === "pending";

              return (
                <tr key={a.id} className="border-t border-zinc-900 hover:bg-zinc-900/40">
                  <td className="px-4 py-3 font-medium">{a.stageName}</td>
                  <td className="px-4 py-3 text-zinc-400">{a.email}</td>
                  <td className="px-4 py-3 text-zinc-400">{a.userName}</td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={
                        ui === "approved"
                          ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400"
                          : ui === "rejected"
                          ? "rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400"
                          : "rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400"
                      }
                    >
                      {ui}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReviewing(a)}
                        className="rounded-md px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800/70"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  No applications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {reviewing && (
        <Modal
          open={true}
          title="Review Artist Request"
          onClose={() => {
            setReviewing(null);
            setRejectReason("");
          }}
        >
          {(() => {
            const ui = apiStatusToUi((reviewing as any).status);
            const isPending = ui === "pending";

            return (
              <div className="space-y-5 pt-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-zinc-400">Stage name</div>
                      <div className="text-lg font-semibold text-zinc-100">{reviewing.stageName}</div>
                    </div>

                    <span
                      className={
                        ui === "approved"
                          ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400"
                          : ui === "rejected"
                          ? "rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400"
                          : "rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400"
                      }
                    >
                      {ui}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-xs text-zinc-500">User</div>
                      <div className="text-sm text-zinc-200">{reviewing.userName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">Email</div>
                      <div className="text-sm text-zinc-200">{reviewing.email}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-xs text-zinc-500">Created</div>
                      <div className="text-sm text-zinc-200">{fmtDate(reviewing.createdAt)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-300">Message from user</div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-200 whitespace-pre-wrap">
                    {reviewing.message?.trim() ? reviewing.message : <span className="text-zinc-500">No message</span>}
                  </div>
                </div>

                {/* Reject reason input (only makes sense for pending) */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-zinc-300">Reject reason</div>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Write reason (required for Reject)..."
                    className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                    disabled={!isPending || actionLoading}
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-zinc-900 pt-4">
                  <button
                    onClick={() => {
                      setReviewing(null);
                      setRejectReason("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200"
                    disabled={actionLoading}
                  >
                    Close
                  </button>

                  <button
                    onClick={() => approve(reviewing.id)}
                    disabled={!isPending || actionLoading}
                    className="rounded-xl bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/20 disabled:opacity-30"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => reject(reviewing.id, rejectReason)}
                    disabled={!isPending || actionLoading || !rejectReason.trim()}
                    className="rounded-xl bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-400/20 disabled:opacity-30"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
