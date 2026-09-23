"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { CalendarCog, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiField from "@/components/ui/GunimiField";
import GunimiInput from "@/components/ui/GunimiInput";

import { updateCalendarEvent } from "@/server/actions/calendar/updateCalendarEvent";
import type { CalendarEventRow } from "@/types/calendar";

export type MeetingUpdatedPayload = {
  title: string;
  startAt: string;
  endAt: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEventRow;
  onUpdated?: (payload: MeetingUpdatedPayload) => void;
};

const DURATIONS = [15, 30, 45, 60, 90, 120] as const;
type Duration = (typeof DURATIONS)[number];

const DURATION_KEYS: Record<Duration, string> = {
  15: "duration15",
  30: "duration30",
  45: "duration45",
  60: "duration60",
  90: "duration90",
  120: "duration120",
};

function toDateString(iso: string) {
  return iso.split("T")[0];
}

function toTimeString(iso: string) {
  return new Date(iso).toTimeString().slice(0, 5);
}

function guessDuration(startIso: string, endIso: string): Duration {
  const diff = Math.round(
    (new Date(endIso).getTime() - new Date(startIso).getTime()) / 60_000
  );
  const valid: Duration[] = [15, 30, 45, 60, 90, 120];
  return valid.includes(diff as Duration) ? (diff as Duration) : 30;
}

export default function EditMeetingSheet({ open, onOpenChange, event, onUpdated }: Props) {
  const t = useTranslations("calendar");
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(() => toDateString(event.start_at));
  const [time, setTime] = useState(() => toTimeString(event.start_at));
  const [duration, setDuration] = useState<Duration>(() =>
    guessDuration(event.start_at, event.end_at)
  );
  const [location, setLocation] = useState(event.location ?? "");
  const [notes, setNotes] = useState(event.description ?? "");
  const [reconnectNeeded, setReconnectNeeded] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;

    const startAt = new Date(`${date}T${time}:00`);
    const endAt = new Date(startAt.getTime() + duration * 60 * 1000);

    startTransition(async () => {
      const result = await updateCalendarEvent({
        eventId: event.id,
        providerEventId: event.provider_event_id,
        title: title.trim(),
        startAt,
        endAt,
        description: notes.trim() || undefined,
        location: location.trim() || undefined,
        contactId: event.contact_id,
        dealId: event.deal_id,
        companyId: event.company_id,
      });

      if (result.success) {
        toast.success(t("meetingUpdated"), { id: "update-meeting" });
        onOpenChange(false);
        onUpdated?.({
          title: title.trim(),
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
        });
      } else if (result.error === "insufficient_scope" || result.error === "token_expired") {
        setReconnectNeeded(true);
      } else {
        toast.error(t("meetingUpdateFailed"), { id: "update-meeting-err" });
      }
    });
  }

  const inputClass =
    "w-full rounded-[10px] border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[13px] text-[#F7F8FC] placeholder:text-[#9AA3B2]/40 focus:border-[#6D5BFF]/40 focus:outline-none focus:ring-1 focus:ring-[#6D5BFF]/20 transition-colors";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-[420px] bg-[#07090F] p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-white/[0.06] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#6D5BFF]/20 bg-[#6D5BFF]/10">
                <CalendarCog size={15} className="text-[#8B7DFF]" strokeWidth={1.75} />
              </div>
              <div>
                <SheetTitle className="text-[15px] font-semibold text-[#F7F8FC]">
                  {t("editMeeting")}
                </SheetTitle>
                <SheetDescription className="text-[12px] text-[#9AA3B2]/50">
                  {t("editMeetingSubtitle")}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {reconnectNeeded ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-red-500/20 bg-red-500/10">
                <AlertCircle size={18} className="text-red-400/70" strokeWidth={1.75} />
              </div>
              <p className="text-[14px] font-medium text-[#F7F8FC]">{t("meetingScheduleReconnect")}</p>
              <p className="text-[13px] text-[#9AA3B2]/60">{t("meetingScheduleReconnectHint")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex-1 space-y-4 px-6 py-5">
                <GunimiField label={t("meetingTitleLabel")}>
                  <GunimiInput
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("meetingTitlePlaceholder")}
                    required
                  />
                </GunimiField>

                <div className="grid grid-cols-2 gap-3">
                  <GunimiField label={t("meetingDateLabel")}>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </GunimiField>
                  <GunimiField label={t("meetingTimeLabel")}>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className={inputClass}
                    />
                  </GunimiField>
                </div>

                <GunimiField label={t("meetingDurationLabel")}>
                  <Select
                    value={String(duration)}
                    onValueChange={(v) => setDuration(Number(v) as Duration)}
                  >
                    <SelectTrigger className="w-full rounded-[10px] border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[13px] text-[#F7F8FC] focus:border-[#6D5BFF]/40 focus:ring-1 focus:ring-[#6D5BFF]/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          {t(DURATION_KEYS[d] as Parameters<typeof t>[0])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GunimiField>

                <GunimiField label={t("meetingLocationLabel")}>
                  <GunimiInput
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t("meetingLocationPlaceholder")}
                  />
                </GunimiField>

                <GunimiField label={t("meetingNotesLabel")}>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("meetingNotesPlaceholder")}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </GunimiField>
              </div>

              <SheetFooter className="border-t border-white/[0.06] px-6 py-4">
                <GunimiButton
                  type="submit"
                  variant="primary"
                  disabled={isPending || !title.trim()}
                  className="w-full"
                >
                  {isPending ? t("saving") : t("saveChanges")}
                </GunimiButton>
              </SheetFooter>
            </form>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
