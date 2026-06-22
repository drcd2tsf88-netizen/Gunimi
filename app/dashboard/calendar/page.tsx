import { getTranslations } from "next-intl/server";
import { CalendarDays } from "lucide-react";

import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitSection from "@/components/layout/OrbitSection";
import OrbitButton from "@/components/ui/OrbitButton";

import CalendarConnectionCard from "@/components/calendar/CalendarConnectionCard";
import CalendarEventList from "@/components/calendar/CalendarEventList";

import { getCalendarConnections } from "@/server/actions/calendar/getCalendarConnections";
import { getCalendarEvents } from "@/server/actions/calendar/getCalendarEvents";

export default async function CalendarPage() {
  const t = await getTranslations("calendar");

  const [connections, events] = await Promise.all([
    getCalendarConnections(),
    getCalendarEvents(30),
  ]);

  const hasConnection = connections.length > 0;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <OrbitSection>
        <div className="flex items-start justify-between gap-4">
          <OrbitHeading
            badge={t("badge")}
            title={t("title")}
            subtitle={t("subtitle")}
          />

          {hasConnection && (
            <a href="/api/calendar/connect/google" className="shrink-0 mt-1">
              <OrbitButton variant="secondary" className="gap-2 text-sm">
                <CalendarDays size={14} />
                {t("addCalendar")}
              </OrbitButton>
            </a>
          )}
        </div>
      </OrbitSection>

      {/* CONNECTION */}
      <OrbitSection>
        <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
          {t("connectionStatus")}
        </p>
        <CalendarConnectionCard connections={connections} />
      </OrbitSection>

      {/* EVENTS */}
      {hasConnection && (
        <OrbitSection>
          <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
            {t("upcomingEvents")}
          </p>
          <CalendarEventList events={events} />
        </OrbitSection>
      )}
    </div>
  );
}
