// Signal Scanner — Company Stale
//
// Evaluates ALL companies in the workspace for temporal conditions:
//   - company_stale (no activity in 21+ days)
//   - company_no_contacts, company_no_active_deals, company_incomplete_profile
//
// Delegates to produceCompanySignals() which also fetches contacts and deals,
// giving a complete signal evaluation per company.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceCompanySignals } from "@/lib/signals/producers/companyProducer";
import type { ScanContext, ScanResult } from "../types";

type CompanyRow = {
  id: string;
  last_activity_at: string | null;
  industry: string | null;
};

export async function companyStaleScan(context: ScanContext): Promise<ScanResult> {
  const startMs = Date.now();

  let query = supabaseAdmin
    .from("workspace_companies")
    .select("id, last_activity_at, industry")
    .eq("workspace_id", context.workspaceId)
    .order("id")
    .limit(context.batchSize);

  if (context.cursor) {
    query = query.gt("id", context.cursor);
  }

  const { data } = await query;
  const companies = (data ?? []) as CompanyRow[];

  if (companies.length === 0) {
    return {
      scanType: "company_stale",
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

  for (const company of companies) {
    if (context.signal?.aborted) {
      return {
        scanType: "company_stale",
        workspaceId: context.workspaceId,
        entitiesScanned: scanned,
        signalsProduced,
        signalsResolved,
        completed: false,
        nextCursor: resumeCursor,
        durationMs: Date.now() - startMs,
      };
    }

    const stats = await produceCompanySignals({
      workspaceId: context.workspaceId,
      companyId: company.id,
      lastActivityAt: company.last_activity_at,
      industry: company.industry,
    });

    signalsProduced += stats.signalsProduced;
    signalsResolved += stats.signalsResolved;
    resumeCursor = company.id;
    scanned++;
  }

  const hasMore = companies.length === context.batchSize;

  return {
    scanType: "company_stale",
    workspaceId: context.workspaceId,
    entitiesScanned: scanned,
    signalsProduced,
    signalsResolved,
    completed: !hasMore,
    nextCursor: hasMore ? resumeCursor : null,
    durationMs: Date.now() - startMs,
  };
}
