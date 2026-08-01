"use client";

import { useMemo } from "react";
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

import type { WorkspaceActivity } from "@/types/activity";
import type { ContactNote } from "@/server/actions/crm/getContactNotes";
import type { ContactTask } from "@/server/actions/crm/getContactTasks";
import type { EmailThread } from "@/types/email";
import type { Deal } from "@/types/deal";
import type { WorkspaceAttachment } from "@/server/actions/attachments/getAttachments";

type TimelineEvent = {
  id: string;
  kind: "activity" | "note" | "task" | "email" | "deal" | "file";
  subtype?: string;
  title: string;
  description?: string;
  date: string;
  href?: string;
  badge?: string;
  done?: boolean;
};

type Props = {
  activities: WorkspaceActivity[];
  notes: ContactNote[];
  tasks: ContactTask[];
  emails: EmailThread[];
  deals: Deal[];
  attachments: WorkspaceAttachment[];
};

function buildEvents(
  activities: WorkspaceActivity[],
  notes: ContactNote[],
  tasks: ContactTask[],
  emails: EmailThread[],
  deals: Deal[],
  attachments: WorkspaceAttachment[],
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const a of activities) {
    events.push({
      id: `a-${a.id}`,
      kind: "activity",
      subtype: a.type,
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
      description: n.content ?? undefined,
      date: n.created_at,
      href: `/dashboard/notes`,
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
    if (!email.last_message_at) continue;
    events.push({
      id: `e-${email.id}`,
      kind: "email",
      title: email.subject ?? "Email",
      description: email.snippet ?? undefined,
      date: email.last_message_at,
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

  return events.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function groupByDate(events: TimelineEvent[]): { label: string; events: TimelineEvent[] }[] {
  const groups: Map<string, TimelineEvent[]> = new Map();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  for (const event of events) {
    const d = new Date(event.date);
    d.setHours(0, 0, 0, 0);

    let label: string;
    if (d.getTime() === today.getTime()) {
      label = "__today__";
    } else if (d.getTime() === yesterday.getTime()) {
      label = "__yesterday__";
    } else {
      label = d.toISOString().slice(0, 7); // "YYYY-MM"
    }

    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(event);
  }

  return Array.from(groups.entries()).map(([label, evts]) => ({ label, events: evts }));
}

function eventIcon(event: TimelineEvent) {
  const cls = "h-3.5 w-3.5";
  switch (event.kind) {
    case "email": return { icon: <Mail className={cls} />, dot: "bg-sky-500", ring: "ring-sky-500/20" };
    case "note": return { icon: <FileText className={cls} />, dot: "bg-zinc-500", ring: "ring-zinc-500/20" };
    case "task":
      return event.done
        ? { icon: <CheckCircle2 className={cls} />, dot: "bg-emerald-500", ring: "ring-emerald-500/20" }
        : { icon: <CircleDot className={cls} />, dot: "bg-violet-500", ring: "ring-violet-500/20" };
    case "deal": return { icon: <TrendingUp className={cls} />, dot: "bg-amber-500", ring: "ring-amber-500/20" };
    case "file": return { icon: <Paperclip className={cls} />, dot: "bg-zinc-600", ring: "ring-zinc-600/20" };
    default: {
      const sub = event.subtype ?? "";
      if (sub.includes("email")) return { icon: <Mail className={cls} />, dot: "bg-sky-500", ring: "ring-sky-500/20" };
      if (sub.includes("note")) return { icon: <FileText className={cls} />, dot: "bg-zinc-500", ring: "ring-zinc-500/20" };
      if (sub.includes("task")) return { icon: <Clock className={cls} />, dot: "bg-violet-500", ring: "ring-violet-500/20" };
      if (sub.includes("deal")) return { icon: <TrendingUp className={cls} />, dot: "bg-amber-500", ring: "ring-amber-500/20" };
      if (sub.includes("signal")) return { icon: <Zap className={cls} />, dot: "bg-rose-500", ring: "ring-rose-500/20" };
      return { icon: <MessageSquare className={cls} />, dot: "bg-white/20", ring: "ring-white/10" };
    }
  }
}

function priorityColor(priority?: string) {
  if (priority === "high") return "text-red-400 bg-red-500/10 border-red-500/20";
  if (priority === "medium") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
}

export default function ContactTimeline({
  activities,
  notes,
  tasks,
  emails,
  deals,
  attachments,
}: Props) {
  const t = useTranslations("timeline");

  const events = useMemo(
    () => buildEvents(activities, notes, tasks, emails, deals, attachments),
    [activities, notes, tasks, emails, deals, attachments],
  );

  const groups = useMemo(() => groupByDate(events), [events]);

  function groupLabel(raw: string): string {
    if (raw === "__today__") return t("today");
    if (raw === "__yesterday__") return t("yesterday");
    const [year, month] = raw.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

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
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          {/* Date group label */}
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {groupLabel(group.label)}
            </span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>

          {/* Events */}
          <div className="relative ml-1.5">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 h-full w-px bg-white/[0.06]" />

            <div className="space-y-1">
              {group.events.map((event) => {
                const { icon, dot, ring } = eventIcon(event);

                const content = (
                  <div
                    className={[
                      "group relative flex gap-4 rounded-xl px-3 py-3",
                      "transition-colors hover:bg-white/[0.02]",
                      event.href ? "cursor-pointer" : "",
                    ].join(" ")}
                  >
                    {/* Dot */}
                    <div className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                      <div
                        className={[
                          "flex h-6 w-6 items-center justify-center rounded-full",
                          "ring-4 text-white",
                          dot,
                          ring,
                        ].join(" ")}
                      >
                        {icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={[
                            "text-sm font-medium leading-snug",
                            event.done ? "text-zinc-500 line-through" : "text-white/85",
                          ].join(" ")}
                        >
                          {event.title}
                        </p>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {event.badge && event.kind === "task" && (
                            <span
                              className={[
                                "rounded-full border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide",
                                priorityColor(event.badge),
                              ].join(" ")}
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
                            {new Date(event.date).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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
  );
}
