// Signal Scanner — Missing Follow-Up
//
// Detects active deals that are stale AND have a linked contact but no recent
// follow-up. Produces contact_deal_stalling signals on the linked contact.
//
// Design constraint: THIS SCANNER ONLY PRODUCES — IT NEVER RESOLVES.
//
// Why: missingFollowUpScan paginates over deals independently of each other.
// If a contact has two deals (A = stale, B = active), processing deal B would
// incorrectly resolve the contact_deal_stalling signal produced by deal A.
// By never resolving, we guarantee safety. Resolution is owned by mutation hooks
// (when activity is recorded on the deal, dealProducer resolves with origin filter).
//
// Origin matches dealProducer origin (deal_resolver:${dealId}) so dedup is correct.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceSignal } from "@/lib/signals/engine";
import { MS_PER_DAY, STALE_THRESHOLD_DAYS } from "@/lib/deals/constants";
import type { ScanContext, ScanResult } from "../types";

type DealRow = {
  id: string;
  stage: string;
  updated_at: string | null;
  contact_id: string;
  title: string;
};

export async function missingFollowUpScan(context: ScanContext): Promise<ScanResult> {
  const startMs = Date.now();
  const now = Date.now();
  const staleThresholdMs = STALE_THRESHOLD_DAYS * MS_PER_DAY;
  const staleCutoff = new Date(now - staleThresholdMs).toISOString();

  let query = supabaseAdmin
    .from("workspace_deals")
    .select("id, stage, updated_at, contact_id, title")
    .eq("workspace_id", context.workspaceId)
    .not("stage", "in", '("won","lost")')
    .not("contact_id", "is", null)
    .lt("updated_at", staleCutoff)
    .order("id")
    .limit(context.batchSize);

  if (context.cursor) {
    query = query.gt("id", context.cursor);
  }

  const { data } = await query;
  const deals = (data ?? []) as DealRow[];

  if (deals.length === 0) {
    return {
      scanType: "missing_follow_up",
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

  for (const deal of deals) {
    if (context.signal?.aborted) {
      return {
        scanType: "missing_follow_up",
        workspaceId: context.workspaceId,
        entitiesScanned: scanned,
        signalsProduced,
        signalsResolved: 0,
        completed: false,
        nextCursor: resumeCursor,
        durationMs: Date.now() - startMs,
      };
    }

    const daysSinceUpdate = deal.updated_at
      ? Math.floor((now - new Date(deal.updated_at).getTime()) / MS_PER_DAY)
      : STALE_THRESHOLD_DAYS + 1;

    const origin = `deal_resolver:${deal.id}`;

    await produceSignal({
      workspaceId: context.workspaceId,
      entityType: "contact",
      entityId: deal.contact_id,
      type: "contact_deal_stalling",
      confidence: "high",
      evidenceData: { days: daysSinceUpdate, dealTitle: deal.title },
      producedBy: "deal_resolver",
      origin,
    });

    signalsProduced++;
    resumeCursor = deal.id;
    scanned++;
  }

  const hasMore = deals.length === context.batchSize;

  return {
    scanType: "missing_follow_up",
    workspaceId: context.workspaceId,
    entitiesScanned: scanned,
    signalsProduced,
    signalsResolved: 0,
    completed: !hasMore,
    nextCursor: hasMore ? resumeCursor : null,
    durationMs: Date.now() - startMs,
  };
}
