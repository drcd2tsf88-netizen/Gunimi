"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { resolveSignal as engineResolve } from "@/lib/signals/engine";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

/**
 * Event-driven resolution of a signal.
 *
 * Called by entity mutation server actions when a resolution condition is met:
 * - Activity recorded on a deal → resolve deal_stale
 * - Task completed → resolve task_overdue / task_due_today
 * - Contact updated with email → resolve contact_no_reach
 * etc.
 *
 * Blueprint: Chapter 10 — Event-driven expiration.
 * Resolution is permanent. The signal moves to archived state.
 */
export async function resolveSignalByType(params: {
  workspaceId: string;
  entityId: string;
  signalType: string;
  trigger: string;
}): Promise<{ resolved: number }> {
  const { workspaceId, entityId, signalType, trigger } = params;

  // Find all active/claimed signals of this type for this entity
  const { data } = await supabaseAdmin
    .from("workspace_signals")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("entity_id", entityId)
    .eq("type", signalType)
    .not("state", "in", '("resolved","archived")');

  if (!data || data.length === 0) return { resolved: 0 };

  let resolved = 0;
  for (const row of data) {
    const result = await engineResolve(row.id, trigger);
    if (result) resolved++;
  }

  return { resolved };
}

/**
 * Resolves all active signals for an entity — used when an entity reaches a
 * terminal state (e.g., deal marked won or lost).
 */
export async function resolveAllSignalsForEntity(params: {
  entityId: string;
  trigger: string;
}): Promise<{ resolved: number }> {
  const { entityId, trigger } = params;

  const workspace = await getCurrentWorkspace();
  if (!workspace) return { resolved: 0 };

  const { data } = await supabaseAdmin
    .from("workspace_signals")
    .select("id")
    .eq("workspace_id", workspace.id)
    .eq("entity_id", entityId)
    .not("state", "in", '("resolved","archived")');

  if (!data || data.length === 0) return { resolved: 0 };

  let resolved = 0;
  for (const row of data) {
    const result = await engineResolve(row.id, trigger);
    if (result) resolved++;
  }

  return { resolved };
}
