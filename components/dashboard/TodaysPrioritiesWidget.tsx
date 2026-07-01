"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckSquare2,
  Clock,
  Flame,
  TriangleAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import OrbitCard from "@/components/ui/OrbitCard";
import { updateTask } from "@/server/actions/tasks/updateTask";
import type { CalendarEventRow } from "@/types/calendar";

export type DashboardTask = {
  id: string;
  title: string;
  status: string | null;
  priority: string | null;
  due_date: string | null;
};

type TaggedTask = DashboardTask & { tag: "overdue" | "today" | "high" };

type Props = {
  tasks: DashboardTask[];
  events: CalendarEventRow[];
  staleDealsCount: number;
};

function buildTodayStr(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatMeetingTime(startAt: string, allDay: boolean): string {
  if (allDay) return "All day";
  return new Date(startAt).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TodaysPrioritiesWidget({ tasks, events, staleDealsCount }: Props) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();
  const todayStr = buildTodayStr();

  function handleComplete(taskId: string) {
    setCompletedIds((prev) => new Set([...prev, taskId]));
    startTransition(async () => {
      const ok = await updateTask({ id: taskId, status: "done" });
      if (!ok) {
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
        toast.error(t("markDoneFailed"));
        return;
      }
      toast.success(t("markDoneSuccess"));
      router.refresh();
    });
  }

  // --- Priority tasks (excluding locally completed) ---
  const tagged: TaggedTask[] = [];
  const seen = new Set<string>();

  for (const task of tasks) {
    if (task.status === "done" || completedIds.has(task.id)) continue;
    const dueDateStr = task.due_date?.split("T")[0];
    if (dueDateStr && dueDateStr < todayStr && !seen.has(task.id)) {
      tagged.push({ ...task, tag: "overdue" });
      seen.add(task.id);
    } else if (dueDateStr === todayStr && !seen.has(task.id)) {
      tagged.push({ ...task, tag: "today" });
      seen.add(task.id);
    }
  }
  for (const task of tasks) {
    if (task.status === "done" || completedIds.has(task.id)) continue;
    if (task.priority === "high" && !seen.has(task.id)) {
      tagged.push({ ...task, tag: "high" });
      seen.add(task.id);
    }
  }

  const priorityTasks = tagged.slice(0, 5);

  // --- Today's meetings ---
  const todayMeetings = events.filter((e) => {
    const dateStr = e.start_at.split("T")[0];
    return dateStr === todayStr;
  });

  const isAllClear =
    priorityTasks.length === 0 && todayMeetings.length === 0 && staleDealsCount === 0;

  const TAG_STYLE: Record<string, string> = {
    overdue: "border-red-500/20 bg-red-500/10 text-red-300",
    today: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    high: "border-orange-500/20 bg-orange-500/10 text-orange-300",
  };

  const TAG_ICON: Record<string, React.ElementType> = {
    overdue: AlertCircle,
    today: Clock,
    high: Flame,
  };

  const TAG_LABEL: Record<string, string> = {
    overdue: t("overdueBadge"),
    today: t("dueTodayBadge"),
    high: t("highPriorityBadge"),
  };

  return (
    <OrbitCard className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t("todaysFocusBadge")}
          </p>
          <p className="mt-0.5 text-base font-semibold">{t("todaysPriorities")}</p>
        </div>
        <Link
          href="/dashboard/tasks"
          className="text-[10px] uppercase tracking-[0.14em] text-violet-400/70 transition-colors hover:text-violet-300"
        >
          {t("viewAll")}
        </Link>
      </div>

      {/* All clear */}
      {isAllClear && (
        <div className="flex flex-col items-center py-10 text-center">
          <CheckSquare2 className="h-7 w-7 text-emerald-400/60" />
          <p className="mt-3 text-sm font-medium text-white/70">{t("focusAllClear")}</p>
          <p className="mt-1 text-xs text-white/30">{t("focusAllClearDesc")}</p>
        </div>
      )}

      {!isAllClear && (
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {/* LEFT: Priority tasks */}
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
              {t("focusPriorityTasks")}
            </p>

            {priorityTasks.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
                <CheckSquare2 size={13} className="text-emerald-400/60" />
                <p className="text-xs text-white/40">{t("noPriorityTasks")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {priorityTasks.map((task) => {
                  const Icon = TAG_ICON[task.tag];
                  return (
                    <div
                      key={task.id}
                      className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04]"
                    >
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${TAG_STYLE[task.tag]}`}
                      >
                        <Icon size={9} />
                        {TAG_LABEL[task.tag]}
                      </span>
                      <Link
                        href="/dashboard/tasks"
                        className="min-w-0 flex-1 truncate text-sm text-white/80 hover:text-white"
                      >
                        {task.title}
                      </Link>
                      <button
                        onClick={() => handleComplete(task.id)}
                        aria-label={t("markDone")}
                        title={t("markDone")}
                        className="shrink-0 rounded-full p-1 text-white/20 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                      >
                        <Check size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Meetings + Deals */}
          <div className="space-y-5">
            {/* Meetings today */}
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                {t("focusMeetings")}
              </p>

              {todayMeetings.length === 0 ? (
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
                  <CalendarDays size={13} className="text-white/20" />
                  <p className="text-xs text-white/40">{t("noMeetingsToday")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayMeetings.slice(0, 3).map((event) => (
                    <Link
                      key={event.id}
                      href="/dashboard/calendar"
                      className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/[0.08] hover:bg-white/[0.04]"
                    >
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-white/80">{event.title}</p>
                        <p className="text-[11px] text-white/35">
                          {formatMeetingTime(event.start_at, event.all_day)}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {todayMeetings.length > 3 && (
                    <Link
                      href="/dashboard/calendar"
                      className="block px-3 text-[11px] text-violet-400/60 hover:text-violet-300"
                    >
                      +{todayMeetings.length - 3} {t("moreMeetings")}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Stale deals alert */}
            {staleDealsCount > 0 && (
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                  {t("focusDeals")}
                </p>
                <Link href="/dashboard/deals">
                  <div className="flex items-center gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 px-3 py-3 transition-colors hover:border-amber-500/25 hover:bg-amber-500/10">
                    <TriangleAlert size={13} className="shrink-0 text-amber-400/80" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-amber-200/90">
                        {t("staleDealsAlert", { count: staleDealsCount })}
                      </p>
                      <p className="text-[11px] text-white/35">{t("staleDealsAlertDesc")}</p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </OrbitCard>
  );
}
