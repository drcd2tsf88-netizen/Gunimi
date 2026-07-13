// Signal Engine — Queries
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md Chapter 7, 11, 12
//
// Read-only access to the Signal Archive.
// All query functions accept a Supabase client so they can be used from
// either user-scoped (createClient) or service-role (supabaseAdmin) contexts.
//
// Expiry contract: every active-signal query filters out signals whose TTL has
// elapsed. This ensures every consumer — Today, Workspace panels, Business Memory —
// automatically inherits correct expiry behaviour without per-consumer workarounds.

import type { SupabaseClient } from "@supabase/supabase-js";
import { rowToSignal, type Signal, type SignalClaimer, type SignalTier, type SignalRow } from "./types";
import { SIGNAL_REGISTRY } from "./registry";

// ─── Active signal queries ─────────────────────────────────────────────────────

/**
 * All active and claimed signals for a workspace, ordered by tier ASC.
 * Excludes signals whose TTL has elapsed.
 *
 * Used by: Workspace situation layer, Business Memory (post-Alpha).
 */
export async function getActiveSignalsForWorkspace(
  workspaceId: string,
  supabase: SupabaseClient,
): Promise<Signal[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("workspace_signals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .in("state", ["active", "claimed"])
    .is("resolved_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("tier", { ascending: true })
    .order("produced_at", { ascending: false });

  if (error || !data) return [];
  return (data as SignalRow[]).map(rowToSignal);
}

/**
 * Active and claimed signals for a specific entity.
 * Excludes signals whose TTL has elapsed.
 *
 * Used by: Workspace Decision and Situation resolvers.
 */
export async function getActiveSignalsForEntity(
  workspaceId: string,
  entityId: string,
  supabase: SupabaseClient,
): Promise<Signal[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("workspace_signals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("entity_id", entityId)
    .in("state", ["active", "claimed"])
    .is("resolved_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("tier", { ascending: true })
    .order("produced_at", { ascending: false });

  if (error || !data) return [];
  return (data as SignalRow[]).map(rowToSignal);
}

/**
 * Active and claimed signals filtered by priority tier.
 * Excludes signals whose TTL has elapsed.
 *
 * Used by: Today/Focus and Today/Attention (tier 1),
 *          Today/Relationships (tier 2), Today/Work (tier 3).
 */
export async function getActiveSignalsByTier(
  workspaceId: string,
  tier: SignalTier,
  supabase: SupabaseClient,
): Promise<Signal[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("workspace_signals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("tier", tier)
    .in("state", ["active", "claimed"])
    .is("resolved_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("produced_at", { ascending: false });

  if (error || !data) return [];
  return (data as SignalRow[]).map(rowToSignal);
}

/**
 * Active signals visible to a specific consumer surface.
 * Filters by the consumer's eligible signal types using the Visibility Map (Ch. 12).
 * Excludes signals whose TTL has elapsed.
 * Does NOT claim — claiming is the engine's responsibility.
 */
export async function getSignalsForConsumer(
  workspaceId: string,
  consumer: SignalClaimer,
  supabase: SupabaseClient,
): Promise<Signal[]> {
  const eligibleTypes = Object.entries(SIGNAL_REGISTRY)
    .filter(([, def]) => def.visibleOn.includes(consumer))
    .map(([type]) => type);

  if (eligibleTypes.length === 0) return [];

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("workspace_signals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .in("type", eligibleTypes)
    .in("state", ["active", "claimed"])
    .is("resolved_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order("tier", { ascending: true })
    .order("produced_at", { ascending: false });

  if (error || !data) return [];

  const signals = (data as SignalRow[]).map(rowToSignal);

  // Exclude signals already claimed by a higher-priority consumer
  return signals.filter(
    (s) => s.claimedBy === null || s.claimedBy === consumer,
  );
}

// ─── Archive queries ───────────────────────────────────────────────────────────

/**
 * All archived signals for an entity, ordered oldest-first.
 *
 * Used by: Business Memory (post-Alpha) for pattern detection.
 * The archive is permanent — this query covers the full history.
 */
export async function getArchivedSignalsForEntity(
  workspaceId: string,
  entityId: string,
  supabase: SupabaseClient,
): Promise<Signal[]> {
  const { data, error } = await supabase
    .from("workspace_signals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("entity_id", entityId)
    .eq("state", "archived")
    .order("produced_at", { ascending: true });

  if (error || !data) return [];
  return (data as SignalRow[]).map(rowToSignal);
}

/**
 * Full archived signal history for a workspace.
 *
 * Used by: AI Core pattern detection across all entities (post-Alpha).
 * Supports pagination via offset/limit.
 */
export async function getArchivedSignalsForWorkspace(
  workspaceId: string,
  supabase: SupabaseClient,
  limit = 200,
  offset = 0,
): Promise<Signal[]> {
  const { data, error } = await supabase
    .from("workspace_signals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("state", "archived")
    .order("produced_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error || !data) return [];
  return (data as SignalRow[]).map(rowToSignal);
}

// ─── Single signal lookup ──────────────────────────────────────────────────────

/**
 * Fetches a single signal by ID. Returns null if not found.
 *
 * Used by: server actions that need to validate signal state before acting.
 */
export async function getSignalById(
  signalId: string,
  supabase: SupabaseClient,
): Promise<Signal | null> {
  const { data, error } = await supabase
    .from("workspace_signals")
    .select("*")
    .eq("id", signalId)
    .maybeSingle();

  if (error || !data) return null;
  return rowToSignal(data as SignalRow);
}

// ─── Correlation queries ───────────────────────────────────────────────────────

/**
 * All signals sharing a correlationId — reconstructs the full context of a
 * triggering event.
 *
 * Blueprint Chapter 18: "When AI Core later analyzes what preceded a deal win,
 * it can ask: show me all signals that shared a correlationId."
 */
export async function getSignalsByCorrelationId(
  correlationId: string,
  supabase: SupabaseClient,
): Promise<Signal[]> {
  const { data, error } = await supabase
    .from("workspace_signals")
    .select("*")
    .eq("correlation_id", correlationId)
    .order("produced_at", { ascending: true });

  if (error || !data) return [];
  return (data as SignalRow[]).map(rowToSignal);
}

/**
 * Returns the evolution chain for a signal — the signal itself and all of its
 * descendants (signals with parentSignalId pointing to it or its descendants).
 *
 * Blueprint Chapter 19: "A fully resolved signal ... carries a parentSignalId
 * pointing to the previous resolved signal."
 */
export async function getSignalEvolutionChain(
  signalId: string,
  supabase: SupabaseClient,
): Promise<Signal[]> {
  const chain: Signal[] = [];
  const visited = new Set<string>();
  const queue = [signalId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const { data } = await supabase
      .from("workspace_signals")
      .select("*")
      .or(`id.eq.${current},parent_signal_id.eq.${current}`)
      .order("produced_at", { ascending: true });

    if (data) {
      for (const row of data as SignalRow[]) {
        if (!visited.has(row.id)) {
          chain.push(rowToSignal(row));
          if (row.id !== current) queue.push(row.id);
        }
      }
    }
  }

  return chain.sort(
    (a, b) => new Date(a.producedAt).getTime() - new Date(b.producedAt).getTime(),
  );
}

// ─── Suppression queries ───────────────────────────────────────────────────────

/**
 * Signals currently suppressed for a workspace, including suppression expiry.
 * Used by the suppression restore sweep.
 *
 * Note: expiry filter intentionally NOT applied here — suppressed signals
 * with elapsed suppressedUntil are restored by restoreExpiredSuppressions(),
 * not filtered out.
 */
export async function getSuppressedSignals(
  workspaceId: string,
  supabase: SupabaseClient,
): Promise<Signal[]> {
  const { data, error } = await supabase
    .from("workspace_signals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("state", "suppressed")
    .order("suppressed_until", { ascending: true, nullsFirst: false });

  if (error || !data) return [];
  return (data as SignalRow[]).map(rowToSignal);
}
