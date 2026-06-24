"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";

import OrbitCard from "@/components/ui/OrbitCard";
import OrbitStatCard from "@/components/ui/OrbitStatCard";
import OrbitButton from "@/components/ui/OrbitButton";
import CalendarConnectionCard from "@/components/calendar/CalendarConnectionCard";
import type { CalendarConnection, CalendarEventRow } from "@/types/calendar";
import type { CalendarContact } from "@/server/actions/calendar/getCalendarContacts";

// Module-level time reference — avoids calling Date.now() during render
const PAGE_NOW = new Date();
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

type Props = {
  events: CalendarEventRow[];
  connections: CalendarConnection[];
  contacts: CalendarContact[];
};

type LinkedContact = {
  contact: CalendarContact;
  count: number;
};

type LinkedCompany = {
  id: string;
  name: string;
  count: number;
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDayLabel(iso: string): string {
  const d = new Date(iso);
  if (isSameDay(d, PAGE_NOW)) return "Today";
  const tomorrow = new Date(PAGE_NOW);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(d, tomorrow)) return "Tomorrow";
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatGroupKey(iso: string): string {
  const d = new Date(iso);
  if (isSameDay(d, PAGE_NOW)) {
    return `__today__${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  }
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

function localDayName(dayIndex: number): string {
  // Jan 7 2024 = Sunday (index 0), Jan 8 = Monday (1), ...
  return new Date(2024, 0, 7 + dayIndex).toLocaleDateString(undefined, { weekday: "long" });
}

// ─── Widget shell ─────────────────────────────────────────────────────────────

type WidgetProps = {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  count?: number;
  children: React.ReactNode;
};

function Widget({ icon: Icon, iconColor, iconBg, title, subtitle, count, children }: WidgetProps) {
  return (
    <OrbitCard className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/[0.05] px-5 py-4">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${iconBg}`}>
          <Icon size={14} className={iconColor} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white/90">{title}</p>
          {subtitle && <p className="mt-0.5 truncate text-[11px] text-white/35">{subtitle}</p>}
        </div>
        {count !== undefined && (
          <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-xs tabular-nums text-white/40">
            {count}
          </span>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </OrbitCard>
  );
}

function WidgetEmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
      <Icon size={20} className="text-zinc-600" />
      <p className="text-sm text-white/25">{message}</p>
    </div>
  );
}

// ─── Event Row ────────────────────────────────────────────────────────────────

type EventRowProps = {
  event: CalendarEventRow;
  isToday?: boolean;
  crmContact?: CalendarContact | null;
};

function EventRow({ event, isToday = false, crmContact }: EventRowProps) {
  return (
    <div className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02]">
      {/* Time */}
      <div className="w-14 shrink-0 text-right">
        {event.all_day ? (
          <span className="text-[10px] font-medium text-violet-300">All day</span>
        ) : (
          <>
            <p className="text-xs font-semibold text-white/70">{formatTime(event.start_at)}</p>
            <p className="mt-0.5 text-[10px] text-white/25">{formatTime(event.end_at)}</p>
          </>
        )}
      </div>

      {/* Dot */}
      <div className="mt-1.5 shrink-0">
        <div
          className={`h-1.5 w-1.5 rounded-full ${isToday ? "bg-emerald-400" : "bg-violet-500/60"}`}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium text-white/85">{event.title}</p>
          {event.html_link && (
            <a
              href={event.html_link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-white/25 transition-colors hover:text-violet-300"
            >
              <ExternalLink size={11} />
            </a>
          )}
        </div>

        {event.location && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-white/30">
            <MapPin size={9} />
            <span className="truncate">{event.location}</span>
          </div>
        )}

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {event.status === "tentative" && (
            <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-1.5 py-0.5 text-[10px] text-yellow-300">
              Tentative
            </span>
          )}
          {crmContact && (
            <Link
              href={`/dashboard/crm/${crmContact.id}`}
              className="inline-flex items-center gap-1 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] text-cyan-300 transition-colors hover:border-cyan-500/40"
            >
              <User size={8} />
              {crmContact.name}
            </Link>
          )}
          {crmContact?.company_id && crmContact.company_name && (
            <Link
              href={`/dashboard/companies/${crmContact.company_id}`}
              className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-300 transition-colors hover:border-violet-500/40"
            >
              <Building2 size={8} />
              {crmContact.company_name}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Today's Meetings Widget ──────────────────────────────────────────────────

function TodayWidget({
  events,
  contactByEmail,
  t,
}: {
  events: CalendarEventRow[];
  contactByEmail: Map<string, CalendarContact>;
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  return (
    <Widget
      icon={CalendarDays}
      iconColor="text-emerald-300"
      iconBg="border-emerald-500/20 bg-emerald-500/10"
      title={t("todaysMeetings")}
      subtitle={t("todaysSubtitle")}
      count={events.length}
    >
      {events.length === 0 ? (
        <WidgetEmptyState icon={CheckCircle2} message={t("noMeetingsToday")} />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {events.map((e) => (
            <EventRow
              key={e.id}
              event={e}
              isToday
              crmContact={
                e.organizer_email
                  ? (contactByEmail.get(e.organizer_email.toLowerCase()) ?? null)
                  : null
              }
            />
          ))}
        </div>
      )}
    </Widget>
  );
}

// ─── This Week Widget ─────────────────────────────────────────────────────────

function ThisWeekWidget({
  events,
  contactByEmail,
  t,
}: {
  events: CalendarEventRow[];
  contactByEmail: Map<string, CalendarContact>;
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  // Group by day, preserving insertion order (events already sorted by start_at asc)
  const grouped = new Map<string, CalendarEventRow[]>();
  events.forEach((e) => {
    const key = formatGroupKey(e.start_at);
    const arr = grouped.get(key) ?? [];
    arr.push(e);
    grouped.set(key, arr);
  });

  return (
    <Widget
      icon={Clock}
      iconColor="text-violet-300"
      iconBg="border-violet-500/20 bg-violet-500/10"
      title={t("thisWeek")}
      subtitle={t("thisWeekSubtitle")}
      count={events.length}
    >
      {events.length === 0 ? (
        <WidgetEmptyState icon={CalendarDays} message={t("noMeetingsThisWeek")} />
      ) : (
        <div>
          {[...grouped.entries()].map(([groupKey, groupEvents]) => {
            const displayKey = groupKey.startsWith("__today__")
              ? groupKey.replace("__today__", "Today — ")
              : groupKey;
            const isToday = groupKey.startsWith("__today__");

            return (
              <div key={groupKey}>
                <div className="border-b border-white/[0.04] bg-white/[0.01] px-5 py-2">
                  <p
                    className={`text-[11px] font-medium uppercase tracking-[0.12em] ${
                      isToday ? "text-emerald-400/80" : "text-white/30"
                    }`}
                  >
                    {displayKey}
                  </p>
                </div>
                <div className="divide-y divide-white/[0.03]">
                  {groupEvents.map((e) => (
                    <EventRow
                      key={e.id}
                      event={e}
                      isToday={isToday}
                      crmContact={
                        e.organizer_email
                          ? (contactByEmail.get(e.organizer_email.toLowerCase()) ?? null)
                          : null
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Widget>
  );
}

// ─── Meeting Intelligence Widget ──────────────────────────────────────────────

type IntelSignal = {
  icon: React.ElementType;
  color: string;
  text: string;
};

function MeetingIntelligenceWidget({
  events,
  thisWeekEvents,
  t,
}: {
  events: CalendarEventRow[];
  thisWeekEvents: CalendarEventRow[];
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  const signals: IntelSignal[] = [];

  if (events.length === 0) {
    signals.push({ icon: AlertCircle, color: "text-white/30", text: t("intelNoData") });
  } else {
    // Busiest day of week
    const dayCountMap: Record<number, number> = {};
    events.forEach((e) => {
      const day = new Date(e.start_at).getDay();
      dayCountMap[day] = (dayCountMap[day] ?? 0) + 1;
    });
    let busiestDayIndex = -1;
    let busiestDayCount = 0;
    Object.entries(dayCountMap).forEach(([day, count]) => {
      if (count > busiestDayCount) {
        busiestDayCount = count;
        busiestDayIndex = Number(day);
      }
    });
    if (busiestDayIndex >= 0) {
      signals.push({
        icon: TrendingUp,
        color: "text-violet-300",
        text: t("intelBusiest", { day: localDayName(busiestDayIndex), count: busiestDayCount }),
      });
    }

    // Total meeting hours this week
    const totalMinutes = thisWeekEvents
      .filter((e) => !e.all_day)
      .reduce((sum, e) => {
        const diff = new Date(e.end_at).getTime() - new Date(e.start_at).getTime();
        return sum + Math.max(0, diff) / 60_000;
      }, 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    signals.push({
      icon: Clock,
      color: "text-cyan-300",
      text: t("intelTotalHours", { hours: totalHours }),
    });

    // Next meeting countdown
    const nextEvent = events[0];
    if (nextEvent) {
      const minutesUntil = Math.max(
        0,
        Math.round((new Date(nextEvent.start_at).getTime() - PAGE_NOW.getTime()) / 60_000)
      );
      if (minutesUntil < 60) {
        signals.push({
          icon: Zap,
          color: "text-amber-300",
          text: t("intelNextMeeting", { minutes: minutesUntil }),
        });
      } else if (minutesUntil < 1440) {
        signals.push({
          icon: Clock,
          color: "text-amber-300",
          text: t("intelNextMeetingHours", { hours: Math.round(minutesUntil / 60) }),
        });
      } else {
        const dateStr = new Date(nextEvent.start_at).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        signals.push({
          icon: CalendarDays,
          color: "text-white/50",
          text: t("intelNextMeetingDate", { date: dateStr }),
        });
      }
    }

    // Meeting load
    const weeklyCount = thisWeekEvents.length;
    if (weeklyCount === 0) {
      signals.push({ icon: CheckCircle2, color: "text-emerald-300", text: t("intelLoadLight", { count: 0 }) });
    } else if (weeklyCount < 4) {
      signals.push({ icon: CheckCircle2, color: "text-emerald-300", text: t("intelLoadLight", { count: weeklyCount }) });
    } else if (weeklyCount < 8) {
      signals.push({ icon: AlertTriangle, color: "text-amber-300", text: t("intelLoadModerate", { count: weeklyCount }) });
    } else {
      signals.push({ icon: AlertCircle, color: "text-red-300", text: t("intelLoadHeavy", { count: weeklyCount }) });
    }
  }

  return (
    <Widget
      icon={Sparkles}
      iconColor="text-violet-300"
      iconBg="border-violet-500/20 bg-violet-500/10"
      title={t("meetingIntelligence")}
      subtitle={t("meetingIntelligenceSubtitle")}
    >
      <div className="space-y-2.5 px-5 py-4">
        {signals.map((s, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <s.icon size={13} className={`mt-0.5 shrink-0 ${s.color}`} />
            <p className="text-xs leading-relaxed text-white/55">{s.text}</p>
          </div>
        ))}
      </div>
    </Widget>
  );
}

// ─── Revenue Meetings Widget ──────────────────────────────────────────────────

function RevenueMeetingsWidget({
  events,
  contactByEmail,
  t,
}: {
  events: CalendarEventRow[];
  contactByEmail: Map<string, CalendarContact>;
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  const crmEvents = events.filter(
    (e) => e.organizer_email && contactByEmail.has(e.organizer_email.toLowerCase())
  );

  return (
    <Widget
      icon={TrendingUp}
      iconColor="text-emerald-300"
      iconBg="border-emerald-500/20 bg-emerald-500/10"
      title={t("revenueMeetings")}
      subtitle={t("revenueMeetingsSubtitle")}
      count={crmEvents.length}
    >
      {crmEvents.length === 0 ? (
        <WidgetEmptyState icon={TrendingUp} message={t("noRevenueMeetings")} />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {crmEvents.slice(0, 6).map((e) => {
            const contact = e.organizer_email
              ? (contactByEmail.get(e.organizer_email.toLowerCase()) ?? null)
              : null;
            return (
              <div key={e.id} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02]">
                <div className="w-14 shrink-0 text-right">
                  {e.all_day ? (
                    <span className="text-[10px] font-medium text-violet-300">All day</span>
                  ) : (
                    <p className="text-xs font-semibold text-white/70">{formatTime(e.start_at)}</p>
                  )}
                  <p className="mt-0.5 text-[10px] text-white/25">{formatDayLabel(e.start_at)}</p>
                </div>
                <div className="mt-1 shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/85">{e.title}</p>
                  {contact && (
                    <Link
                      href={`/dashboard/crm/${contact.id}`}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] text-cyan-300/70 transition-colors hover:text-cyan-300"
                    >
                      <User size={9} />
                      {contact.name}
                      {contact.company_name && (
                        <span className="text-white/25"> · {contact.company_name}</span>
                      )}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Widget>
  );
}

// ─── Linked Contacts Widget ───────────────────────────────────────────────────

function LinkedContactsWidget({
  linkedContacts,
  t,
}: {
  linkedContacts: LinkedContact[];
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  return (
    <Widget
      icon={User}
      iconColor="text-cyan-300"
      iconBg="border-cyan-500/20 bg-cyan-500/10"
      title={t("linkedContacts")}
      subtitle={t("linkedContactsSubtitle")}
      count={linkedContacts.length}
    >
      {linkedContacts.length === 0 ? (
        <WidgetEmptyState icon={User} message={t("noLinkedContacts")} />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {linkedContacts.slice(0, 8).map(({ contact, count }) => {
            const initial = contact.name[0]?.toUpperCase() ?? "?";
            return (
              <Link
                key={contact.id}
                href={`/dashboard/crm/${contact.id}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-[11px] font-semibold text-cyan-300">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/80">{contact.name}</p>
                  {contact.company_name && (
                    <p className="truncate text-[11px] text-white/30">{contact.company_name}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-xs text-white/25">{count}</span>
                  <ArrowRight size={11} className="text-white/20" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Widget>
  );
}

// ─── Linked Companies Widget ──────────────────────────────────────────────────

function LinkedCompaniesWidget({
  linkedCompanies,
  t,
}: {
  linkedCompanies: LinkedCompany[];
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  return (
    <Widget
      icon={Building2}
      iconColor="text-violet-300"
      iconBg="border-violet-500/20 bg-violet-500/10"
      title={t("linkedCompanies")}
      subtitle={t("linkedCompaniesSubtitle")}
      count={linkedCompanies.length}
    >
      {linkedCompanies.length === 0 ? (
        <WidgetEmptyState icon={Building2} message={t("noLinkedCompanies")} />
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {linkedCompanies.slice(0, 8).map((company) => {
            const initial = company.name[0]?.toUpperCase() ?? "?";
            return (
              <Link
                key={company.id}
                href={`/dashboard/companies/${company.id}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-[11px] font-semibold text-violet-300">
                  {initial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/80">{company.name}</p>
                  <p className="mt-0.5 text-[11px] text-white/30">
                    {company.count} {company.count === 1 ? t("meeting") : t("meetings")}
                  </p>
                </div>
                <ArrowRight size={11} className="text-white/20" />
              </Link>
            );
          })}
        </div>
      )}
    </Widget>
  );
}

// ─── No Connection State ──────────────────────────────────────────────────────

function NoConnectionState({
  connections,
  t,
}: {
  connections: CalendarConnection[];
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {t("commandCenterBadge")}
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">
          {t("commandCenterTitle")}
        </h1>
        <p className="mt-1 text-sm text-white/40">{t("commandCenterSubtitle")}</p>
      </div>

      <OrbitCard className="p-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <CalendarDays size={26} className="text-zinc-500" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white/80">{t("noConnectionsTitle")}</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/35">
              {t("noConnectionsSubtitle")}
            </p>
          </div>
          <a href="/api/calendar/connect/google">
            <OrbitButton variant="primary" className="mt-2">
              {t("connectGoogle")}
            </OrbitButton>
          </a>
        </div>
      </OrbitCard>

      <div>
        <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
          {t("connectionStatus")}
        </p>
        <CalendarConnectionCard connections={connections} />
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function CalendarCommandCenter({ events, connections, contacts }: Props) {
  const t = useTranslations("calendar");

  const hasConnection = connections.length > 0;

  // CRM contact lookup by email (lowercase)
  const contactByEmail = new Map<string, CalendarContact>();
  contacts.forEach((c) => {
    if (c.email) contactByEmail.set(c.email.toLowerCase(), c);
  });

  // Today's meetings
  const todayEvents = events.filter((e) => isSameDay(new Date(e.start_at), PAGE_NOW));

  // This week's meetings (next 7 days from PAGE_NOW)
  const weekCutoff = new Date(PAGE_NOW.getTime() + SEVEN_DAYS_MS);
  const thisWeekEvents = events.filter((e) => new Date(e.start_at) <= weekCutoff);

  // CRM-matched events
  const crmEventsCount = events.filter(
    (e) => e.organizer_email && contactByEmail.has(e.organizer_email.toLowerCase())
  ).length;

  // Unique contacts with meeting counts (ranked by frequency)
  const contactMeetingMap = new Map<string, LinkedContact>();
  events.forEach((e) => {
    if (!e.organizer_email) return;
    const contact = contactByEmail.get(e.organizer_email.toLowerCase());
    if (!contact) return;
    const existing = contactMeetingMap.get(contact.id);
    if (existing) {
      existing.count++;
    } else {
      contactMeetingMap.set(contact.id, { contact, count: 1 });
    }
  });
  const linkedContacts = [...contactMeetingMap.values()].sort((a, b) => b.count - a.count);

  // Unique companies with meeting counts
  const companyMeetingMap = new Map<string, LinkedCompany>();
  linkedContacts.forEach(({ contact, count }) => {
    if (!contact.company_id || !contact.company_name) return;
    const existing = companyMeetingMap.get(contact.company_id);
    if (existing) {
      existing.count += count;
    } else {
      companyMeetingMap.set(contact.company_id, {
        id: contact.company_id,
        name: contact.company_name,
        count,
      });
    }
  });
  const linkedCompanies = [...companyMeetingMap.values()].sort((a, b) => b.count - a.count);

  if (!hasConnection) {
    return <NoConnectionState connections={connections} t={t} />;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {t("commandCenterBadge")}
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight">
            {t("commandCenterTitle")}
          </h1>
          <p className="mt-1 text-sm text-white/40">{t("commandCenterSubtitle")}</p>
        </div>
        <a href="/api/calendar/connect/google" className="mt-1 shrink-0">
          <OrbitButton variant="secondary" className="gap-2 text-sm">
            <CalendarDays size={14} />
            {t("addCalendar")}
          </OrbitButton>
        </a>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <OrbitStatCard title={t("statsUpcoming")} value={events.length} icon={CalendarDays} animated />
        <OrbitStatCard title={t("statsThisWeek")} value={thisWeekEvents.length} icon={Clock} animated />
        <OrbitStatCard title={t("statsConnected")} value={connections.length} icon={CheckCircle2} animated />
        <OrbitStatCard title={t("statsRevenueMeetings")} value={crmEventsCount} icon={TrendingUp} animated />
      </div>

      {/* ROW 1: Today (2/3) + Intelligence (1/3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayWidget events={todayEvents} contactByEmail={contactByEmail} t={t} />
        </div>
        <MeetingIntelligenceWidget events={events} thisWeekEvents={thisWeekEvents} t={t} />
      </div>

      {/* ROW 2: Revenue Meetings (1/2) + Linked Contacts (1/2) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueMeetingsWidget events={events} contactByEmail={contactByEmail} t={t} />
        <LinkedContactsWidget linkedContacts={linkedContacts} t={t} />
      </div>

      {/* ROW 3: This Week (2/3) + Linked Companies (1/3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ThisWeekWidget events={thisWeekEvents} contactByEmail={contactByEmail} t={t} />
        </div>
        <LinkedCompaniesWidget linkedCompanies={linkedCompanies} t={t} />
      </div>

      {/* CONNECTION MANAGEMENT */}
      <div>
        <p className="mb-4 text-[11px] uppercase tracking-[0.15em] text-zinc-500">
          {t("connectionStatus")}
        </p>
        <CalendarConnectionCard connections={connections} />
      </div>
    </div>
  );
}
