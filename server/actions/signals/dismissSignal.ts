"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { dismissSignal as engineDismiss } from "@/lib/signals/engine";
import { getSignalById } from "@/lib/signals/queries";
import type { DismissalType } from "@/lib/signals/types";

/**
 * User dismissal of a signal.
 *
 * Blueprint: Chapter 8, Level 2 — User dismissal suppression.
 * Invariant 9 — Dismissal does not equal resolution.
 *
 * The signal is suppressed for the dismissal TTL. It re-enters the active pool
 * when the TTL expires. The underlying condition must resolve for the signal
 * to archive.
 */
export async function dismissSignal(
  signalId: string,
  dismissalType: DismissalType,
): Promise<{ success: boolean }> {
  const user = await getUser();
  if (!user) return { success: false };

  const workspace = await getCurrentWorkspace();
  if (!workspace) return { success: false };

  // Verify the signal belongs to the user's workspace before dismissing
  const supabase = await createClient();
  const signal = await getSignalById(signalId, supabase);

  if (!signal) return { success: false };
  if (signal.workspaceId !== workspace.id) return { success: false };
  if (signal.state === "resolved" || signal.state === "archived") {
    return { success: false };
  }

  const result = await engineDismiss(signalId, dismissalType);
  return { success: result !== null };
}
