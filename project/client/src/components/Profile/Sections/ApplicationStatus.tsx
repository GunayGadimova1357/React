import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Clock, CheckCircle2, XCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { artistApplicationApi, ArtistRequestStatus } from "@/api/artistApplicationApi";

type UiStatus = "pending" | "approved" | "rejected";

function mapStatus(s: ArtistRequestStatus): UiStatus {
  if (s === "Approved") return "approved";
  if (s === "Rejected") return "rejected";
  return "pending";
}

export default function ApplicationStatus() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<UiStatus>("pending");
  const [rejectReason, setRejectReason] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const data = await artistApplicationApi.getMy();
        setStatus(mapStatus(data.status));
        setRejectReason(data.rejectReason ?? null);
      } catch (e: any) {
        // если access token протух — пробуем refresh и повторяем
        if (e?.response?.status === 401) {
          try {
            await artistApplicationApi.refresh();
            const data = await artistApplicationApi.getMy();
            setStatus(mapStatus(data.status));
            setRejectReason(data.rejectReason ?? null);
            return;
          } catch {
            toast.error("Unauthorized");
            return;
          }
        }

        if (e?.response?.status === 404) {
          navigate("/profile/apply-artist", { replace: true });
          return;
        }

        toast.error(e?.response?.data ?? "Failed to load status");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const content = useMemo(() => {
    const s: UiStatus = loading ? "pending" : status;

    switch (s) {
      case "approved":
        return {
          icon: <CheckCircle2 size={48} className="text-green-500" />,
          title: t("artist.status_approved_title", "Approved"),
          description: t("artist.status_approved_text", "Your request was approved."),
          hint: t("artist.status_approved_hint", "You can continue to the artist panel."),
        };

      case "rejected":
        return {
          icon: <XCircle size={48} className="text-red-500" />,
          title: t("artist.status_rejected_title", "Rejected"),
          description: t("artist.status_rejected_text", "Your request was rejected."),
          hint:
            rejectReason?.trim()
              ? rejectReason
              : t("artist.status_rejected_hint", "You can contact support."),
        };

      case "pending":
      default:
        return {
          icon: <Clock size={48} className="text-yellow-500" />,
          title: t("artist.status_pending_title", "Pending"),
          description: t("artist.status_pending_text", "Your request is under review."),
          hint: t("artist.status_pending_hint", "Please wait for admin approval."),
        };
    }
  }, [status, loading, t, rejectReason]);

  const effectiveStatus: UiStatus = loading ? "pending" : status;

  return (
    <div className="bg-[#121212] text-zinc-100 animate-in fade-in duration-500 pb-20 px-4 max-w-md mx-auto">
      <div className="space-y-10">
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
            {content.icon}
          </div>

          <h1 className="text-xl font-semibold text-white">{content.title}</h1>

          <p className="text-sm text-zinc-400">{content.description}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {effectiveStatus === "pending" && (
                <Loader2 size={18} className="animate-spin text-zinc-500" />
              )}
              {effectiveStatus === "approved" && (
                <Mail size={18} className="text-zinc-400" />
              )}
            </div>

            <p className="text-sm text-zinc-400">{content.hint}</p>
          </div>
        </div>

  

        
      </div>
    </div>
  );
}
