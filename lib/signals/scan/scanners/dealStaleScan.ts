// Signal Scanner — Deal Stale
//
// Evaluates ALL active deals in the workspace for temporal conditions:
//   - deal_stale (no update in 14+ days)
//   - deal_approaching_close (close date within 7 days)
//   - deal_close_date_passed (close date in the past)
//   - deal_missing_close_date, deal_missing_value, deal_no_primary_contact
//   - cross-entity: company_closing_deal, contact_deal_stalling
//
// Delegates to produceDealSignals() for all logic — no signal evaluation duplication.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceDealSignals } from "@/lib/signals/producers/dealProducer";
import type { ScanContext, ScanResult } from "../types";

type DealRow = {
  id: string;
  stage: string;
  value: number | null;
  expected_close_date: string | null;
  updated_at: string | null;
  contact_id: string | null;
  company_id: string | null;
  title: string;
};

export async function dealStaleScan(context: ScanContext): Promise<ScanResult> {
  const startMs = Date.now();

  let query = supabaseAdmin
    .from("workspace_deals")
    .select("id, stage, value, expected_close_date, updated_at, contact_id, company_id, title")
    .eq("workspace_id", context.workspaceId)
    .not("stage", "in", '("won","lost")')
    .order("id")
    .limit(context.batchSize);

  if (context.cursor) {
    query = query.gt("id", context.cursor);
  }

  const { data } = await query;
  const deals = (data ?? []) as DealRow[];

  if (deals.length === 0) {
    return {
      scanType: "deal_stale",
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

  for (const deal of deals) {
    if (context.signal?.aborted) {
      return {
        scanType: "deal_stale",
        workspaceId: context.workspaceId,
        entitiesScanned: scanned,
        signalsProduced,
        signalsResolved,
        completed: false,
        nextCursor: resumeCursor,
        durationMs: Date.now() - startMs,
      };
    }

    const stats = await produceDealSignals({
      workspaceId: context.workspaceId,
      dealId: deal.id,
      stage: deal.stage,
      value: deal.value,
      expectedCloseDate: deal.expected_close_date,
      updatedAt: deal.updated_at,
      contactId: deal.contact_id,
      companyId: deal.company_id,
      title: deal.title,
    });

    signalsProduced += stats.signalsProduced;
    signalsResolved += stats.signalsResolved;
    resumeCursor = deal.id;
    scanned++;
  }

  const hasMore = deals.length === context.batchSize;

  return {
    scanType: "deal_stale",
    workspaceId: context.workspaceId,
    entitiesScanned: scanned,
    signalsProduced,
    signalsResolved,
    completed: !hasMore,
    nextCursor: hasMore ? resumeCursor : null,
    durationMs: Date.now() - startMs,
  };
}
