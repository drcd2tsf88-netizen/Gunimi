// Signal Query Layer — Today Experience
// Authority: docs/blueprints/TODAY_EXPERIENCE_BLUEPRINT.md
//            docs/blueprints/AI_PLATFORM_ARCHITECTURE.md
//
// Today reads ONLY from the Signal Archive.
// All business intelligence is produced by the Signal Engine and stored in
// workspace_signals. This layer maps archived signals to Today's presentation model.
//
// No business rules are computed here. No thresholds. No stale calculations.
// Those live in lib/signals/producers/. This layer only reads and maps.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { SIGNAL_REGISTRY } from "@/lib/signals/registry";
import type { SignalClaimer } from "@/lib/signals/types";
import type {
  TodayFocus,
  TodayAttentionItem,
  TodayRelationshipItem,
  TodayWorkItem,
  TodayHealth,
  ResolvedTodayData,
} from "@/lib/today/types";

// ─── Surface sets (derived from registry at module load) ─────────────────────

const FOCUS_TYPES = new Set(
  Object.entries(SIGNAL_REGISTRY)
    .filter(([, def]) => def.visibleOn.includes("today_focus" as SignalClaimer))
    .map(([type]) => type),
);

const ATTENTION_TYPES = new Set(
  Object.entries(SIGNAL_REGISTRY)
    .filter(([, def]) => def.visibleOn.includes("today_attention" as SignalClaimer))
    .map(([type]) => type),
);

const RELATIONSHIP_TYPES = new Set(
  Object.entries(SIGNAL_REGISTRY)
    .filter(([, def]) => def.visibleOn.includes("today_relationships" as SignalClaimer))
    .map(([type]) => type),
);

// Only task_due_today and task_overdue are surfaced in Work for Open Alpha.
// task_blocked and task_waiting_customer are in the registry but not yet
// presented in TodayWorkSection (no tag mapping; deferred to post-Alpha).
const WORK_SIGNAL_TYPES = new Set(["task_due_today", "task_overdue"]);

// Union of all Today-eligible types — used for a single efficient DB query
const ALL_TODAY_TYPES: string[] = [
  ...new Set([...FOCUS_TYPES, ...ATTENTION_TYPES, ...RELATIONSHIP_TYPES, ...WORK_SIGNAL_TYPES]),
];

// ─── Presentation limits ──────────────────────────────────────────────────────

const MAX_ATTENTION = 5;
const MAX_RELATIONSHIPS = 5;
const MAX_WORK = 8;

// ─── Signal priority ordering ─────────────────────────────────────────────────

const SEVERITY_RANK: Record<string, number> = { critical: 0, warning: 1, info: 2 };

// Secondary sort within same tier+severity: explicit type priority.
// Lower = shown first. Mirrors the original Today resolver urgency ordering.
const TYPE_PRIORITY: Record<string, number> = {
  deal_close_date_passed: 0,
  deal_approaching_close: 1,
  company_closing_deal: 2,
  deal_stale: 3,
  contact_deal_stalling: 4,
  contact_overdue_task: 5,
  task_overdue: 6,
  contact_stale: 7,
  contact_new_no_interaction: 8,
  task_due_today: 9,
};

// ─── Lean DB row type ─────────────────────────────────────────────────────────

type SignalRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  type: string;
  tier: number;
  severity: string;
  evidence_data: Record<string, string | number>;
  produced_at: string;
};

// ─── Entity name fetchers ─────────────────────────────────────────────────────

async function fetchNames(
  table: string,
  nameCol: string,
  ids: string[],
): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const { data } = await supabaseAdmin.from(table).select("*").in("id", ids);
  const map = new Map<string, string>();
  if (data) {
    for (const row of data as Record<string, unknown>[]) {
      const id = row["id"] as string | undefined;
      const val = row[nameCol] as string | undefined;
      if (id && val) map.set(id, val);
    }
  }
  return map;
}

// ─── Href builder ─────────────────────────────────────────────────────────────

function buildHref(entityType: string, entityId: string): string {
  switch (entityType) {
    case "deal":
      return `/dashboard/deals/${entityId}`;
    case "contact":
      return `/dashboard/contacts/${entityId}`;
    case "company":
      return `/dashboard/companies/${entityId}`;
    default:
      return "/dashboard/tasks";
  }
}

// ─── Presentation builders ────────────────────────────────────────────────────

function buildFocusItem(sig: SignalRow, entityName: string): TodayFocus {
  const days = Number(sig.evidence_data?.days ?? 0);
  const dealTitle = String(sig.evidence_data?.dealTitle ?? "");
  const href = buildHref(sig.entity_type, sig.entity_id);

  switch (sig.type) {
    case "deal_close_date_passed":
      return {
        actionKey: "today.focusDealPastCloseAction",
        actionParams: { title: entityName, days },
        reasonKey: "today.focusDealPastCloseReason",
        href,
      };
    case "deal_approaching_close":
      return {
        actionKey: "today.focusDealClosingAction",
        actionParams: { title: entityName, days },
        reasonKey: "today.focusDealClosingReason",
        href,
      };
    case "deal_stale":
      return {
        actionKey: "today.focusDealStaleAction",
        actionParams: { title: entityName, days },
        reasonKey: "today.focusDealStaleReason",
        href,
      };
    case "contact_deal_stalling":
      return {
        actionKey: "today.focusContactStaleAction",
        actionParams: { name: entityName, days },
        reasonKey: "today.focusContactStaleReason",
        reasonParams: { deal: dealTitle, days },
        href,
      };
    case "contact_overdue_task":
      return {
        actionKey: "today.focusContactOverdueTaskAction",
        actionParams: { name: entityName, days },
        reasonKey: "today.focusContactOverdueTaskReason",
        href,
      };
    case "company_closing_deal":
      return {
        actionKey: "today.focusCompanyClosingDealAction",
        actionParams: { company: entityName, dealTitle, days },
        reasonKey: "today.focusCompanyClosingDealReason",
        href,
      };
    default:
      return null;
  }
}

function buildAttentionItem(sig: SignalRow, entityName: string): TodayAttentionItem | null {
  const days = Number(sig.evidence_data?.days ?? 0);
  const dealTitle = String(sig.evidence_data?.dealTitle ?? "");
  const href = buildHref(sig.entity_type, sig.entity_id);
  const urgency: "critical" | "warning" = sig.severity === "critical" ? "critical" : "warning";

  let labelKey: string;
  let labelParams: Record<string, string | number> | undefined;

  switch (sig.type) {
    case "deal_close_date_passed":
      labelKey = "today.attentionDealPastClose";
      labelParams = { title: entityName, days };
      break;
    case "deal_approaching_close":
      labelKey = "today.attentionDealClosingSoon";
      labelParams = { title: entityName, days };
      break;
    case "deal_stale":
      labelKey = "today.attentionDealStale";
      labelParams = { title: entityName, days };
      break;
    case "contact_deal_stalling":
    case "contact_stale":
      labelKey = "today.attentionContactStale";
      labelParams = { name: entityName, days };
      break;
    case "contact_overdue_task":
      labelKey = "today.attentionContactOverdueTask";
      labelParams = { name: entityName, days };
      break;
    case "company_closing_deal":
      labelKey = "today.attentionCompanyClosingDeal";
      labelParams = { company: entityName, dealTitle, days };
      break;
    case "task_overdue":
      labelKey = "today.attentionTaskOverdue";
      labelParams = { title: entityName, days };
      break;
    default:
      return null;
  }

  return {
    id: `${sig.entity_type}:${sig.entity_id}`,
    labelKey,
    labelParams,
    href,
    urgency,
  };
}

function buildRelationshipItem(
  sig: SignalRow,
  entityName: string,
): TodayRelationshipItem | null {
  const days = Number(sig.evidence_data?.days ?? 0);
  const href = buildHref(sig.entity_type, sig.entity_id);

  switch (sig.type) {
    case "contact_stale":
    case "contact_deal_stalling":
      return {
        id: sig.entity_id,
        name: entityName,
        labelKey: "today.relationshipStale",
        labelParams: { days },
        href,
      };
    case "contact_new_no_interaction":
      return {
        id: sig.entity_id,
        name: entityName,
        labelKey: "today.relationshipNeverContacted",
        href,
      };
    default:
      return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Reads all active signals for the workspace from the Signal Archive and maps
 * them to the Today presentation model.
 *
 * This is the ONLY function Today may call to derive its content.
 * No business rules are computed here.
 */
export async function getTodaySignals(workspaceId: string): Promise<ResolvedTodayData> {
  const now = new Date().toISOString();

  const { data } = await supabaseAdmin
    .from("workspace_signals")
    .select("id, entity_type, entity_id, type, tier, severity, evidence_data, produced_at")
    .eq("workspace_id", workspaceId)
    .in("type", ALL_TODAY_TYPES)
    .in("state", ["active", "claimed"])
    .is("resolved_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("tier", { ascending: true })
    .order("produced_at", { ascending: false });

  const rows = (data ?? []) as SignalRow[];

  // Sort by tier → severity → type priority → recency
  rows.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    const sa = SEVERITY_RANK[a.severity] ?? 9;
    const sb = SEVERITY_RANK[b.severity] ?? 9;
    if (sa !== sb) return sa - sb;
    const ta = TYPE_PRIORITY[a.type] ?? 99;
    const tb = TYPE_PRIORITY[b.type] ?? 99;
    if (ta !== tb) return ta - tb;
    return new Date(b.produced_at).getTime() - new Date(a.produced_at).getTime();
  });

  // Collect entity IDs by type for batch name enrichment
  const dealIds: string[] = [];
  const contactIds: string[] = [];
  const companyIds: string[] = [];
  const taskIds: string[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const key = `${row.entity_type}:${row.entity_id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (row.entity_type === "deal") dealIds.push(row.entity_id);
    else if (row.entity_type === "contact") contactIds.push(row.entity_id);
    else if (row.entity_type === "company") companyIds.push(row.entity_id);
    else if (row.entity_type === "task") taskIds.push(row.entity_id);
  }

  const [dealNames, contactNames, companyNames, taskTitles] = await Promise.all([
    fetchNames("workspace_deals", "title", dealIds),
    fetchNames("workspace_contacts", "name", contactIds),
    fetchNames("workspace_companies", "name", companyIds),
    fetchNames("workspace_tasks", "title", taskIds),
  ]);

  function getEntityName(row: SignalRow): string {
    switch (row.entity_type) {
      case "deal":
        return dealNames.get(row.entity_id) ?? "—";
      case "contact":
        return contactNames.get(row.entity_id) ?? "—";
      case "company":
        return companyNames.get(row.entity_id) ?? "—";
      case "task":
        return taskTitles.get(row.entity_id) ?? "—";
      default:
        return "—";
    }
  }

  // ── Focus ────────────────────────────────────────────────────────────────

  const focusCandidates = rows.filter((r) => FOCUS_TYPES.has(r.type));
  const focusSignal = focusCandidates[0] ?? null;
  const focus: TodayFocus = focusSignal
    ? buildFocusItem(focusSignal, getEntityName(focusSignal))
    : null;

  // Track entities surfaced in Focus/Attention to prevent Relationships duplicates
  const surfacedEntityIds = new Set<string>();
  if (focusSignal) surfacedEntityIds.add(focusSignal.entity_id);

  // ── Attention ────────────────────────────────────────────────────────────
  // Priority: remaining focus-eligible → attention-only signals
  // Dedup by entity_id (one signal per entity per section)

  const attention: TodayAttentionItem[] = [];
  const attentionEntityIds = new Set<string>();
  if (focusSignal) attentionEntityIds.add(focusSignal.entity_id);

  // Process all attention-eligible signals in sorted order
  for (const sig of rows) {
    if (attention.length >= MAX_ATTENTION) break;
    if (!ATTENTION_TYPES.has(sig.type)) continue;
    if (sig === focusSignal) continue; // skip the focus signal
    if (attentionEntityIds.has(sig.entity_id)) continue;

    const item = buildAttentionItem(sig, getEntityName(sig));
    if (item) {
      attention.push(item);
      attentionEntityIds.add(sig.entity_id);
      surfacedEntityIds.add(sig.entity_id);
    }
  }

  // ── Relationships ────────────────────────────────────────────────────────

  const relationships: TodayRelationshipItem[] = [];

  for (const sig of rows) {
    if (relationships.length >= MAX_RELATIONSHIPS) break;
    if (!RELATIONSHIP_TYPES.has(sig.type)) continue;
    if (surfacedEntityIds.has(sig.entity_id)) continue;

    const item = buildRelationshipItem(sig, getEntityName(sig));
    if (item) {
      relationships.push(item);
      surfacedEntityIds.add(sig.entity_id);
    }
  }

  // ── Work ─────────────────────────────────────────────────────────────────

  const work: TodayWorkItem[] = [];
  const workTaskIds = new Set<string>();

  for (const sig of rows) {
    if (work.length >= MAX_WORK) break;
    if (!WORK_SIGNAL_TYPES.has(sig.type)) continue;
    if (sig.entity_type !== "task") continue;
    if (workTaskIds.has(sig.entity_id)) continue;

    work.push({
      id: sig.entity_id,
      title: taskTitles.get(sig.entity_id) ?? "—",
      tag: sig.type === "task_overdue" ? "overdue" : "today",
    });
    workTaskIds.add(sig.entity_id);
  }

  // Overdue tasks first
  work.sort((a, b) => {
    if (a.tag === b.tag) return 0;
    return a.tag === "overdue" ? -1 : 1;
  });

  // ── Health ───────────────────────────────────────────────────────────────

  const focusAttentionSignals = rows.filter(
    (r) => ATTENTION_TYPES.has(r.type) || FOCUS_TYPES.has(r.type),
  );
  const hasCritical = focusAttentionSignals.some((s) => s.severity === "critical");
  const uniqueEntityCount = new Set(focusAttentionSignals.map((s) => s.entity_id)).size;

  const health: TodayHealth =
    uniqueEntityCount === 0
      ? { level: "healthy", labelKey: "today.healthHealthy" }
      : hasCritical || uniqueEntityCount >= 3
        ? { level: "urgent", labelKey: "today.healthUrgent" }
        : {
            level: "attention",
            labelKey: "today.healthAttention",
            labelParams: { count: uniqueEntityCount },
          };

  return { health, focus, attention, relationships, work };
}
