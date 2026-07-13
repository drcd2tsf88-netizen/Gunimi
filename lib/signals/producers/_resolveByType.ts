// Signal Producer Utility — Internal
// Resolves existing active signals by type for a given entity.
// All writes use supabaseAdmin (service role).

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { resolveSignal } from "@/lib/signals/engine";
import type { SignalType } from "@/lib/signals/types";

/** Shared return type for all producer functions — enables scan observability. */
export type SignalProductionStats = {
  signalsProduced: number;
  signalsResolved: number;
};

/**
 * Finds any non-archived signal of the given type for the entity and resolves it.
 *
 * Pass `origin` for task-level-dedup signal types (taskLevelDedup: true in registry)
 * to resolve only the specific signal instance tied to that origin.
 *
 * Returns the count of signals resolved (0 if none found).
 */
export async function resolveSignalIfExists(
  workspaceId: string,
  entityId: string,
  signalType: SignalType,
  trigger: string,
  origin?: string,
): Promise<number> {
  let query = supabaseAdmin
    .from("workspace_signals")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("entity_id", entityId)
    .eq("type", signalType)
    .not("state", "in", '("resolved","archived")');

  if (origin !== undefined) {
    query = query.eq("origin", origin);
  }

  const { data } = await query;
  if (!data || data.length === 0) return 0;

  await Promise.all(
    (data as { id: string }[]).map((row) => resolveSignal(row.id, trigger)),
  );

  return data.length;
}

/**
 * Resolves ALL non-archived signals for an entity — used for terminal states
 * (deal won/lost, task done) without needing to call the server action layer.
 *
 * Returns the count of signals resolved.
 */
export async function resolveAllEntitySignals(
  workspaceId: string,
  entityId: string,
  trigger: string,
): Promise<number> {
  const { data } = await supabaseAdmin
    .from("workspace_signals")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("entity_id", entityId)
    .not("state", "in", '("resolved","archived")');

  if (!data || data.length === 0) return 0;

  await Promise.all(
    (data as { id: string }[]).map((row) => resolveSignal(row.id, trigger)),
  );

  return data.length;
}
