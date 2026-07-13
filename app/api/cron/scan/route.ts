// Vercel Cron — Signal Scan Scheduler
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//            docs/blueprints/AI_PLATFORM_ARCHITECTURE.md
//
// Runs on schedule: 0 */6 * * * (every 6 hours)
// Vercel sends Authorization: Bearer ${CRON_SECRET} on every invocation.
//
// For each workspace, evaluates all scan types against their DEFAULT_SCAN_SCHEDULE.
// Skips scan types that are not yet due. Persists lastRunAt in workspace preferences.
// Continues remaining scan types if one fails — partial success is better than full abort.

import { type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { logger } from "@/lib/logger";
import {
  runScanToCompletion,
  getAllScanTypes,
  shouldRunScan,
  type ScanType,
} from "@/lib/signals/scan";
import type { WorkspacePreferences, ScanTypeState } from "@/server/actions/workspace/getWorkspaceSettings";

type WorkspaceRow = {
  id: string;
  preferences: WorkspacePreferences | null;
};

type ScanReport = {
  scanType: ScanType;
  skipped: boolean;
  success?: boolean;
  entitiesScanned?: number;
  signalsProduced?: number;
  signalsResolved?: number;
  durationMs?: number;
  error?: string;
};

type WorkspaceReport = {
  workspaceId: string;
  scans: ScanReport[];
};

export async function GET(request: NextRequest) {
  // ─── Authorization ────────────────────────────────────────────────────────

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logger.error("[CronScan] CRON_SECRET environment variable is not set");
    return Response.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cronStartMs = Date.now();
  const scanTypes = getAllScanTypes();
  const workspaceReports: WorkspaceReport[] = [];

  // ─── Fetch all workspaces ─────────────────────────────────────────────────

  const { data: workspaces, error: workspacesError } = await supabaseAdmin
    .from("workspaces")
    .select("id, preferences");

  if (workspacesError || !workspaces) {
    logger.error("[CronScan] Failed to fetch workspaces", workspacesError);
    return Response.json({ error: "Failed to fetch workspaces" }, { status: 500 });
  }

  // ─── Process each workspace ───────────────────────────────────────────────

  for (const workspace of workspaces as WorkspaceRow[]) {
    const prefs: WorkspacePreferences = workspace.preferences ?? {};
    const scanSchedule: Record<string, ScanTypeState> = prefs.scanSchedule ?? {};
    const workspaceScans: ScanReport[] = [];

    for (const scanType of scanTypes) {
      const state = scanSchedule[scanType] ?? { lastRunAt: null, lastFailedAt: null, lastError: null };
      const lastRunAt = state.lastRunAt ?? null;

      if (!shouldRunScan(scanType, lastRunAt)) {
        workspaceScans.push({ scanType, skipped: true });
        continue;
      }

      try {
        const result = await runScanToCompletion(scanType, workspace.id);

        const updatedState: ScanTypeState = {
          lastRunAt: new Date().toISOString(),
          lastFailedAt: state.lastFailedAt ?? null,
          lastError: null,
        };

        await supabaseAdmin
          .from("workspaces")
          .update({
            preferences: {
              ...prefs,
              scanSchedule: { ...scanSchedule, [scanType]: updatedState },
            },
          })
          .eq("id", workspace.id);

        // Keep local state in sync for subsequent scan types in same loop
        scanSchedule[scanType] = updatedState;

        logger.debug(`[CronScan] ${scanType} completed for workspace ${workspace.id}`, {
          entitiesScanned: result.entitiesScanned,
          signalsProduced: result.signalsProduced,
          signalsResolved: result.signalsResolved,
          durationMs: result.durationMs,
        });

        workspaceScans.push({
          scanType,
          skipped: false,
          success: true,
          entitiesScanned: result.entitiesScanned,
          signalsProduced: result.signalsProduced,
          signalsResolved: result.signalsResolved,
          durationMs: result.durationMs,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";

        const failedState: ScanTypeState = {
          lastRunAt: state.lastRunAt ?? null,
          lastFailedAt: new Date().toISOString(),
          lastError: errorMessage,
        };

        await supabaseAdmin
          .from("workspaces")
          .update({
            preferences: {
              ...prefs,
              scanSchedule: { ...scanSchedule, [scanType]: failedState },
            },
          })
          .eq("id", workspace.id);

        scanSchedule[scanType] = failedState;

        logger.error(`[CronScan] ${scanType} failed for workspace ${workspace.id}`, {
          error: errorMessage,
        });

        workspaceScans.push({
          scanType,
          skipped: false,
          success: false,
          error: errorMessage,
        });
      }
    }

    workspaceReports.push({ workspaceId: workspace.id, scans: workspaceScans });
  }

  const totalDurationMs = Date.now() - cronStartMs;

  logger.debug("[CronScan] Cron run complete", {
    workspacesProcessed: workspaceReports.length,
    totalDurationMs,
  });

  return Response.json({
    ok: true,
    workspacesProcessed: workspaceReports.length,
    totalDurationMs,
    report: workspaceReports,
  });
}
