"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import type { CalendarEventRow } from "@/types/calendar";

type Props = {
  events: CalendarEventRow[];
};

function formatMeetingTime(startAt: string, allDay: boolean): string {
  if (allDay) return "All day";
  const date = new Date(startAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (date >= today && date < tomorrow) {
    return `Today ${timeStr}`;
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }) + ` · ${timeStr}`;
}

export default function UpcomingMeetingsWidget({ events }: Props) {
  const t = useTranslations("dashboard");

  return (
    <OrbitCard className="flex flex-col p-5">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t("upcomingMeetingsTitle")}
          </p>
          <p className="mt-0.5 text-xs text-white/30">{t("statsMeetings")}</p>
        </div>
        <Link
          href="/dashboard/calendar"
          className="text-[10px] uppercase tracking-[0.14em] text-violet-400/70 transition-colors hover:text-violet-300"
        >
          {t("viewAll")}
        </Link>
      </div>

      <div className="mt-4 flex-1 space-y-2">
        {events.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CalendarDays className="h-6 w-6 text-white/20" />
            <p className="mt-3 text-sm font-medium text-white/60">{t("noMeetings")}</p>
            <p className="mt-1 text-xs text-white/30">{t("noMeetingsDescription")}</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5"
            >
              <div className="mt-0.5 shrink-0">
                <div className="h-2 w-2 rounded-full bg-violet-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/85">{event.title}</p>
                <p className="mt-0.5 text-[11px] text-white/35">
                  {formatMeetingTime(event.start_at, event.all_day)}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[9px] uppercase tracking-wide text-blue-300">
                Google
              </span>
            </div>
          ))
        )}
      </div>
    </OrbitCard>
  );
}
