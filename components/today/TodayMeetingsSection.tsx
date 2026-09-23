"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import type { CalendarEventRow } from "@/types/calendar";

type Props = {
  meetings: CalendarEventRow[];
};

export default function TodayMeetingsSection({ meetings }: Props) {
  const t = useTranslations("today");

  if (meetings.length === 0) return null;

  const now = new Date();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CalendarDays size={11} className="text-blue-400/60" />
        <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 font-medium">
          {t("todayMeetings")}
        </span>
      </div>
      <div className="space-y-1.5">
        {meetings.map((meeting) => {
          const start = new Date(meeting.start_at);
          const isPast = start < now;
          return (
            <Link
              key={meeting.id}
              href="/dashboard/calendar"
              className="flex items-center gap-3 rounded-xl border border-blue-500/10 bg-blue-500/[0.03] px-3 py-2.5 transition-colors hover:border-blue-500/20 hover:bg-blue-500/[0.06]"
            >
              <div className="flex h-7 w-7 shrink-0 flex-col items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                <span className="text-[8px] font-semibold leading-none text-blue-300/70">
                  {start.toLocaleDateString(undefined, { month: "short" }).toUpperCase()}
                </span>
                <span className="text-xs font-bold leading-none text-blue-200">
                  {start.getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-xs font-medium ${isPast ? "text-white/40 line-through" : "text-white/75"}`}>
                  {meeting.title}
                </p>
                <p className="mt-0.5 text-[10px] text-white/30">
                  {meeting.all_day
                    ? t("allDay")
                    : start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  {meeting.location && (
                    <span className="ml-1.5 text-white/20">· {meeting.location}</span>
                  )}
                </p>
              </div>
              {isPast && (
                <span className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-white/25 uppercase tracking-wide">
                  {t("past")}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
