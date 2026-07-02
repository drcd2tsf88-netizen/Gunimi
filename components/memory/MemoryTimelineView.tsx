"use client";

import { useTranslations } from "next-intl";
import {
  Activity,
  Building2,
  CalendarDays,
  CheckSquare,
  ChevronRight,
  FileText,
  Mail,
  Sparkles,
  TrendingUp,
  Upload,
  User,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

import OrbitCard from "@/components/ui/OrbitCard";
import type { MemoryEvent, MemoryImportance } from "@/lib/memory/types";

type Stats = {
  total: number;
  milestones: number;
  critical: number;
};

type Props = {
  timeline: MemoryEvent[];
  milestones: MemoryEvent[];
  stats: Stats;
};

const IMPORTANCE_DOT: Record<MemoryImportance, string> = {
  critical: "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.6)]",
  high: "bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.4)]",
  normal: "bg-zinc-500",
  low: "bg-zinc-700",
};

const IMPORTANCE_BADGE: Record<MemoryImportance, string> = {
  critical: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  high: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  normal: "border-white/[0.06] bg-white/[0.03] text-zinc-400",
  low: "border-white/[0.04] bg-white/[0.02] text-zinc-600",
};

const IMPORTANCE_LABEL_KEY: Record<MemoryImportance, string> = {
  critical: "importanceCritical",
  high: "importanceHigh",
  normal: "importanceNormal",
  low: "importanceLow",
};

function ActivityIcon({
  type,
  size,
  className,
}: {
  type: string;
  size: number;
  className: string;
}) {
  const props = { size, className };
  if (type.startsWith("deal")) return <TrendingUp {...props} />;
  if (type.startsWith("company")) return <Building2 {...props} />;
  if (type.startsWith("contact")) return <User {...props} />;
  if (type.startsWith("note")) return <FileText {...props} />;
  if (type.startsWith("task")) return <CheckSquare {...props} />;
  if (type === "automation_execution") return <Zap {...props} />;
  if (type === "ai") return <Sparkles {...props} />;
  if (type.startsWith("email")) return <Mail {...props} />;
  if (type.startsWith("calendar")) return <CalendarDays {...props} />;
  if (type.includes("import")) return <Upload {...props} />;
  if (
    type.startsWith("member") ||
    type.startsWith("workspace") ||
    type === "invite_sent"
  )
    return <Users {...props} />;
  return <Activity {...props} />;
}

function entityLink(event: MemoryEvent): string | null {
  if (event.dealId) return `/dashboard/deals/${event.dealId}`;
  if (event.companyId) return `/dashboard/companies/${event.companyId}`;
  if (event.contactId) return `/dashboard/contacts/${event.contactId}`;
  return null;
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(ts: string): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MilestonePill({
  event,
  t,
}: {
  event: MemoryEvent;
  t: ReturnType<typeof useTranslations>;
}) {
  const link = entityLink(event);

  const content = (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition-all hover:border-white/[0.14] hover:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
          <ActivityIcon type={event.type} size={12} className="text-zinc-400" />
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${IMPORTANCE_BADGE[event.importance]}`}
        >
          {t(IMPORTANCE_LABEL_KEY[event.importance])}
        </span>
      </div>

      <p className="text-sm font-medium leading-snug text-white/85">
        {event.title}
      </p>

      <p className="text-[10px] text-white/30">{formatDateShort(event.createdAt)}</p>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

function TimelineEventRow({
  event,
  t,
  isLast,
}: {
  event: MemoryEvent;
  t: ReturnType<typeof useTranslations>;
  isLast: boolean;
}) {
  const link = entityLink(event);

  return (
    <div className="flex gap-4">
      {/* Left: dot + line */}
      <div className="flex flex-col items-center">
        <div
          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${IMPORTANCE_DOT[event.importance]}`}
        />
        {!isLast && <div className="mt-1 w-px flex-1 bg-white/[0.06]" />}
      </div>

      {/* Right: content */}
      <div className={`min-w-0 flex-1 pb-5 ${isLast ? "" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
              <ActivityIcon type={event.type} size={11} className="text-zinc-500" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-white/80">{event.title}</p>
              {event.description && (
                <p className="mt-0.5 text-xs leading-relaxed text-white/35">
                  {event.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <span
              className={`rounded-full border px-2 py-0.5 text-[9px] font-medium ${IMPORTANCE_BADGE[event.importance]}`}
            >
              {t(IMPORTANCE_LABEL_KEY[event.importance])}
            </span>
            <span className="text-[10px] text-white/25">
              {formatDate(event.createdAt)}
            </span>
          </div>
        </div>

        {link && (
          <Link
            href={link}
            className="mt-1.5 flex items-center gap-1 text-[10px] text-violet-400/50 transition hover:text-violet-300"
          >
            {t("viewRecord")}
            <ChevronRight size={9} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MemoryTimelineView({ timeline, milestones, stats }: Props) {
  const t = useTranslations("memory");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          {t("badge")}
        </p>
        <h1 className="mt-2 text-2xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/40">{t("subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <OrbitCard className="p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            {t("statTotal")}
          </p>
          <p className="mt-2 text-3xl font-bold text-white/90">{stats.total}</p>
        </OrbitCard>
        <OrbitCard className="p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            {t("statMilestones")}
          </p>
          <p className="mt-2 text-3xl font-bold text-violet-300">
            {stats.milestones}
          </p>
        </OrbitCard>
        <OrbitCard className="p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            {t("statCritical")}
          </p>
          <p className="mt-2 text-3xl font-bold text-rose-300">
            {stats.critical}
          </p>
        </OrbitCard>
      </div>

      {/* Milestones */}
      {milestones.length > 0 && (
        <OrbitCard className="flex flex-col">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
              {t("milestonesBadge")}
            </p>
            <p className="mt-0.5 text-sm font-semibold">{t("milestonesTitle")}</p>
            <p className="mt-1 text-xs text-white/35">{t("milestonesSubtitle")}</p>
          </div>

          <div className="p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {milestones.slice(0, 6).map((m) => (
                <MilestonePill key={m.id} event={m} t={t} />
              ))}
            </div>
          </div>
        </OrbitCard>
      )}

      {/* Full Timeline */}
      <OrbitCard className="flex flex-col">
        <div className="border-b border-white/[0.06] px-5 py-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            {t("timelineBadge")}
          </p>
          <p className="mt-0.5 text-sm font-semibold">{t("timelineTitle")}</p>
          <p className="mt-1 text-xs text-white/35">{t("timelineSubtitle")}</p>
        </div>

        {timeline.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Activity size={28} className="text-white/10" />
            <p className="mt-4 text-sm font-medium text-white/40">
              {t("noMemory")}
            </p>
            <p className="mt-1 text-xs text-white/25">{t("noMemoryDescription")}</p>
          </div>
        ) : (
          <div className="px-5 pt-5">
            {timeline.map((event, i) => (
              <TimelineEventRow
                key={event.id}
                event={event}
                t={t}
                isLast={i === timeline.length - 1}
              />
            ))}
          </div>
        )}
      </OrbitCard>
    </div>
  );
}
