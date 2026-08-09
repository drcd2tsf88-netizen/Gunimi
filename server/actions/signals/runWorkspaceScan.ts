"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { ratelimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";
import { runScanToCompletion } from "@/lib/signals/scan";
import type { CompletedScanResult, ScanType } from "@/lib/signals/scan";

type RunWorkspaceScanResult =
  | { success: true; result: CompletedScanResult }
  | { success: false; error: string };

/**
 * Server action: runs a single scan type to completion for the current workspace.
 *
 * Intended for:
 *   - Manual admin triggers (debug, backfill, re-evaluation)
 *   - Vercel Cron / Supabase Edge Function wrappers that call this action
 *
 * The caller is responsible for tracking lastRunAt (for scheduling) and for
 * calling shouldRunScan() before invoking this action.
 *
 * Rate-limited per workspace to prevent DoS from rapid repeated calls.
 */
export async function runWorkspaceScan(
  scanType: ScanType,
  options: {
    batchSize?: number;
    startCursor?: string | null;
  } = {},
): Promise<RunWorkspaceScanResult> {
  try {
    const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);

    if (!user || !workspace) {
      return { success: false, error: "Unauthorized" };
    }

    // Scan has its own per-workspace+type limit independent of the per-user write limit.
    const { success: withinLimit } = await ratelimit.limit(`write:scan:${workspace.id}:${scanType}`);
    if (!withinLimit) {
      return { success: false, error: "Rate limit exceeded. Try again later." };
    }

    const result = await runScanToCompletion(scanType, workspace.id, {
      batchSize: options.batchSize,
      startCursor: options.startCursor ?? null,
    });

    logger.debug(`[SignalScanEngine] ${scanType} completed`, {
      workspaceId: workspace.id,
      entitiesScanned: result.entitiesScanned,
      signalsProduced: result.signalsProduced,
      signalsResolved: result.signalsResolved,
      batchesRun: result.batchesRun,
      durationMs: result.durationMs,
      completed: result.completed,
    });

    return { success: true, result };
  } catch {
    logger.error("[SignalScanEngine] runWorkspaceScan failed", { scanType });
    return { success: false, error: "Scan failed. Please try again." };
  }
}
