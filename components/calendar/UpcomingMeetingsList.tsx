"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CalendarDays, Pencil, X, Loader2, Sparkles, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

import GunimiCard from "@/components/ui/GunimiCard";
import EditMeetingSheet, { type MeetingUpdatedPayload } from "@/components/calendar/EditMeetingSheet";
import { cancelCalendarEvent } from "@/server/actions/calendar/cancelCalendarEvent";
import { getAiMeetingPrep, type MeetingPrep } from "@/server/actions/calendar/getAiMeetingPrep";
import type { CalendarEventRow } from "@/types/calendar";

type Props = {
  meetings: CalendarEventRow[];
  hasCalendar?: boolean;
  labelKey?: string;
  contactId?: string;
  dealId?: string;
  companyId?: string;
};

export default function UpcomingMeetingsList({
  meetings,
  hasCalendar = false,
  contactId,
  dealId,
  companyId,
}: Props) {
  const t = useTranslations("calendar");
  const [editEvent, setEditEvent] = useState<CalendarEventRow | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Optimistic overrides — base list always stays in sync with prop (picks up new meetings after router.refresh)
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(new Set());
  const [localEdits, setLocalEdits] = useState<Record<string, Partial<CalendarEventRow>>>({});

  // AI prep state
  const [prepData, setPrepData] = useState<Record<string, MeetingPrep | null>>({});
  const [prepLoading, setPrepLoading] = useState<Set<string>>(new Set());
  const [prepOpen, setPrepOpen] = useState<Set<string>>(new Set());

  const displayMeetings = meetings
    .filter((m) => !cancelledIds.has(m.id))
    .map((m) => (localEdits[m.id] ? { ...m, ...localEdits[m.id] } : m));

  if (displayMeetings.length === 0) return null;

  function handleCancel(event: CalendarEventRow) {
    if (isPending) return;
    setCancellingId(event.id);
    startTransition(async () => {
      const result = await cancelCalendarEvent(
        event.id,
        event.provider_event_id,
        contactId ?? event.contact_id,
        dealId ?? event.deal_id,
        companyId ?? event.company_id
      );
      if (result.success) {
        setCancelledIds((prev) => new Set([...prev, event.id]));
        toast.success(t("meetingCancelled"), { id: "cancel-meeting" });
      } else if (result.error === "insufficient_scope" || result.error === "token_expired") {
        toast.error(t("meetingScheduleReconnect"), { id: "cancel-meeting-err" });
      } else {
        toast.error(t("meetingCancelFailed"), { id: "cancel-meeting-err" });
      }
      setCancellingId(null);
    });
  }

  async function handlePrep(event: CalendarEventRow) {
    const cid = event.contact_id;
    if (!cid) return;

    if (prepOpen.has(event.id)) {
      setPrepOpen((prev) => { const s = new Set(prev); s.delete(event.id); return s; });
      return;
    }

    setPrepOpen((prev) => new Set([...prev, event.id]));

    if (prepData[event.id] !== undefined) return;

    setPrepLoading((prev) => new Set([...prev, event.id]));
    try {
      const result = await getAiMeetingPrep(event.title, cid);
      setPrepData((prev) => ({ ...prev, [event.id]: result }));
    } catch {
      setPrepData((prev) => ({ ...prev, [event.id]: null }));
    } finally {
      setPrepLoading((prev) => { const s = new Set(prev); s.delete(event.id); return s; });
    }
  }

  return (
    <>
      <GunimiCard className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={12} className="text-blue-400/70" aria-hidden />
          <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium">
            {t("upcomingMeetings")}
          </span>
        </div>
        <div className="space-y-1.5">
          {displayMeetings.map((meeting) => {
            const hasPrep = !!meeting.contact_id;
            const isPrepOpen = prepOpen.has(meeting.id);
            const isLoadingPrep = prepLoading.has(meeting.id);
            const prep = prepData[meeting.id];

            return (
              <div key={meeting.id} className="rounded-xl border border-blue-500/10 bg-blue-500/[0.04] transition-colors hover:border-blue-500/25 hover:bg-blue-500/[0.08]">
                <div className="group flex items-center gap-3 px-3 py-2.5">
                  {/* Date badge */}
                  <Link href="/dashboard/calendar" className="shrink-0">
                    <div className="flex h-8 w-8 flex-col items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                      <span className="text-[9px] font-semibold leading-none text-blue-300">
                        {new Date(meeting.start_at)
                          .toLocaleDateString(undefined, { month: "short" })
                          .toUpperCase()}
                      </span>
                      <span className="text-sm font-bold leading-none text-blue-200">
                        {new Date(meeting.start_at).getDate()}
                      </span>
                    </div>
                  </Link>

                  {/* Title + time */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-white/80">{meeting.title}</p>
                    <p className="mt-0.5 text-[10px] text-white/35">
                      {meeting.all_day
                        ? t("allDay")
                        : new Date(meeting.start_at).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      {meeting.location && (
                        <span className="ml-1.5 text-white/20">· {meeting.location}</span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                    {hasPrep && (
                      <button
                        onClick={() => handlePrep(meeting)}
                        aria-label={t("aiMeetingPrep")}
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-purple-500/10 hover:text-purple-400/70"
                      >
                        {isPrepOpen ? <ChevronDown size={11} /> : <Sparkles size={11} />}
                      </button>
                    )}
                    {hasCalendar && (
                      <>
                        <button
                          onClick={() => setEditEvent(meeting)}
                          aria-label={t("editMeeting")}
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          onClick={() => handleCancel(meeting)}
                          disabled={cancellingId === meeting.id}
                          aria-label={t("cancelMeeting")}
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400/70 disabled:opacity-50"
                        >
                          {cancellingId === meeting.id ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : (
                            <X size={11} />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* AI Prep panel */}
                {isPrepOpen && (
                  <div className="border-t border-blue-500/10 px-3 pb-3 pt-2.5">
                    {isLoadingPrep ? (
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-white/[0.06]" />
                        <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-white/[0.06]" />
                        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-white/[0.06]" />
                      </div>
                    ) : prep ? (
                      <div className="space-y-2.5">
                        <p className="text-[11px] leading-relaxed text-white/50">{prep.contextSummary}</p>
                        {prep.suggestedTopics.length > 0 && (
                          <div>
                            <p className="mb-1 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                              {t("aiMeetingPrepTopics")}
                            </p>
                            <ul className="space-y-0.5">
                              {prep.suggestedTopics.map((topic, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-[11px] text-white/45">
                                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-purple-400/40" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {prep.keyPoints.length > 0 && (
                          <div>
                            <p className="mb-1 text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                              {t("aiMeetingPrepKeyPoints")}
                            </p>
                            <ul className="space-y-0.5">
                              {prep.keyPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-[11px] text-white/45">
                                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-400/40" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-white/30">{t("aiMeetingPrepError")}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GunimiCard>

      {editEvent && (
        <EditMeetingSheet
          open={!!editEvent}
          onOpenChange={(v) => { if (!v) setEditEvent(null); }}
          event={editEvent}
          onUpdated={(payload: MeetingUpdatedPayload) => {
            setLocalEdits((prev) => ({
              ...prev,
              [editEvent.id]: {
                title: payload.title,
                start_at: payload.startAt,
                end_at: payload.endAt,
              },
            }));
            setEditEvent(null);
          }}
        />
      )}
    </>
  );
}
