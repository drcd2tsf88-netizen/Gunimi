"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

// Internal shape of a raw Supabase row with joined contact
type RawDealResult = {
  id: string;
  title: string;
  stage: string;
  value: number | null;
  contact: { id: string; name: string } | null;
};

export type DealRow = {
  id: string;
  title: string;
  stage: string;
  value: number | null;
  customer_name: string | null;
};

export type DealSearchRows = {
  deals: DealRow[];
};

const EMPTY: DealSearchRows = { deals: [] };

function toRow(raw: RawDealResult): DealRow {
  return {
    id: raw.id,
    title: raw.title,
    stage: raw.stage,
    value: raw.value,
    customer_name: raw.contact?.name ?? null,
  };
}

export async function searchDeals(query: string): Promise<DealSearchRows> {
  if (!query.trim()) return EMPTY;

  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return EMPTY;

    const supabase = await createClient();
    const pattern = `%${query}%`;

    // Queries 1 and 2 run in parallel.
    // Query 1: deals whose title or stage matches the query.
    // Query 2: contacts whose name matches — IDs used to find linked deals.
    const [titleStageResult, contactResult] = await Promise.all([
      supabase
        .from("workspace_deals")
        .select("id, title, stage, value, contact:workspace_contacts(id, name)")
        .eq("workspace_id", workspace.id)
        .or(`title.ilike.${pattern},stage.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(5),

      supabase
        .from("workspace_contacts")
        .select("id")
        .eq("workspace_id", workspace.id)
        .ilike("name", pattern)
        .limit(10),
    ]);

    if (titleStageResult.error) {
      logger.error("[searchDeals] title/stage query failed:", titleStageResult.error);
    }
    if (contactResult.error) {
      logger.error("[searchDeals] contact lookup failed:", contactResult.error);
    }

    const seenIds = new Set<string>();
    const rows: DealRow[] = [];

    for (const raw of (titleStageResult.data ?? []) as unknown as RawDealResult[]) {
      if (seenIds.has(raw.id)) continue;
      seenIds.add(raw.id);
      rows.push(toRow(raw));
    }

    // Query 3 (conditional): deals linked to contacts whose name matched.
    // contactResult is already workspace-scoped; deals query adds a second
    // workspace filter as defence-in-depth.
    const contactIds = (contactResult.data ?? []).map(
      (c: { id: string }) => c.id
    );

    if (contactIds.length > 0) {
      const { data: customerDeals, error: customerDealsError } = await supabase
        .from("workspace_deals")
        .select("id, title, stage, value, contact:workspace_contacts(id, name)")
        .eq("workspace_id", workspace.id)
        .in("contact_id", contactIds)
        .order("created_at", { ascending: false })
        .limit(5);

      if (customerDealsError) {
        logger.error("[searchDeals] customer deals query failed:", customerDealsError);
      }

      for (const raw of (customerDeals ?? []) as unknown as RawDealResult[]) {
        if (seenIds.has(raw.id)) continue;
        seenIds.add(raw.id);
        rows.push(toRow(raw));
      }
    }

    return { deals: rows };
  } catch (err) {
    logger.error("[searchDeals] unexpected error:", err);
    return EMPTY;
  }
}
