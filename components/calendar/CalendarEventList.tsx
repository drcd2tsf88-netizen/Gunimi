"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CalendarClock, ExternalLink, MapPin, User } from "lucide-react";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import type { CalendarEventRow } from "@/types/calendar";

type Props = {
  events: CalendarEventRow[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function CalendarEventList({ events }: Props) {
  const t = useTranslations("calendar");

  if (events.length === 0) {
    return (
      <GunimiEmptyState
        icon={CalendarClock}
        title={t("noEvents")}
        description={t("noEventsDescription")}
      />
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => {
        const today = isToday(event.start_at);

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <GunimiCard className="p-5">
              <div className="flex items-start gap-4">
                {/* Time column */}
                <div className="w-16 shrink-0 text-right">
                  {event.all_day ? (
                    <span className="text-xs font-medium text-violet-300">
                      {t("allDay")}
                    </span>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-white/80">
                        {formatTime(event.start_at)}
                      </p>
                      <p className="mt-0.5 text-[10px] text-white/30">
                        {formatTime(event.end_at)}
                      </p>
                    </>
                  )}
                  <p className="mt-1.5 text-[10px] text-white/25">
                    {today ? (
                      <span className="font-medium text-emerald-400">{t("today")}</span>
                    ) : (
                      formatDate(event.start_at)
                    )}
                  </p>
                </div>

                {/* Divider */}
                <div className="flex flex-col items-center self-stretch">
                  <div
                    className={`h-2 w-2 shrink-0 rounded-full mt-1 ${
                      today ? "bg-emerald-400" : "bg-violet-500/60"
                    }`}
                  />
                  <div className="mt-1 flex-1 w-px bg-white/[0.06]" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold leading-snug">
                      {event.title}
                    </h3>

                    {event.html_link && (
                      <a
                        href={event.html_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-white/30 hover:text-violet-300 transition-colors"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>

                  {event.organizer_name && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-white/40">
                      <User size={11} />
                      <span>{event.organizer_name}</span>
                      {event.organizer_email && (
                        <span className="text-white/20">
                          · {event.organizer_email}
                        </span>
                      )}
                    </div>
                  )}

                  {event.location && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-white/35">
                      <MapPin size={11} />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}

                  {event.status === "tentative" && (
                    <div className="mt-2 inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
                      {t("tentative")}
                    </div>
                  )}
                </div>
              </div>
            </GunimiCard>
          </motion.div>
        );
      })}
    </div>
  );
}
