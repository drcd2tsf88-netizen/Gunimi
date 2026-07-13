// Signal Engine — Core
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// All writes use supabaseAdmin (service role) — signals are server-side infrastructure.
// This module is never imported in client components.

import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import { SIGNAL_REGISTRY, type SignalTypeDefinition } from "./registry";
import {
  rowToSignal,
  DISMISSAL_TTL_HOURS,
  SIGNAL_CLAIMER_PRIORITY,
  type Signal,
  type SignalType,
  type SignalClaimer,
  type SignalState,
  type SignalEvolutionState,
  type DismissalType,
  type EvolutionEvent,
  type ProduceSignalParams,
  type EvidenceUpdate,
  type SeverityDelta,
  type SignalSeverity,
  type SignalRow,
} from "./types";

// ─── Deduplication ────────────────────────────────────────────────────────────

/**
 * Finds an existing active/claimed/suppressed signal matching the dedup key.
 * For task-level signals, the origin field is included in the check.
 */
async function findDuplicate(
  params: ProduceSignalParams,
  def: SignalTypeDefinition,
): Promise<SignalRow | null> {
  let query = supabaseAdmin
    .from("workspace_signals")
    .select("*")
    .eq("workspace_id", params.workspaceId)
    .eq("type", params.type)
    .eq("entity_type", params.entityType)
    .eq("entity_id", params.entityId)
    .in("state", ["active", "claimed", "suppressed"]);

  if (def.taskLevelDedup) {
    query = query.eq("origin", params.origin);
  }

  const { data } = await query.maybeSingle();
  return data ?? null;
}

// ─── TTL calculation ──────────────────────────────────────────────────────────

function computeExpiresAt(
  params: ProduceSignalParams,
  def: SignalTypeDefinition,
): string | null {
  if (params.expiresAt) return params.expiresAt;
  if (def.ttlDays === null) return null;
  const d = new Date();
  d.setDate(d.getDate() + def.ttlDays);
  return d.toISOString();
}

// ─── Produce ──────────────────────────────────────────────────────────────────

/**
 * Creates a new signal or refreshes an existing duplicate.
 *
 * Blueprint invariants enforced:
 * - Invariant 1  — Evidence before existence (caller must supply evidenceData)
 * - Invariant 3  — Tier from registry, never overridden at runtime
 * - Invariant 5  — Deduplication at ingestion
 */
export async function produceSignal(
  params: ProduceSignalParams,
): Promise<Signal | null> {
  const def = SIGNAL_REGISTRY[params.type];

  const duplicate = await findDuplicate(params, def);

  if (duplicate) {
    // Refresh timestamp and evidence; do not create a new signal (Invariant 5)
    const { data, error } = await supabaseAdmin
      .from("workspace_signals")
      .update({
        produced_at: new Date().toISOString(),
        evidence_data: params.evidenceData,
        confidence: params.confidence,
        origin: params.origin,
      })
      .eq("id", duplicate.id)
      .select()
      .single();

    if (error || !data) {
      logger.error("signal dedup refresh failed:", error);
      return null;
    }

    return rowToSignal(data as SignalRow);
  }

  const initialEvolution: EvolutionEvent = {
    evolutionId: randomUUID(),
    timestamp: new Date().toISOString(),
    previousState: "initial" as SignalEvolutionState,
    newState: "initial" as SignalEvolutionState,
    trigger: "signal_produced",
    evidenceUpdate: {
      evidenceKey: def.evidenceKey,
      evidenceData: params.evidenceData,
    },
    severityChange: null,
  };

  const { data, error } = await supabaseAdmin
    .from("workspace_signals")
    .insert({
      workspace_id: params.workspaceId,
      entity_type: params.entityType,
      entity_id: params.entityId,
      type: params.type,
      tier: def.tier,
      severity: def.severity,
      confidence: params.confidence,
      evidence_key: def.evidenceKey,
      evidence_data: params.evidenceData,
      action_type: def.actionType,
      produced_by: params.producedBy,
      produced_at: new Date().toISOString(),
      expires_at: computeExpiresAt(params, def),
      resolution_condition: def.resolutionCondition,
      state: "active" satisfies SignalState,
      claimed_by: null,
      suppressed_until: null,
      resolved_at: null,
      origin: params.origin,
      correlation_id: params.correlationId ?? randomUUID(),
      parent_signal_id: params.parentSignalId ?? null,
      evolution_history: [initialEvolution],
    })
    .select()
    .single();

  if (error || !data) {
    logger.error("signal produce failed:", error);
    return null;
  }

  return rowToSignal(data as SignalRow);
}

// ─── Claim ────────────────────────────────────────────────────────────────────

/**
 * Claims a signal for a consumer and suppresses it for all lower-priority consumers.
 *
 * Blueprint invariant enforced:
 * - Invariant 2  — Single ownership (one claim per signal)
 * - Invariant 10 — No cross-tier claims (caller responsibility — enforced in queries)
 */
export async function claimSignal(
  signalId: string,
  claimer: SignalClaimer,
): Promise<Signal | null> {
  const { data, error } = await supabaseAdmin
    .from("workspace_signals")
    .update({
      state: "claimed" satisfies SignalState,
      claimed_by: claimer,
    })
    .eq("id", signalId)
    .in("state", ["active", "suppressed"])
    .select()
    .single();

  if (error || !data) {
    logger.error("signal claim failed:", error);
    return null;
  }

  return rowToSignal(data as SignalRow);
}

// ─── Suppression ──────────────────────────────────────────────────────────────

/**
 * Suppresses a signal for lower-priority consumers.
 * Called after a higher-priority consumer claims a signal.
 *
 * Blueprint: Chapter 8, Level 1 — Claim suppression.
 */
export async function suppressSignal(signalId: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("workspace_signals")
    .update({ state: "suppressed" satisfies SignalState })
    .eq("id", signalId)
    .eq("state", "active");

  if (error) {
    logger.error("signal suppress failed:", error);
    return false;
  }
  return true;
}

// ─── User Dismissal ───────────────────────────────────────────────────────────

/**
 * Applies user dismissal suppression to a signal.
 *
 * Blueprint invariant enforced:
 * - Invariant 9  — Dismissal does not equal resolution
 *
 * "Not relevant" dismissal sets suppressedUntil far in the future — signal re-enters
 * only when the underlying condition resolves and a NEW signal is produced.
 */
export async function dismissSignal(
  signalId: string,
  dismissalType: DismissalType,
): Promise<Signal | null> {
  const ttlHours = DISMISSAL_TTL_HOURS[dismissalType];

  let suppressedUntil: string;
  if (ttlHours === null) {
    // "Not relevant" — 10 years in the future; re-enters only via new signal instance
    const far = new Date();
    far.setFullYear(far.getFullYear() + 10);
    suppressedUntil = far.toISOString();
  } else {
    const until = new Date();
    until.setHours(until.getHours() + ttlHours);
    suppressedUntil = until.toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from("workspace_signals")
    .update({
      state: "suppressed" satisfies SignalState,
      suppressed_until: suppressedUntil,
    })
    .eq("id", signalId)
    .in("state", ["active", "claimed"])
    .select()
    .single();

  if (error || !data) {
    logger.error("signal dismiss failed:", error);
    return null;
  }

  return rowToSignal(data as SignalRow);
}

// ─── Resolution ───────────────────────────────────────────────────────────────

/**
 * Resolves a signal and immediately archives it.
 *
 * Resolution is permanent for event-driven signals. The archive is permanent.
 * Blueprint: Chapter 10, Chapter 11.
 */
export async function resolveSignal(
  signalId: string,
  trigger: string,
): Promise<Signal | null> {
  const now = new Date().toISOString();

  // Fetch the signal first to append the resolved evolution event
  const { data: existing } = await supabaseAdmin
    .from("workspace_signals")
    .select("*")
    .eq("id", signalId)
    .maybeSingle();

  if (!existing) return null;

  const resolvedEvolution: EvolutionEvent = {
    evolutionId: randomUUID(),
    timestamp: now,
    previousState: "evolved",
    newState: "resolved",
    trigger,
    evidenceUpdate: null,
    severityChange: null,
  };

  const history = [
    ...(existing.evolution_history as EvolutionEvent[]),
    resolvedEvolution,
  ];

  const { data, error } = await supabaseAdmin
    .from("workspace_signals")
    .update({
      state: "archived" satisfies SignalState,
      resolved_at: now,
      evolution_history: history,
    })
    .eq("id", signalId)
    .not("state", "in", '("resolved","archived")')
    .select()
    .single();

  if (error || !data) {
    logger.error("signal resolve failed:", error);
    return null;
  }

  return rowToSignal(data as SignalRow);
}

// ─── Evolution ────────────────────────────────────────────────────────────────

/**
 * Records a state transition on an existing signal.
 *
 * Blueprint: Chapter 19 — Signal Evolution.
 * Evolution does not change type, entityType, entityId, tier, or workspaceId.
 */
export async function evolveSignal(params: {
  signalId: string;
  previousState: SignalEvolutionState;
  newState: SignalEvolutionState;
  trigger: string;
  evidenceUpdate?: EvidenceUpdate;
  severityChange?: SeverityDelta;
}): Promise<Signal | null> {
  const { data: existing } = await supabaseAdmin
    .from("workspace_signals")
    .select("*")
    .eq("id", params.signalId)
    .maybeSingle();

  if (!existing) return null;

  const evolutionEvent: EvolutionEvent = {
    evolutionId: randomUUID(),
    timestamp: new Date().toISOString(),
    previousState: params.previousState,
    newState: params.newState,
    trigger: params.trigger,
    evidenceUpdate: params.evidenceUpdate ?? null,
    severityChange: params.severityChange ?? null,
  };

  const history = [
    ...(existing.evolution_history as EvolutionEvent[]),
    evolutionEvent,
  ];

  const updatePayload: Record<string, unknown> = {
    evolution_history: history,
  };

  if (params.evidenceUpdate) {
    updatePayload.evidence_key = params.evidenceUpdate.evidenceKey;
    updatePayload.evidence_data = params.evidenceUpdate.evidenceData;
  }

  if (params.severityChange) {
    updatePayload.severity = params.severityChange.to satisfies SignalSeverity;
  }

  const { data, error } = await supabaseAdmin
    .from("workspace_signals")
    .update(updatePayload)
    .eq("id", params.signalId)
    .not("state", "in", '("resolved","archived")')
    .select()
    .single();

  if (error || !data) {
    logger.error("signal evolve failed:", error);
    return null;
  }

  return rowToSignal(data as SignalRow);
}

// ─── TTL Expiration Sweep ─────────────────────────────────────────────────────

/**
 * Archives all signals in a workspace whose TTL has elapsed.
 *
 * Blueprint: Chapter 10 — Time-based expiration.
 * Called periodically (e.g., on Today load or via a scheduled function).
 *
 * Returns the number of signals archived.
 */
export async function expireSignals(workspaceId: string): Promise<number> {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("workspace_signals")
    .update({
      state: "archived" satisfies SignalState,
      resolved_at: now,
    })
    .eq("workspace_id", workspaceId)
    .not("state", "in", '("resolved","archived")')
    .not("expires_at", "is", null)
    .lt("expires_at", now)
    .select("id");

  if (error) {
    logger.error("signal TTL expiration sweep failed:", error);
    return 0;
  }

  return data?.length ?? 0;
}

/**
 * Restores suppressed signals whose suppressedUntil has elapsed back to active.
 *
 * Blueprint: Chapter 8, Level 2 — "signal re-enters when the dismissal TTL expires."
 */
export async function restoreExpiredSuppressions(
  workspaceId: string,
): Promise<number> {
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("workspace_signals")
    .update({
      state: "active" satisfies SignalState,
      suppressed_until: null,
      claimed_by: null,
    })
    .eq("workspace_id", workspaceId)
    .eq("state", "suppressed")
    .not("suppressed_until", "is", null)
    .lt("suppressed_until", now)
    .select("id");

  if (error) {
    logger.error("suppression restore failed:", error);
    return 0;
  }

  return data?.length ?? 0;
}

// ─── Claim priority validation ────────────────────────────────────────────────

/**
 * Returns true if claimer A has higher priority than claimer B.
 * Used by consumers before attempting to claim.
 */
export function hasHigherClaimPriority(
  a: SignalClaimer,
  b: SignalClaimer,
): boolean {
  return SIGNAL_CLAIMER_PRIORITY.indexOf(a) < SIGNAL_CLAIMER_PRIORITY.indexOf(b);
}

export type { Signal, SignalType };
