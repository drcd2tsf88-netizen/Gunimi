// Signal Engine — Health Endpoint
// Authority: docs/blueprints/AI_PLATFORM_ARCHITECTURE.md
//
// Returns operational health metrics for the Signal Archive in the current workspace.
// Authenticated — requires a valid user session with workspace membership.
//
// GET /api/signals/health

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import {
  getAllScanTypes,
  shouldRunScan,
  getNextScanDueAt,
  type ScanType,
} from "@/lib/signals/scan";
import type { WorkspacePreferences, ScanTypeState } from "@/server/actions/workspace/getWorkspaceSettings";

export async function GET() {
  // ─── Auth ─────────────────────────────────────────────────────────────────

  const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);
  if (!user || !workspace) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartStr = todayStart.toISOString();

  // ─── Signal counts ────────────────────────────────────────────────────────

  const [
    activeResult,
    claimedResult,
    suppressedResult,
    archivedTodayResult,
    overdueExpiryResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("workspace_signals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("state", "active"),

    supabaseAdmin
      .from("workspace_signals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("state", "claimed"),

    supabaseAdmin
      .from("workspace_signals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("state", "suppressed"),

    // Signals archived today (resolved by condition OR expired by TTL sweep)
    supabaseAdmin
      .from("workspace_signals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("state", "archived")
      .gte("resolved_at", todayStartStr),

    // Active/claimed signals whose TTL has passed but not yet swept
    supabaseAdmin
      .from("workspace_signals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .in("state", ["active", "claimed"])
      .not("expires_at", "is", null)
      .lt("expires_at", now),
  ]);

  // ─── Scan schedule ────────────────────────────────────────────────────────

  const { data: workspaceData } = await supabaseAdmin
    .from("workspaces")
    .select("preferences")
    .eq("id", workspace.id)
    .maybeSingle();

  const prefs = (workspaceData?.preferences as WorkspacePreferences | null) ?? {};
  const scanScheduleState: Record<string, ScanTypeState> = prefs.scanSchedule ?? {};

  const scanStatus: Record<string, {
    lastRunAt: string | null;
    nextDueAt: string | null;
    isDue: boolean;
    lastFailedAt: string | null;
    lastError: string | null;
  }> = {};

  for (const scanType of getAllScanTypes()) {
    const state = scanScheduleState[scanType] ?? {
      lastRunAt: null,
      lastFailedAt: null,
      lastError: null,
    };
    const lastRunAt = state.lastRunAt ?? null;

    scanStatus[scanType] = {
      lastRunAt,
      nextDueAt: getNextScanDueAt(scanType as ScanType, lastRunAt),
      isDue: shouldRunScan(scanType as ScanType, lastRunAt),
      lastFailedAt: state.lastFailedAt ?? null,
      lastError: state.lastError ?? null,
    };
  }

  // ─── Response ─────────────────────────────────────────────────────────────

  return Response.json({
    workspaceId: workspace.id,
    generatedAt: now,
    signals: {
      active: activeResult.count ?? 0,
      claimed: claimedResult.count ?? 0,
      suppressed: suppressedResult.count ?? 0,
      archivedToday: archivedTodayResult.count ?? 0,
      overdueExpiry: overdueExpiryResult.count ?? 0,
    },
    scanSchedule: scanStatus,
  });
}
