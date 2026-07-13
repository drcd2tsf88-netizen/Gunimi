// Signal Scanner — Relationship Stale
//
// Evaluates ALL contacts in the workspace for temporal conditions:
//   - contact_stale (no interaction in 30+ days)
//   - contact_new_no_interaction (new contact, no first touch in 14 days)
//   - contact_no_company, contact_no_reach
//   - contact_overdue_task (per-task, evaluated against contact's tasks)
//
// contact_stale is the primary temporal gap: it can only be detected when
// last_contacted_at falls behind a threshold — no mutation resets it unless
// an actual interaction (email, meeting, note) is recorded.
//
// Delegates to produceContactSignals() for all logic.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceContactSignals } from "@/lib/signals/producers/contactProducer";
import type { ScanContext, ScanResult } from "../types";

type ContactRow = {
  id: string;
  last_contacted_at: string | null;
  created_at: string;
  email: string | null;
  phone: string | null;
  company_id: string | null;
};

export async function relationshipStaleScan(context: ScanContext): Promise<ScanResult> {
  const startMs = Date.now();

  let query = supabaseAdmin
    .from("workspace_contacts")
    .select("id, last_contacted_at, created_at, email, phone, company_id")
    .eq("workspace_id", context.workspaceId)
    .order("id")
    .limit(context.batchSize);

  if (context.cursor) {
    query = query.gt("id", context.cursor);
  }

  const { data } = await query;
  const contacts = (data ?? []) as ContactRow[];

  if (contacts.length === 0) {
    return {
      scanType: "relationship_stale",
      workspaceId: context.workspaceId,
      entitiesScanned: 0,
      signalsProduced: 0,
      signalsResolved: 0,
      completed: true,
      nextCursor: null,
      durationMs: Date.now() - startMs,
    };
  }

  let resumeCursor = context.cursor;
  let scanned = 0;
  let signalsProduced = 0;
  let signalsResolved = 0;

  for (const contact of contacts) {
    if (context.signal?.aborted) {
      return {
        scanType: "relationship_stale",
        workspaceId: context.workspaceId,
        entitiesScanned: scanned,
        signalsProduced,
        signalsResolved,
        completed: false,
        nextCursor: resumeCursor,
        durationMs: Date.now() - startMs,
      };
    }

    const stats = await produceContactSignals({
      workspaceId: context.workspaceId,
      contactId: contact.id,
      lastContactedAt: contact.last_contacted_at,
      createdAt: contact.created_at,
      email: contact.email,
      phone: contact.phone,
      companyId: contact.company_id,
    });

    signalsProduced += stats.signalsProduced;
    signalsResolved += stats.signalsResolved;
    resumeCursor = contact.id;
    scanned++;
  }

  const hasMore = contacts.length === context.batchSize;

  return {
    scanType: "relationship_stale",
    workspaceId: context.workspaceId,
    entitiesScanned: scanned,
    signalsProduced,
    signalsResolved,
    completed: !hasMore,
    nextCursor: hasMore ? resumeCursor : null,
    durationMs: Date.now() - startMs,
  };
}
