"use client";

import { useState } from "react";
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

  const [brief, setBrief] = useState<string | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);

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

  async function generateBrief() {
    setBriefLoading(true);
    setBrief(null);
    try {
      const res = await fetch("/api/ai/brief", { method: "POST" });
      const json = await res.json() as { brief?: string };
      setBrief(json.brief ?? null);
    } catch {
      setBrief(null);
    } finally {
      setBriefLoading(false);
    }
  }

  return (
    <OrbitCard className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
          <Sparkles className="h-4 w-4 text-violet-300" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                {t("dailyBrief")}
              </p>
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] uppercase tracking-wide text-violet-300">
                Live
              </span>
            </div>

            <button
              onClick={generateBrief}
              disabled={briefLoading}
              className="shrink-0 rounded-xl border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[10px] font-medium text-violet-300 transition-all hover:bg-violet-500/15 disabled:opacity-50"
            >
              {briefLoading ? "Analyzing..." : "Ask Orbit AI"}
            </button>
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

          {briefLoading && (
            <div className="mt-4 flex items-center gap-2">
              <div className="h-3 w-3 animate-spin rounded-full border border-violet-400 border-t-transparent" />
              <p className="text-xs text-white/30">Orbit AI analyzing workspace...</p>
            </div>
          )}

          {brief && !briefLoading && (
            <div className="mt-4 rounded-xl border border-violet-500/15 bg-violet-500/5 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-widest text-violet-400">
                Orbit AI Insight
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/80">{brief}</p>
            </div>
          )}
        </div>
      </div>
    </OrbitCard>
  );
}
