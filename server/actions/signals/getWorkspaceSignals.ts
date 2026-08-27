"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getActiveSignalsForWorkspace } from "@/lib/signals/queries";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import type { Signal } from "@/lib/signals/types";

export type EnrichedSignal = Signal & { entityName: string; entityHref: string };

async function fetchNames(
  table: string,
  nameCol: string,
  ids: string[],
): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const { data } = await supabaseAdmin.from(table).select("id, " + nameCol).in("id", ids);
  const map = new Map<string, string>();
  if (data) {
    for (const row of data as unknown as Record<string, unknown>[]) {
      const id = row["id"] as string | undefined;
      const val = row[nameCol] as string | undefined;
      if (id && val) map.set(id, val);
    }
  }
  return map;
}

function buildHref(entityType: string, entityId: string): string {
  switch (entityType) {
    case "deal":    return `/dashboard/deals/${entityId}`;
    case "contact": return `/dashboard/contacts/${entityId}`;
    case "company": return `/dashboard/companies/${entityId}`;
    default:        return "/dashboard/tasks";
  }
}

export async function getWorkspaceSignals(): Promise<EnrichedSignal[]> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return [];

  const signals = await getActiveSignalsForWorkspace(workspace.id, supabaseAdmin);
  if (signals.length === 0) return [];

  const dealIds     = [...new Set(signals.filter((s) => s.entityType === "deal").map((s) => s.entityId))];
  const contactIds  = [...new Set(signals.filter((s) => s.entityType === "contact").map((s) => s.entityId))];
  const companyIds  = [...new Set(signals.filter((s) => s.entityType === "company").map((s) => s.entityId))];
  const taskIds     = [...new Set(signals.filter((s) => s.entityType === "task").map((s) => s.entityId))];

  const [dealNames, contactNames, companyNames, taskTitles] = await Promise.all([
    fetchNames("workspace_deals",    "title", dealIds),
    fetchNames("workspace_people", "name",  contactIds),
    fetchNames("workspace_companies","name",  companyIds),
    fetchNames("workspace_tasks",    "title", taskIds),
  ]);

  return signals.map((s) => {
    let entityName = "—";
    if (s.entityType === "deal")    entityName = dealNames.get(s.entityId)    ?? "—";
    if (s.entityType === "contact") entityName = contactNames.get(s.entityId) ?? "—";
    if (s.entityType === "company") entityName = companyNames.get(s.entityId) ?? "—";
    if (s.entityType === "task")    entityName = taskTitles.get(s.entityId)   ?? "—";
    return { ...s, entityName, entityHref: buildHref(s.entityType, s.entityId) };
  });
}
