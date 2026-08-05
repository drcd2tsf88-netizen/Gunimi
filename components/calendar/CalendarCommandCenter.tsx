"use client";

import { useTransition, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  LayoutList,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  User,
  X,
  Zap,
} from "lucide-react";

import toast from "react-hot-toast";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiStatCard from "@/components/ui/GunimiStatCard";
import GunimiButton from "@/components/ui/GunimiButton";
import CalendarConnectionCard from "@/components/calendar/CalendarConnectionCard";
import type { CalendarConnection, CalendarEventRow } from "@/types/calendar";
import type { CalendarContact } from "@/server/actions/calendar/getCalendarContacts";
import type { WorkspaceCalendarItem } from "@/server/actions/calendar/getWorkspaceCalendarItems";

import { createNote } from "@/server/actions/notes/createNote";
import { createTask } from "@/server/actions/tasks/createTask";

// Module-level time reference — avoids calling Date.now() during render
const PAGE_NOW = new Date();
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

type Props = {
  events: CalendarEventRow[];
  connections: CalendarConnection[];
  contacts: CalendarContact[];
  workspaceItems: WorkspaceCalendarItem[];
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

function formatDayLabel(iso: string, todayLabel: string, tomorrowLabel: string): string {
  const d = new Date(iso);
  if (isSameDay(d, PAGE_NOW)) return todayLabel;
  const tomorrow = new Date(PAGE_NOW);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(d, tomorrow)) return tomorrowLabel;
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
  return new Date(2024, 0, 7 + dayIndex).toLocaleDateString(undefined, { weekday: "long" });
}

function formatEventDuration(startIso: string, endIso: string): string {
  const mins = Math.round(
    (new Date(endIso).getTime() - new Date(startIso).getTime()) / 60_000
  );
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ─── Event Detail Panel ───────────────────────────────────────────────────────

type EventDetailPanelProps = {
  event: CalendarEventRow;
  crmContact: CalendarContact | null;
  onClose: () => void;
  onEventUpdated?: (id: string, changes: Partial<CalendarEventRow>) => void;
  onEventDeleted?: (id: string) => void;
  t: ReturnType<typeof useTranslations<"calendar">>;
};

function EventDetailPanel({ event, crmContact, onClose, onEventUpdated, onEventDeleted, t }: EventDetailPanelProps) {
  const [creatingNote, startCreateNote] = useTransition();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(event.title);
  const [editStartAt, setEditStartAt] = useState(
    event.all_day ? "" : event.start_at.slice(0, 16)
  );
  const [editEndAt, setEditEndAt] = useState(
    event.all_day ? "" : event.end_at.slice(0, 16)
  );
  const [saving, startSave] = useTransition();
  const [deleting, startDelete] = useTransition();

  function handleCreateMeetingNote() {
    startCreateNote(async () => {
      const title = `${t("meetingNotePrefix")}: ${event.title}`;
      const lines: string[] = [];
      if (event.description) lines.push(event.description);
      if (event.location) lines.push(`${t("location")}: ${event.location}`);
      const content = lines.join("\n\n") || undefined;

      const contactId = crmContact?.id ?? undefined;
      const companyId = crmContact?.company_id ?? undefined;

      const result = await createNote({ title, content, contactId, companyId });
      if (result) {
        toast.success(t("meetingNoteCreated"));
      } else {
        toast.error(t("failedToCreateMeetingNote"));
      }
    });
  }

  function handleSaveEvent() {
    startSave(async () => {
      const res = await fetch("/api/calendar/events/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          title: editTitle.trim() || event.title,
          startAt: editStartAt ? new Date(editStartAt).toISOString() : undefined,
          endAt: editEndAt ? new Date(editEndAt).toISOString() : undefined,
        }),
      });

      if (res.status === 403) {
        toast.error(t("reconnectForEditing"));
        return;
      }
      if (!res.ok) {
        toast.error(t("failedToSaveEvent"));
        return;
      }

      const data = await res.json() as { title: string; start_at: string; end_at: string };
      onEventUpdated?.(event.id, { title: data.title, start_at: data.start_at, end_at: data.end_at });
      setEditing(false);
      toast.success(t("eventSaved"));
    });
  }

  function handleDeleteEvent() {
    startDelete(async () => {
      const res = await fetch(`/api/calendar/events/delete?eventId=${event.id}`, { method: "DELETE" });

      if (res.status === 403) {
        toast.error(t("reconnectForEditing"));
        return;
      }
      if (!res.ok && res.status !== 204) {
        toast.error(t("failedToSaveEvent"));
        return;
      }

      onEventDeleted?.(event.id);
      onClose();
      toast.success(t("eventDeleted"));
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-white/10 bg-[#060816]/95 backdrop-blur-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-6 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500">
              {t("eventDetailTitle")}
            </p>
            {editing ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-violet-500/30 bg-white/[0.04] px-2 py-1 text-base font-semibold text-white outline-none focus:border-violet-500/60"
              />
            ) : (
              <h2 className="mt-1 truncate text-base font-semibold text-white/90">
                {event.title}
              </h2>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {editing ? (
              <>
                <button
                  onClick={handleSaveEvent}
                  disabled={saving}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-500/10 disabled:opacity-50"
                >
                  {t("saveEvent")}
                </button>
                <button
                  onClick={() => { setEditing(false); setEditTitle(event.title); }}
                  className="rounded-lg px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-white/[0.05]"
                >
                  {t("cancelEdit")}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white/70"
              >
                <Pencil size={11} />
                {t("editEvent")}
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-white/[0.08] p-1.5 text-white/40 transition-colors hover:text-white/70"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* TIME + METADATA */}
          <div className="space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            {/* Time */}
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15">
                <Clock size={9} className="text-violet-300" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                  {t("timeLabel")}
                </p>
                {editing && !event.all_day ? (
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    <input
                      type="datetime-local"
                      value={editStartAt}
                      onChange={(e) => setEditStartAt(e.target.value)}
                      className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-2 py-1 text-xs text-white outline-none focus:border-violet-500/40 [color-scheme:dark]"
                    />
                    <input
                      type="datetime-local"
                      value={editEndAt}
                      onChange={(e) => setEditEndAt(e.target.value)}
                      className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-2 py-1 text-xs text-white outline-none focus:border-violet-500/40 [color-scheme:dark]"
                    />
                  </div>
                ) : event.all_day ? (
                  <p className="mt-0.5 text-sm text-white/80">{t("allDay")}</p>
                ) : (
                  <p className="mt-0.5 text-sm text-white/80">
                    {formatTime(event.start_at)} – {formatTime(event.end_at)}
                    <span className="ml-2 text-xs text-white/35">
                      ({formatEventDuration(event.start_at, event.end_at)})
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.05]">
                  <MapPin size={9} className="text-white/40" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                    {t("location")}
                  </p>
                  <p className="mt-0.5 text-sm text-white/70">{event.location}</p>
                </div>
              </div>
            )}

            {/* Status */}
            {event.status === "tentative" && (
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[10px] text-yellow-300">
                  {t("tentative")}
                </span>
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          {event.description && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                {t("descriptionLabel")}
              </p>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/60">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* CRM LINKS */}
          {crmContact && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500">
                {t("linkedRecords")}
              </p>
              <div className="space-y-2">
                <Link
                  href={`/dashboard/contacts/${crmContact.id}`}
                  className="flex items-center gap-3 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.06] px-4 py-3 transition-colors hover:border-cyan-500/30"
                >
                  <User size={13} className="shrink-0 text-cyan-300" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-cyan-200">{crmContact.name}</p>
                    {crmContact.email && (
                      <p className="text-[11px] text-white/30">{crmContact.email}</p>
                    )}
                  </div>
                  <ArrowRight size={11} className="shrink-0 text-white/20" />
                </Link>

                {crmContact.company_id && crmContact.company_name && (
                  <Link
                    href={`/dashboard/companies/${crmContact.company_id}`}
                    className="flex items-center gap-3 rounded-xl border border-violet-500/15 bg-violet-500/[0.06] px-4 py-3 transition-colors hover:border-violet-500/30"
                  >
                    <Building2 size={13} className="shrink-0 text-violet-300" />
                    <p className="flex-1 text-sm font-medium text-violet-200">
                      {crmContact.company_name}
                    </p>
                    <ArrowRight size={11} className="shrink-0 text-white/20" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="border-t border-white/[0.06] px-6 py-4">
          <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-zinc-500">
            {t("actionsLabel")}
          </p>
          <div className="flex flex-wrap gap-2">
            <GunimiButton
              variant="secondary"
              loading={creatingNote}
              onClick={handleCreateMeetingNote}
              className="gap-2 text-xs"
            >
              <FileText size={13} />
              {t("createMeetingNote")}
            </GunimiButton>

            {crmContact && (
              <Link href={`/dashboard/contacts/${crmContact.id}`}>
                <GunimiButton variant="secondary" className="gap-2 text-xs">
                  <User size={13} />
                  {t("viewContact")}
                </GunimiButton>
              </Link>
            )}

            {event.html_link && (
              <a href={event.html_link} target="_blank" rel="noopener noreferrer">
                <GunimiButton variant="secondary" className="gap-2 text-xs">
                  <ExternalLink size={13} />
                  {t("viewInCalendar")}
                </GunimiButton>
              </a>
            )}

            <button
              onClick={handleDeleteEvent}
              disabled={deleting}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/15 bg-red-500/[0.05] px-3 py-1.5 text-xs text-red-400/70 transition-colors hover:border-red-500/30 hover:text-red-300 disabled:opacity-50"
            >
              <Trash2 size={11} />
              {t("deleteEvent")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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
    <GunimiCard className="flex h-full flex-col">
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
    </GunimiCard>
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
  onClick?: () => void;
};

function EventRow({ event, isToday = false, crmContact, onClick }: EventRowProps) {
  const t = useTranslations("calendar");

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
      onClick={onClick}
      className={[
        "flex items-start gap-3 px-5 py-3.5 transition-colors",
        onClick ? "cursor-pointer hover:bg-white/[0.03]" : "hover:bg-white/[0.02]",
      ].join(" ")}
    >
      {/* Time */}
      <div className="w-14 shrink-0 text-right">
        {event.all_day ? (
          <span className="text-[10px] font-medium text-violet-300">{t("allDay")}</span>
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
          {event.html_link && !onClick && (
            <a
              href={event.html_link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-white/25 transition-colors hover:text-violet-300"
              onClick={(e) => e.stopPropagation()}
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
              {t("tentative")}
            </span>
          )}
          {crmContact && (
            <span
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-md border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 text-[10px] text-cyan-300"
            >
              <User size={8} />
              {crmContact.name}
            </span>
          )}
          {crmContact?.company_id && crmContact.company_name && (
            <span
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-300"
            >
              <Building2 size={8} />
              {crmContact.company_name}
            </span>
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
  onSelectEvent,
  t,
}: {
  events: CalendarEventRow[];
  contactByEmail: Map<string, CalendarContact>;
  onSelectEvent: (event: CalendarEventRow, contact: CalendarContact | null) => void;
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
          {events.map((e) => {
            const contact = e.organizer_email
              ? (contactByEmail.get(e.organizer_email.toLowerCase()) ?? null)
              : null;
            return (
              <EventRow
                key={e.id}
                event={e}
                isToday
                crmContact={contact}
                onClick={() => onSelectEvent(e, contact)}
              />
            );
          })}
        </div>
      )}
    </Widget>
  );
}

// ─── This Week Widget ─────────────────────────────────────────────────────────

function ThisWeekWidget({
  events,
  contactByEmail,
  onSelectEvent,
  t,
}: {
  events: CalendarEventRow[];
  contactByEmail: Map<string, CalendarContact>;
  onSelectEvent: (event: CalendarEventRow, contact: CalendarContact | null) => void;
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
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
            const isToday = groupKey.startsWith("__today__");
            const datePart = groupKey.replace("__today__", "");
            const displayKey = isToday ? `${t("today")} — ${datePart}` : groupKey;

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
                  {groupEvents.map((e) => {
                    const contact = e.organizer_email
                      ? (contactByEmail.get(e.organizer_email.toLowerCase()) ?? null)
                      : null;
                    return (
                      <EventRow
                        key={e.id}
                        event={e}
                        isToday={isToday}
                        crmContact={contact}
                        onClick={() => onSelectEvent(e, contact)}
                      />
                    );
                  })}
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
  onSelectEvent,
  t,
}: {
  events: CalendarEventRow[];
  contactByEmail: Map<string, CalendarContact>;
  onSelectEvent: (event: CalendarEventRow, contact: CalendarContact | null) => void;
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  const crmEvents = events.filter(
    (e) => e.organizer_email && contactByEmail.has(e.organizer_email.toLowerCase())
  );

  const todayLabel = t("today");
  const tomorrowLabel = t("tomorrow");

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
              <div
                key={e.id}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") onSelectEvent(e, contact); }}
                onClick={() => onSelectEvent(e, contact)}
                className="flex cursor-pointer items-start gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
              >
                <div className="w-14 shrink-0 text-right">
                  {e.all_day ? (
                    <span className="text-[10px] font-medium text-violet-300">{t("allDay")}</span>
                  ) : (
                    <p className="text-xs font-semibold text-white/70">{formatTime(e.start_at)}</p>
                  )}
                  <p className="mt-0.5 text-[10px] text-white/25">
                    {formatDayLabel(e.start_at, todayLabel, tomorrowLabel)}
                  </p>
                </div>
                <div className="mt-1 shrink-0">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white/85">{e.title}</p>
                  {contact && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-cyan-300/70">
                      <User size={9} />
                      {contact.name}
                      {contact.company_name && (
                        <span className="text-white/25"> · {contact.company_name}</span>
                      )}
                    </span>
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
                href={`/dashboard/contacts/${contact.id}`}
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

// ─── Gunimi Calendar — Weekly Grid + List ────────────────────────────────────

const PRIORITY_COLOR: Record<string, string> = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-zinc-500",
};

const PRIORITY_DOT: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-zinc-600",
};

function getWeekStart(offset: number): Date {
  const d = new Date(PAGE_NOW);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // go back to Monday
  d.setDate(d.getDate() + diff + offset * 7);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// ── Week Grid ──────────────────────────────────────────────────────────────────

function WeekGrid({
  items,
  weekOffset,
  onTaskCreated,
  t,
}: {
  items: WorkspaceCalendarItem[];
  weekOffset: number;
  onTaskCreated?: (item: WorkspaceCalendarItem) => void;
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  const weekStart = useMemo(() => getWeekStart(weekOffset), [weekOffset]);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const byDay = useMemo(() => {
    const map = new Map<string, WorkspaceCalendarItem[]>();
    for (const item of items) {
      if (item.isOverdue) continue;
      const k = dateKey(new Date(item.date));
      const arr = map.get(k) ?? [];
      arr.push(item);
      map.set(k, arr);
    }
    return map;
  }, [items]);

  const overdueItems = weekOffset === 0 ? items.filter((i) => i.isOverdue) : [];
  const [addingToDay, setAddingToDay] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [creatingTask, startCreateTask] = useTransition();

  function handleAddTask(dayKey: string, dateIso: string) {
    const title = newTaskTitle.trim();
    if (!title) { setAddingToDay(null); return; }
    startCreateTask(async () => {
      const result = await createTask({ title, due_date: dateIso });
      if (result) {
        onTaskCreated?.({
          id: result.id as string,
          type: "task",
          title: result.title as string,
          date: dateIso,
          status: result.status as string,
          priority: result.priority as string | null,
          href: "/dashboard/tasks",
          entityName: null,
          isOverdue: false,
          isDueToday: dateKey(new Date(dateIso)) === dateKey(PAGE_NOW),
        });
        toast.success(t("taskCreated"));
      } else {
        toast.error(t("failedToCreateTask"));
      }
      setAddingToDay(null);
      setNewTaskTitle("");
    });
  }

  return (
    <div className="space-y-4">
      {/* Overdue strip */}
      {overdueItems.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-red-500/20 bg-red-500/[0.04]">
          <div className="border-b border-red-500/10 px-4 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-red-400/80">
              {t("overdue")} · {overdueItems.length}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 p-3">
            {overdueItems.map((item) => (
              <WeekCard key={item.id} item={item} compact />
            ))}
          </div>
        </div>
      )}

      {/* 7-column grid */}
      <div className="grid grid-cols-7 gap-2 overflow-x-auto">
        {days.map((day) => {
          const isToday = isSameDay(day, PAGE_NOW);
          const isPast = day < PAGE_NOW && !isToday;
          const key = dateKey(day);
          const dayItems = byDay.get(key) ?? [];
          const dayName = day.toLocaleDateString(undefined, { weekday: "short" });
          const dayNum = day.getDate();
          const monthShort = day.toLocaleDateString(undefined, { month: "short" });

          return (
            <div
              key={key}
              className={`group flex min-h-[140px] flex-col rounded-xl border transition-colors ${
                isToday
                  ? "border-violet-500/30 bg-violet-500/[0.05]"
                  : isPast
                  ? "border-white/[0.04] bg-white/[0.01] opacity-60"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {/* Day header */}
              <div
                className={`flex flex-col items-center border-b py-2 ${
                  isToday ? "border-violet-500/20" : "border-white/[0.05]"
                }`}
              >
                <span
                  className={`text-[9px] font-medium uppercase tracking-[0.12em] ${
                    isToday ? "text-violet-300" : "text-white/30"
                  }`}
                >
                  {dayName}
                </span>
                <span
                  className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday
                      ? "bg-violet-600 text-white"
                      : "text-white/60"
                  }`}
                >
                  {dayNum}
                </span>
                {day.getDate() === 1 && (
                  <span className="text-[8px] text-white/20">{monthShort}</span>
                )}
              </div>

              {/* Items */}
              <div className="flex flex-1 flex-col gap-1 p-1.5">
                {dayItems.length === 0 && addingToDay !== key ? (
                  <span className="mt-2 text-center text-[9px] text-white/15">
                    {t("noItemsThisDay")}
                  </span>
                ) : (
                  dayItems.slice(0, 5).map((item) => (
                    <WeekCard key={item.id} item={item} />
                  ))
                )}
                {dayItems.length > 5 && (
                  <span className="px-1 text-[9px] text-white/25">
                    +{dayItems.length - 5}
                  </span>
                )}

                {/* Quick add */}
                {addingToDay === key ? (
                  <div className="mt-1 flex flex-col gap-1">
                    <input
                      autoFocus
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddTask(key, day.toISOString().slice(0, 10));
                        if (e.key === "Escape") { setAddingToDay(null); setNewTaskTitle(""); }
                      }}
                      placeholder={t("newTaskPlaceholder")}
                      className="w-full rounded-md border border-violet-500/30 bg-white/[0.05] px-1.5 py-1 text-[10px] text-white outline-none placeholder:text-white/20 focus:border-violet-500/60"
                    />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleAddTask(key, day.toISOString().slice(0, 10))}
                        disabled={creatingTask || !newTaskTitle.trim()}
                        className="flex-1 rounded-md bg-violet-600/70 px-1.5 py-0.5 text-[9px] font-medium text-white transition-colors hover:bg-violet-600 disabled:opacity-40"
                      >
                        {t("add")}
                      </button>
                      <button
                        onClick={() => { setAddingToDay(null); setNewTaskTitle(""); }}
                        className="rounded-md px-1.5 py-0.5 text-[9px] text-zinc-500 hover:text-white/50"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : !isPast ? (
                  <button
                    onClick={() => { setAddingToDay(key); setNewTaskTitle(""); }}
                    className="mt-auto flex items-center justify-center gap-0.5 rounded-md py-1 text-[9px] text-white/15 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.04] hover:text-white/40"
                  >
                    <Plus size={8} />
                    {t("addTask")}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekCard({
  item,
  compact = false,
}: {
  item: WorkspaceCalendarItem;
  compact?: boolean;
}) {
  const isTask = item.type === "task";
  const bg = isTask ? "bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/15" : "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15";
  const textColor = isTask ? "text-violet-200" : "text-emerald-200";
  const TypeIcon = isTask ? CheckCircle2 : TrendingUp;

  return (
    <Link
      href={item.href}
      className={`group flex items-start gap-1.5 rounded-lg border px-2 py-1.5 transition-colors ${bg} ${compact ? "max-w-[200px]" : "w-full"}`}
    >
      <TypeIcon size={9} className={`mt-0.5 shrink-0 ${textColor} opacity-70`} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[10px] font-medium leading-snug ${textColor}`}>
          {item.title}
        </p>
        {item.priority && (
          <span className={`mt-0.5 inline-block h-1 w-1 rounded-full ${PRIORITY_DOT[item.priority] ?? "bg-zinc-600"}`} />
        )}
      </div>
    </Link>
  );
}

// ── List View (legacy) ─────────────────────────────────────────────────────────

function ListRow({ item }: { item: WorkspaceCalendarItem }) {
  const TypeIcon = item.type === "task" ? CheckCircle2 : TrendingUp;
  return (
    <Link
      href={item.href}
      className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-white/[0.03]"
    >
      <div className="mt-1 shrink-0">
        <div className={`h-1.5 w-1.5 rounded-full ${item.type === "task" ? "bg-violet-500/60" : "bg-emerald-400"}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-white/80">{item.title}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-white/30">
            <TypeIcon size={9} />
            {item.type}
          </span>
          {item.priority && (
            <span className={`text-[10px] font-medium ${PRIORITY_COLOR[item.priority] ?? "text-white/30"}`}>
              {item.priority}
            </span>
          )}
          {item.entityName && (
            <span className="truncate text-[10px] text-white/25">{item.entityName}</span>
          )}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={`text-[10px] font-medium ${item.isOverdue ? "text-red-400" : item.isDueToday ? "text-emerald-400" : "text-white/30"}`}>
          {new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </p>
      </div>
    </Link>
  );
}

// ── Main Gunimi Calendar Widget ────────────────────────────────────────────────

function GunimCalendarWidget({
  items: initialItems,
  t,
}: {
  items: WorkspaceCalendarItem[];
  t: ReturnType<typeof useTranslations<"calendar">>;
}) {
  const [viewMode, setViewMode] = useState<"week" | "list">("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [localItems, setLocalItems] = useState(initialItems);

  function handleTaskCreated(item: WorkspaceCalendarItem) {
    setLocalItems((prev) => [...prev, item].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  }

  const items = localItems;
  const weekStart = getWeekStart(weekOffset);
  const weekEnd = addDays(weekStart, 6);
  const weekLabel = `${weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${weekEnd.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1">
            <button
              onClick={() => setViewMode("week")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "week" ? "bg-violet-600 text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              <CalendarDays size={12} />
              {t("weekViewTitle")}
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "list" ? "bg-white/[0.08] text-white/90" : "text-white/40 hover:text-white/70"
              }`}
            >
              <LayoutList size={12} />
              {t("listViewTitle")}
            </button>
          </div>
        </div>

        {viewMode === "week" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] text-white/40 transition-colors hover:border-white/15 hover:text-white/70"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className={`rounded-lg px-3 py-1 text-xs transition-colors ${
                weekOffset === 0
                  ? "bg-violet-600/20 text-violet-300"
                  : "text-white/35 hover:text-white/60"
              }`}
            >
              {weekOffset === 0 ? t("currentWeek") : weekLabel}
            </button>
            <button
              onClick={() => setWeekOffset((o) => o + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] text-white/40 transition-colors hover:border-white/15 hover:text-white/70"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}

        <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/30">
          {items.length}
        </span>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <CheckCircle2 size={20} className="text-zinc-600" />
          <p className="text-sm text-white/25">{t("gunimiCalendarEmpty")}</p>
        </div>
      ) : viewMode === "week" ? (
        <WeekGrid items={items} weekOffset={weekOffset} onTaskCreated={handleTaskCreated} t={t} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]">
          {items.filter((i) => i.isOverdue).length > 0 && (
            <div>
              <div className="border-b border-red-500/10 bg-red-500/[0.04] px-5 py-2">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-red-400/80">
                  {t("overdue")} · {items.filter((i) => i.isOverdue).length}
                </p>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {items.filter((i) => i.isOverdue).map((item) => <ListRow key={item.id} item={item} />)}
              </div>
            </div>
          )}
          <div className="divide-y divide-white/[0.03]">
            {items.filter((i) => !i.isOverdue).map((item) => <ListRow key={item.id} item={item} />)}
          </div>
        </div>
      )}
    </div>
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
      <GunimiHeading
        badge={t("commandCenterBadge")}
        title={t("commandCenterTitle")}
        subtitle={t("commandCenterSubtitle")}
      />

      <GunimiCard className="p-10">
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
            <GunimiButton variant="primary" className="mt-2">
              {t("connectGoogle")}
            </GunimiButton>
          </a>
        </div>
      </GunimiCard>

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

export default function CalendarCommandCenter({ events: initialEvents, connections, contacts, workspaceItems }: Props) {
  const t = useTranslations("calendar");
  const [activeTab, setActiveTab] = useState<"gunimi" | "google">("gunimi");
  const [localEvents, setLocalEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<{
    event: CalendarEventRow;
    contact: CalendarContact | null;
  } | null>(null);

  // New Google event modal state
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newEventStart, setNewEventStart] = useState("09:00");
  const [newEventEnd, setNewEventEnd] = useState("10:00");
  const [creatingEvent, startCreateEvent] = useTransition();

  function handleEventUpdated(id: string, changes: Partial<CalendarEventRow>) {
    setLocalEvents((prev) => prev.map((e) => e.id === id ? { ...e, ...changes } : e));
    setSelectedEvent((prev) => prev && prev.event.id === id ? { ...prev, event: { ...prev.event, ...changes } } : prev);
  }

  function handleEventDeleted(id: string) {
    setLocalEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function handleCreateNewEvent() {
    const title = newEventTitle.trim();
    if (!title) return;
    startCreateEvent(async () => {
      const startAt = new Date(`${newEventDate}T${newEventStart}:00`).toISOString();
      const endAt = new Date(`${newEventDate}T${newEventEnd}:00`).toISOString();
      const res = await fetch("/api/calendar/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, startAt, endAt }),
      });
      if (res.status === 403) {
        toast.error(t("reconnectForEditing"));
        return;
      }
      if (!res.ok) {
        toast.error(t("failedToSaveEvent"));
        return;
      }
      const data = await res.json() as { id: string; title: string; start_at: string; end_at: string };
      const newRow: CalendarEventRow = {
        id: data.id,
        provider_event_id: data.id,
        title: data.title,
        description: null,
        start_at: data.start_at,
        end_at: data.end_at,
        organizer_email: null,
        organizer_name: null,
        location: null,
        html_link: null,
        status: "confirmed",
        all_day: false,
      };
      setLocalEvents((prev) => [...prev, newRow].sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()));
      setShowNewEvent(false);
      setNewEventTitle("");
      toast.success(t("eventCreated"));
    });
  }
  const searchParams = useSearchParams();
  const router = useRouter();
  const isInitialConnect = searchParams.get("connected") === "true";
  const [syncDone, setSyncDone] = useState(false);
  const autoSyncing = isInitialConnect && !syncDone;

  // Auto-sync on first connect — callback redirects before sync completes
  useEffect(() => {
    if (!isInitialConnect || syncDone) return;
    fetch("/api/calendar/sync", { method: "POST" })
      .then(() => { setSyncDone(true); router.replace("/dashboard/calendar"); })
      .catch(() => { setSyncDone(true); router.replace("/dashboard/calendar"); });
  }, [isInitialConnect, syncDone, router]);

  const hasConnection = connections.length > 0;
  const events = localEvents;

  const contactByEmail = new Map<string, CalendarContact>();
  contacts.forEach((c) => {
    if (c.email) contactByEmail.set(c.email.toLowerCase(), c);
  });

  const todayEvents = events.filter((e) => isSameDay(new Date(e.start_at), PAGE_NOW));
  const weekCutoff = new Date(PAGE_NOW.getTime() + SEVEN_DAYS_MS);
  const thisWeekEvents = events.filter((e) => new Date(e.start_at) <= weekCutoff);

  const crmEventsCount = events.filter(
    (e) => e.organizer_email && contactByEmail.has(e.organizer_email.toLowerCase())
  ).length;

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

  function handleSelectEvent(event: CalendarEventRow, contact: CalendarContact | null) {
    setSelectedEvent({ event, contact });
  }

  if (!hasConnection) {
    return <NoConnectionState connections={connections} t={t} />;
  }

  return (
    <>
      {autoSyncing && (
        <div className="mb-4 flex items-center gap-3 rounded-[12px] border border-[#6D5BFF]/20 bg-[#6D5BFF]/[0.06] px-4 py-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#8B7DFF]" />
          <p className="text-[13px] text-[#9AA3B2]">{t("syncing")}</p>
        </div>
      )}
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <GunimiHeading
            badge={t("commandCenterBadge")}
            title={t("commandCenterTitle")}
            subtitle={t("commandCenterSubtitle")}
          />
          <a href="/api/calendar/connect/google" className="mt-1 shrink-0">
            <GunimiButton variant="secondary" className="gap-2 text-sm">
              <CalendarDays size={14} />
              {t("addCalendar")}
            </GunimiButton>
          </a>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <GunimiStatCard title={t("statsUpcoming")} value={events.length} icon={CalendarDays} animated />
          <GunimiStatCard title={t("statsThisWeek")} value={thisWeekEvents.length} icon={Clock} animated />
          <GunimiStatCard title={t("statsConnected")} value={connections.length} icon={CheckCircle2} animated />
          <GunimiStatCard title={t("statsRevenueMeetings")} value={crmEventsCount} icon={TrendingUp} animated />
        </div>

        {/* TAB SWITCHER */}
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
          <button
            onClick={() => setActiveTab("gunimi")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "gunimi"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Sparkles size={14} />
            {t("tabGunimi")}
            {workspaceItems.length > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeTab === "gunimi" ? "bg-white/20" : "bg-white/[0.06] text-white/40"}`}>
                {workspaceItems.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("google")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "google"
                ? "bg-white/[0.08] text-white/90"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <CalendarDays size={14} />
            {t("tabGoogle")}
            {events.length > 0 && (
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeTab === "google" ? "bg-white/10" : "bg-white/[0.06] text-white/40"}`}>
                {events.length}
              </span>
            )}
          </button>
        </div>

        {/* GUNIMI CALENDAR TAB */}
        {activeTab === "gunimi" && (
          <GunimCalendarWidget items={workspaceItems} t={t} />
        )}

        {/* GOOGLE CALENDAR TAB */}
        {activeTab === "google" && (
          <>
        {/* New Event button + modal */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-600">{t("googleEventsLabel")}</p>
          <button
            onClick={() => setShowNewEvent((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-violet-500/20 hover:text-violet-300"
          >
            <Plus size={12} />
            {t("newEvent")}
          </button>
        </div>

        {showNewEvent && (
          <div className="overflow-hidden rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-violet-300/70">{t("newEvent")}</p>
            <div className="space-y-2.5">
              <input
                autoFocus
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder={t("eventTitlePlaceholder")}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreateNewEvent(); if (e.key === "Escape") setShowNewEvent(false); }}
                className="w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-500/40"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-2 py-2 text-xs text-white outline-none focus:border-violet-500/40 [color-scheme:dark]"
                />
                <input
                  type="time"
                  value={newEventStart}
                  onChange={(e) => setNewEventStart(e.target.value)}
                  className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-2 py-2 text-xs text-white outline-none focus:border-violet-500/40 [color-scheme:dark]"
                />
                <input
                  type="time"
                  value={newEventEnd}
                  onChange={(e) => setNewEventEnd(e.target.value)}
                  className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-2 py-2 text-xs text-white outline-none focus:border-violet-500/40 [color-scheme:dark]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowNewEvent(false)} className="px-3 py-1.5 text-xs text-zinc-500 hover:text-white/50">
                  {t("cancelEdit")}
                </button>
                <button
                  onClick={handleCreateNewEvent}
                  disabled={creatingEvent || !newEventTitle.trim()}
                  className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-40"
                >
                  {t("createEventBtn")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ROW 1: Today (2/3) + Intelligence (1/3) */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TodayWidget events={todayEvents} contactByEmail={contactByEmail} onSelectEvent={handleSelectEvent} t={t} />
          </div>
          <MeetingIntelligenceWidget events={events} thisWeekEvents={thisWeekEvents} t={t} />
        </div>

        {/* ROW 2: Revenue Meetings (1/2) + Linked Contacts (1/2) */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueMeetingsWidget events={events} contactByEmail={contactByEmail} onSelectEvent={handleSelectEvent} t={t} />
          <LinkedContactsWidget linkedContacts={linkedContacts} t={t} />
        </div>

        {/* ROW 3: This Week (2/3) + Linked Companies (1/3) */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ThisWeekWidget events={thisWeekEvents} contactByEmail={contactByEmail} onSelectEvent={handleSelectEvent} t={t} />
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
          </>
        )}
      </div>

      {/* EVENT DETAIL PANEL */}
      {selectedEvent && (
        <EventDetailPanel
          event={selectedEvent.event}
          crmContact={selectedEvent.contact}
          onClose={() => setSelectedEvent(null)}
          onEventUpdated={handleEventUpdated}
          onEventDeleted={handleEventDeleted}
          t={t}
        />
      )}
    </>
  );
}
