"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Mail,
  FileText,
  CheckCircle2,
  CircleDot,
  Clock,
  TrendingUp,
  MessageSquare,
  Zap,
  Paperclip,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TimelineNote       = { id: string; title: string; content?: string | null; created_at: string };
type TimelineTask       = { id: string; title: string; description?: string | null; status: string; priority?: string | null; created_at: string };
type TimelineActivity   = { id: string; type?: string | null; title?: string | null; description?: string | null; message?: string | null; created_at: string };
type TimelineEmail      = { id: string; subject?: string | null; snippet?: string | null; last_message_at?: string | null; message_count: number };
type TimelineDeal       = { id: string; title: string; stage?: string | null; created_at: string };
type TimelineAttachment = { id: string; file_name: string; created_at: string };

type TimelineKind = "activity" | "note" | "task" | "email" | "deal" | "file";
type FilterKind   = "all" | TimelineKind;

type TimelineEvent = {
  id: string;
  kind: TimelineKind;
  subtype?: string;
  title: string;
  description?: string;
  date: string;
  href?: string;
  badge?: string;
  done?: boolean;
};

type Props = {
  activities?: TimelineActivity[];
  notes?: TimelineNote[];
  tasks?: TimelineTask[];
  emails?: TimelineEmail[];
  deals?: TimelineDeal[];
  attachments?: TimelineAttachment[];
};

function buildEvents(
  activities: TimelineActivity[],
  notes: TimelineNote[],
  tasks: TimelineTask[],
  emails: TimelineEmail[],
  deals: TimelineDeal[],
  attachments: TimelineAttachment[],
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const a of activities) {
    events.push({
      id: `a-${a.id}`,
      kind: "activity",
      subtype: a.type ?? undefined,
      title: a.title ?? a.type ?? "Activity",
      description: a.description ?? a.message ?? undefined,
      date: a.created_at,
    });
  }

  for (const n of notes) {
    events.push({
      id: `n-${n.id}`,
      kind: "note",
      title: n.title,
      description: n.content?.replace(/<[^>]+>/g, "").slice(0, 120) ?? undefined,
      date: n.created_at,
      href: `/dashboard/notes/${n.id}`,
    });
  }

  for (const task of tasks) {
    events.push({
      id: `t-${task.id}`,
      kind: "task",
      title: task.title,
      description: task.description ?? undefined,
      date: task.created_at,
      done: task.status === "done",
      badge: task.priority ?? undefined,
    });
  }

  for (const email of emails) {
    const date = email.last_message_at;
    if (!date) continue;
    events.push({
      id: `e-${email.id}`,
      kind: "email",
      title: email.subject ?? "Email",
      description: email.snippet ?? undefined,
      date,
      badge: email.message_count > 1 ? `${email.message_count}` : undefined,
    });
  }

  for (const deal of deals) {
    events.push({
      id: `d-${deal.id}`,
      kind: "deal",
      title: deal.title,
      description: deal.stage ?? undefined,
      date: deal.created_at,
      href: `/dashboard/deals/${deal.id}`,
    });
  }

  for (const file of attachments) {
    events.push({
      id: `f-${file.id}`,
      kind: "file",
      title: file.file_name,
      date: file.created_at,
    });
  }

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function groupByDate(events: TimelineEvent[]): { label: string; events: TimelineEvent[] }[] {
  const groups: Map<string, TimelineEvent[]> = new Map();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  for (const event of events) {
    const d = new Date(event.date);
    d.setHours(0, 0, 0, 0);

    let label: string;
    if (d.getTime() === today.getTime()) {
      label = "__today__";
    } else if (d.getTime() === yesterday.getTime()) {
      label = "__yesterday__";
    } else {
      label = d.toISOString().slice(0, 7);
    }

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(event);
  }

  return Array.from(groups.entries()).map(([label, evts]) => ({ label, events: evts }));
}

function eventIcon(event: TimelineEvent) {
  const cls = "h-3.5 w-3.5";
  switch (event.kind) {
    case "email":
      return { icon: <Mail className={cls} />, dot: "bg-sky-500", ring: "ring-sky-500/20" };
    case "note":
      return { icon: <FileText className={cls} />, dot: "bg-zinc-500", ring: "ring-zinc-500/20" };
    case "task":
      return event.done
        ? { icon: <CheckCircle2 className={cls} />, dot: "bg-emerald-500", ring: "ring-emerald-500/20" }
        : { icon: <CircleDot className={cls} />, dot: "bg-violet-500", ring: "ring-violet-500/20" };
    case "deal":
      return { icon: <TrendingUp className={cls} />, dot: "bg-amber-500", ring: "ring-amber-500/20" };
    case "file":
      return { icon: <Paperclip className={cls} />, dot: "bg-zinc-600", ring: "ring-zinc-600/20" };
    default: {
      const sub = event.subtype ?? "";
      if (sub.includes("email")) return { icon: <Mail className={cls} />, dot: "bg-sky-500", ring: "ring-sky-500/20" };
      if (sub.includes("note"))  return { icon: <FileText className={cls} />, dot: "bg-zinc-500", ring: "ring-zinc-500/20" };
      if (sub.includes("task"))  return { icon: <Clock className={cls} />, dot: "bg-violet-500", ring: "ring-violet-500/20" };
      if (sub.includes("deal"))  return { icon: <TrendingUp className={cls} />, dot: "bg-amber-500", ring: "ring-amber-500/20" };
      if (sub.includes("signal")) return { icon: <Zap className={cls} />, dot: "bg-rose-500", ring: "ring-rose-500/20" };
      return { icon: <MessageSquare className={cls} />, dot: "bg-white/20", ring: "ring-white/10" };
    }
  }
}

function priorityColor(priority?: string) {
  if (priority === "high")   return "text-red-400 bg-red-500/10 border-red-500/20";
  if (priority === "medium") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)   return "now";
  if (mins < 60)  return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h`;
  return new Date(dateStr).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

const FILTER_KINDS: { id: FilterKind; labelKey: string }[] = [
  { id: "all",      labelKey: "filterAll"      },
  { id: "note",     labelKey: "filterNotes"    },
  { id: "task",     labelKey: "filterTasks"    },
  { id: "email",    labelKey: "filterEmails"   },
  { id: "deal",     labelKey: "filterDeals"    },
  { id: "activity", labelKey: "filterActivity" },
  { id: "file",     labelKey: "filterFiles"    },
];

export default function WorkspaceTimeline({
  activities = [],
  notes = [],
  tasks = [],
  emails = [],
  deals = [],
  attachments = [],
}: Props) {
  const t = useTranslations("timeline");
  const [activeFilter, setActiveFilter] = useState<FilterKind>("all");

  const events = useMemo(
    () => buildEvents(activities, notes, tasks, emails, deals, attachments),
    [activities, notes, tasks, emails, deals, attachments],
  );

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<TimelineKind, number>> = {};
    for (const e of events) counts[e.kind] = (counts[e.kind] ?? 0) + 1;
    return counts;
  }, [events]);

  const visibleEvents = useMemo(
    () => activeFilter === "all" ? events : events.filter((e) => e.kind === activeFilter),
    [events, activeFilter],
  );

  const groups = useMemo(() => groupByDate(visibleEvents), [visibleEvents]);

  function groupLabel(raw: string): string {
    if (raw === "__today__")     return t("today");
    if (raw === "__yesterday__") return t("yesterday");
    const [year, month] = raw.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

  const availableFilters = FILTER_KINDS.filter(
    (f) => f.id === "all" || (typeCounts[f.id as TimelineKind] ?? 0) > 0,
  );

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <Clock size={20} className="text-zinc-600" />
        <p className="text-sm text-zinc-500">{t("empty")}</p>
        <p className="text-xs text-zinc-600">{t("emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Filter pills ──────────────────────────────────────── */}
      {availableFilters.length > 2 && (
        <div className="flex flex-wrap gap-1.5">
          {availableFilters.map((f) => {
            const count = f.id === "all" ? events.length : (typeCounts[f.id as TimelineKind] ?? 0);
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                    : "border-white/[0.07] bg-white/[0.02] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-400",
                )}
              >
                {t(f.labelKey)}
                <span
                  className={cn(
                    "rounded-full px-1 py-0.5 text-[9px] tabular-nums",
                    active ? "bg-violet-500/20 text-violet-300" : "bg-white/[0.05] text-zinc-600",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Timeline groups ───────────────────────────────────── */}
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                {groupLabel(group.label)}
              </span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>

            <div className="relative ml-1.5">
              <div className="absolute left-3 top-0 h-full w-px bg-white/[0.06]" />

              <div className="space-y-1">
                {group.events.map((event) => {
                  const { icon, dot, ring } = eventIcon(event);

                  const content = (
                    <div
                      className={cn(
                        "group relative flex gap-4 rounded-xl px-3 py-3",
                        "transition-colors hover:bg-white/[0.02]",
                        event.href ? "cursor-pointer" : "",
                      )}
                    >
                      <div className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                        <div
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full",
                            "ring-4 text-white",
                            dot,
                            ring,
                          )}
                        >
                          {icon}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm font-medium leading-snug",
                              event.done ? "text-zinc-500 line-through" : "text-white/85",
                            )}
                          >
                            {event.title}
                          </p>
                          <div className="flex shrink-0 items-center gap-1.5">
                            {event.badge && event.kind === "task" && (
                              <span
                                className={cn(
                                  "rounded-full border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide",
                                  priorityColor(event.badge),
                                )}
                              >
                                {event.badge}
                              </span>
                            )}
                            {event.badge && event.kind === "email" && (
                              <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-zinc-400">
                                {event.badge}
                              </span>
                            )}
                            <span className="whitespace-nowrap text-[10px] text-zinc-600">
                              {relativeTime(event.date)}
                            </span>
                          </div>
                        </div>

                        {event.description && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-zinc-500">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );

                  return event.href ? (
                    <Link key={event.id} href={event.href}>
                      {content}
                    </Link>
                  ) : (
                    <div key={event.id}>{content}</div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
