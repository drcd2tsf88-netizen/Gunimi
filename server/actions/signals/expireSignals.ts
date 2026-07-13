"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import {
  expireSignals as engineExpire,
  restoreExpiredSuppressions,
} from "@/lib/signals/engine";
import { logger } from "@/lib/logger";

/**
 * TTL expiration sweep for the current user's workspace.
 *
 * Archives all signals whose expires_at has elapsed.
 * Restores all suppressed signals whose suppressedUntil has elapsed.
 *
 * Blueprint: Chapter 10 — Time-based expiration.
 * Blueprint: Chapter 8, Level 2 — "signal re-enters when the dismissal TTL expires."
 *
 * Called at the start of Today load to ensure the signal pool is current
 * before the Today resolver reads from it.
 */
export async function runSignalExpiration(): Promise<{
  expired: number;
  restored: number;
}> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return { expired: 0, restored: 0 };

  const [expired, restored] = await Promise.all([
    engineExpire(workspace.id),
    restoreExpiredSuppressions(workspace.id),
  ]);

  if (expired > 0 || restored > 0) {
    logger.debug(
      `signal expiration: expired=${expired} restored=${restored} workspace=${workspace.id}`,
    );
  }

  return { expired, restored };
}
