"use client";

import { useTranslations } from "next-intl";
import { Sparkles, CheckSquare2, CalendarDays, Activity } from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import type { DashboardTask } from "./PriorityTasksWidget";
import type { CalendarEventRow } from "@/types/calendar";

type Props = {
  tasks: DashboardTask[];
  events: CalendarEventRow[];
  activityCount: number;
};

export default function DailyBriefWidget({ tasks, events, activityCount }: Props) {
  const t = useTranslations("dashboard");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const openTasks = tasks.filter((tk) => tk.status !== "done").length;
  const overdueTasks = tasks.filter((tk) => {
    if (tk.status === "done") return false;
    return tk.due_date && new Date(tk.due_date) < today;
  }).length;
  const meetingsToday = events.filter((e) => e.start_at.startsWith(todayStr)).length;

  const bullets = [
    {
      icon: CheckSquare2,
      color: "text-violet-300",
      text: overdueTasks > 0
        ? `${openTasks} ${t("openTasksCount")} — ${overdueTasks} ${t("overdueCount")}`
        : `${openTasks} ${t("openTasksCount")}`,
    },
    {
      icon: CalendarDays,
      color: "text-blue-300",
      text: meetingsToday > 0
        ? `${meetingsToday} ${t("meetingsTodayCount")}`
        : t("noMeetingsToday"),
    },
    {
      icon: Activity,
      color: "text-emerald-300",
      text: activityCount > 0
        ? `${activityCount} ${t("activityTodayCount")}`
        : t("noUrgentItems"),
    },
  ];

  return (
    <OrbitCard className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
          <Sparkles className="h-4 w-4 text-violet-300" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t("dailyBrief")}
            </p>
            <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] uppercase tracking-wide text-violet-300">
              Live
            </span>
          </div>
          <p className="mt-0.5 text-xs text-white/30">{t("dailyBriefSubtitle")}</p>

          <div className="mt-4 flex flex-wrap gap-3 sm:flex-nowrap">
            {bullets.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="flex min-w-0 flex-1 items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
                >
                  <Icon size={13} className={`mt-0.5 shrink-0 ${b.color}`} />
                  <p className="text-xs leading-relaxed text-white/60">{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </OrbitCard>
  );
}
