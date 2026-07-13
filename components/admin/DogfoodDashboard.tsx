"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { DogfoodFeedbackRow, FeedbackStatus } from "@/server/actions/dogfood/getFeedback";
import type { FeedbackCategory, FeedbackSeverity } from "@/server/actions/dogfood/submitFeedback";
import { updateFeedbackStatus } from "@/server/actions/dogfood/updateFeedbackStatus";
import type { FirstSuccessMetrics } from "@/server/actions/dogfood/getFirstSuccess";

const SEVERITY_COLORS: Record<FeedbackSeverity, string> = {
  low: "bg-white/5 text-white/40",
  medium: "bg-blue-500/10 text-blue-400/70",
  high: "bg-amber-500/10 text-amber-400/70",
  critical: "bg-red-500/10 text-red-400/80",
};

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  open: "bg-[#6D5BFF]/10 text-[#8B7DFF]/80",
  in_progress: "bg-amber-500/10 text-amber-400/70",
  resolved: "bg-emerald-500/10 text-emerald-400/70",
};

type Props = {
  feedback: DogfoodFeedbackRow[];
  metrics: FirstSuccessMetrics | null;
};

export default function DogfoodDashboard({ feedback, metrics }: Props) {
  const t = useTranslations("dogfood");
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<FeedbackSeverity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
  const [updating, startUpdate] = useTransition();

  const filtered = feedback.filter((row) => {
    if (categoryFilter !== "all" && row.category !== categoryFilter) return false;
    if (severityFilter !== "all" && row.severity !== severityFilter) return false;
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    return true;
  });

  const open = feedback.filter((r) => r.status === "open").length;
  const inProgress = feedback.filter((r) => r.status === "in_progress").length;
  const critical = feedback.filter((r) => r.severity === "critical").length;
  const resolved = feedback.filter((r) => r.status === "resolved").length;

  const total = feedback.length;
  const resolvedPct = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const openPct = total > 0 ? 100 - resolvedPct - inProgressPct : 0;

  function handleStatusChange(id: string, status: FeedbackStatus) {
    startUpdate(async () => {
      const ok = await updateFeedbackStatus(id, status);
      if (!ok) toast.error("Failed to update status");
    });
  }

  return (
    <div className="space-y-8">
      <GunimiHeading badge={t("dashboardBadge")} title={t("dashboardTitle")} />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t("totalFeedback"), value: feedback.length },
          { label: t("openIssues"), value: open },
          { label: t("criticalIssues"), value: critical },
          { label: t("resolvedIssues"), value: resolved },
        ].map(({ label, value }) => (
          <GunimiCard key={label} className="p-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
              {label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          </GunimiCard>
        ))}
      </div>

      {/* Progress indicator */}
      {total > 0 && (
        <section>
          <div className="mb-3">
            <h2 className="text-[15px] font-semibold text-white">{t("cleanupTitle")}</h2>
            <p className="mt-0.5 text-sm text-white/40">{t("cleanupSubtitle")}</p>
          </div>
          <GunimiCard className="p-5">
            <div className="flex items-center gap-6">
              {/* Percentage */}
              <div className="shrink-0 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6D5BFF]/60">
                  {t("cleanupReadiness")}
                </p>
                <p className="mt-1 text-4xl font-semibold tabular-nums text-white">{resolvedPct}%</p>
              </div>

              {/* Bar + legend */}
              <div className="min-w-0 flex-1">
                <div className="flex h-2.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="bg-emerald-500/60 transition-all duration-500"
                    style={{ width: `${resolvedPct}%` }}
                  />
                  <div
                    className="bg-amber-500/55 transition-all duration-500"
                    style={{ width: `${inProgressPct}%` }}
                  />
                  <div
                    className="bg-[#6D5BFF]/40 transition-all duration-500"
                    style={{ width: `${openPct}%` }}
                  />
                </div>

                {/* Summary sentence */}
                <p className="mt-2 text-[11px] text-white/35">
                  {open + inProgress > 0
                    ? t("cleanupRemaining", { remaining: open + inProgress })
                    : t("cleanupReady")}
                </p>

                {/* Clickable legend */}
                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
                  {(
                    [
                      { status: "resolved" as FeedbackStatus, count: resolved, dot: "bg-emerald-500/60", text: "text-emerald-400/70" },
                      { status: "in_progress" as FeedbackStatus, count: inProgress, dot: "bg-amber-500/55", text: "text-amber-400/60" },
                      { status: "open" as FeedbackStatus, count: open, dot: "bg-[#6D5BFF]/40", text: "text-[#8B7DFF]/60" },
                    ] as const
                  ).map(({ status, count, dot, text }) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter((prev) => prev === status ? "all" : status)}
                      className={[
                        "flex items-center gap-1.5 text-[11px] transition-opacity",
                        text,
                        statusFilter !== "all" && statusFilter !== status
                          ? "opacity-30"
                          : "opacity-100 hover:opacity-75",
                      ].join(" ")}
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                      {count} {t(`status${status.charAt(0).toUpperCase()}${status.slice(1).replace("_p", "P")}` as Parameters<typeof t>[0])}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GunimiCard>
        </section>
      )}

      {/* First Success section */}
      {metrics && (
        <section>
          <div className="mb-3">
            <h2 className="text-[15px] font-semibold text-white">{t("firstSuccessTitle")}</h2>
            <p className="mt-0.5 text-sm text-white/40">{t("firstSuccessSubtitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total Workspaces", value: metrics.totalWorkspaces },
              { label: t("wsWithContact"), value: metrics.workspacesWithContact },
              { label: t("wsWithDeal"), value: metrics.workspacesWithDeal },
              { label: t("wsWithSignal"), value: metrics.workspacesWithSignal },
            ].map(({ label, value }) => (
              <GunimiCard key={label} className="p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/35">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
              </GunimiCard>
            ))}
          </div>
        </section>
      )}

      {/* Feedback list */}
      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v as FeedbackCategory | "all")}
          >
            <SelectTrigger className="h-9 w-[140px] text-sm" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(["ux","bug","performance","copy","ai","signal","today","workspace","settings","other"] as FeedbackCategory[]).map((c) => (
                <SelectItem key={c} value={c}>{t(`category_${c}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={severityFilter}
            onValueChange={(v) => setSeverityFilter(v as FeedbackSeverity | "all")}
          >
            <SelectTrigger className="h-9 w-[130px] text-sm" aria-label="Filter by severity">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              {(["low","medium","high","critical"] as FeedbackSeverity[]).map((s) => (
                <SelectItem key={s} value={s}>{t(`severity_${s}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as FeedbackStatus | "all")}
          >
            <SelectTrigger className="h-9 w-[130px] text-sm" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">{t("statusOpen")}</SelectItem>
              <SelectItem value="in_progress">{t("statusInProgress")}</SelectItem>
              <SelectItem value="resolved">{t("statusResolved")}</SelectItem>
            </SelectContent>
          </Select>

          <p className="ml-auto text-xs text-white/30">
            {filtered.length} / {feedback.length}
          </p>
        </div>

        {filtered.length === 0 ? (
          <GunimiEmptyState
            icon={MessageSquare}
            title={t("noFeedback")}
            description={t("noFeedbackDescription")}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((row) => (
              <GunimiCard key={row.id} className="p-5">
                <div className="flex flex-wrap items-start gap-3">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${SEVERITY_COLORS[row.severity]}`}>
                      {t(`severity_${row.severity}`)}
                    </span>
                    <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/45">
                      {t(`category_${row.category}`)}
                    </span>
                    {row.session_note && (
                      <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/35">
                        note
                      </span>
                    )}
                  </div>

                  {/* Status select */}
                  <div className="ml-auto flex items-center gap-2">
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLORS[row.status]}`}>
                      {t(`status${row.status.charAt(0).toUpperCase()}${row.status.slice(1).replace("_p","P")}` as Parameters<typeof t>[0])}
                    </span>
                    <Select
                      value={row.status}
                      onValueChange={(v) => handleStatusChange(row.id, v as FeedbackStatus)}
                      disabled={updating}
                    >
                      <SelectTrigger className="h-7 w-[120px] text-xs" aria-label="Change status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">{t("markOpen")}</SelectItem>
                        <SelectItem value="in_progress">{t("markInProgress")}</SelectItem>
                        <SelectItem value="resolved">{t("markResolved")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <p className="mt-3 text-sm leading-relaxed text-white/75">{row.message}</p>

                {/* Meta */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/30">
                  {row.user_name && <span>{row.user_name}</span>}
                  {row.workspace_name && <span>{row.workspace_name}</span>}
                  {row.route && <span className="font-mono">{row.route}</span>}
                  {row.viewport && <span>{row.viewport}</span>}
                  <span>{formatDate(row.created_at)}</span>
                </div>
              </GunimiCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
