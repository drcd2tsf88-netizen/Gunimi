// Signal Producer — Meeting Scanner
// Evaluates upcoming calendar events linked to CRM contacts.
// Produces:
//   - meeting_approaching  : event with contact starts within 24 h
//   - meeting_no_preparation: event with contact, no note for that contact in last 7 days

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceSignal } from "@/lib/signals/engine";
import { resolveSignalIfExists, type SignalProductionStats } from "./_resolveByType";

const APPROACHING_HOURS = 24;
const NO_PREP_NOTE_DAYS = 7;
const MS_PER_DAY = 86_400_000;

export type MeetingProducerInput = {
  workspaceId: string;
  eventId: string;
  contactId: string;
  startAt: string;
};

export async function produceMeetingSignals(
  input: MeetingProducerInput,
): Promise<SignalProductionStats> {
  const { workspaceId, eventId, contactId, startAt } = input;

  let signalsProduced = 0;
  let signalsResolved = 0;

  const now = Date.now();
  const startMs = new Date(startAt).getTime();
  const hoursUntil = (startMs - now) / 3_600_000;
  const origin = `meeting_scanner:${eventId}`;

  // Signal expires when the meeting starts — no lingering after the fact
  const expiresAt = startAt;

  // ─── meeting_approaching ──────────────────────────────────────────────────

  if (hoursUntil > 0 && hoursUntil <= APPROACHING_HOURS) {
    const produced = await produceSignal({
      workspaceId,
      entityType: "contact",
      entityId: contactId,
      type: "meeting_approaching",
      confidence: "high",
      evidenceData: { hoursUntil: Math.round(hoursUntil), eventId },
      producedBy: "meeting_scanner",
      origin,
      expiresAt,
    });
    if (produced) signalsProduced++;
  } else {
    signalsResolved += await resolveSignalIfExists(
      workspaceId,
      contactId,
      "meeting_approaching",
      "meeting_passed_or_far",
      origin,
    );
  }

  // ─── meeting_no_preparation ───────────────────────────────────────────────
  // Only check if meeting is within 48 h (wider window than approaching)

  if (hoursUntil > 0 && hoursUntil <= 48) {
    const cutoff = new Date(now - NO_PREP_NOTE_DAYS * MS_PER_DAY).toISOString();

    const { count } = await supabaseAdmin
      .from("workspace_notes")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("contact_id", contactId)
      .gte("created_at", cutoff);

    const hasRecentNote = (count ?? 0) > 0;

    if (!hasRecentNote) {
      const produced = await produceSignal({
        workspaceId,
        entityType: "contact",
        entityId: contactId,
        type: "meeting_no_preparation",
        confidence: "medium",
        evidenceData: { eventId, noteDays: NO_PREP_NOTE_DAYS },
        producedBy: "meeting_scanner",
        origin,
        expiresAt,
      });
      if (produced) signalsProduced++;
    } else {
      signalsResolved += await resolveSignalIfExists(
        workspaceId,
        contactId,
        "meeting_no_preparation",
        "note_added",
        origin,
      );
    }
  }

  return { signalsProduced, signalsResolved };
}
