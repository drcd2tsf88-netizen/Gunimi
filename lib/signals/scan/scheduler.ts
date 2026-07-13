// Signal Scan Engine — Scheduler Abstraction
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Defines when scans should run. Does not implement a cron or background job.
// The caller (API route, server action, etc.) is responsible for:
//   1. Tracking the last run time per workspace per scan type.
//   2. Calling shouldRunScan() to determine if a scan is due.
//   3. Calling runScanToCompletion() from the runner.
//
// Wiring to a real scheduler (Vercel Cron, Supabase Edge Function, etc.)
// is a platform concern outside this library.

import type { ScanSchedule, ScanType } from "./types";

// ─── Default schedule ─────────────────────────────────────────────────────────

/**
 * Production scan schedule for Open Alpha.
 *
 * Intervals are conservative — temporal signals are low-urgency.
 * They update the archive between user mutations, not in real-time.
 */
export const DEFAULT_SCAN_SCHEDULE: ScanSchedule[] = [
  {
    scanType: "deal_stale",
    intervalHours: 12,
    enabled: true,
  },
  {
    scanType: "company_stale",
    intervalHours: 24,
    enabled: true,
  },
  {
    scanType: "relationship_stale",
    intervalHours: 24,
    enabled: true,
  },
  {
    scanType: "missing_follow_up",
    intervalHours: 12,
    enabled: true,
  },
  {
    scanType: "long_running_tasks",
    intervalHours: 6,
    enabled: true,
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

/** Returns the configured schedule for a scan type, or the default entry. */
export function getScanSchedule(
  scanType: ScanType,
  schedule: ScanSchedule[] = DEFAULT_SCAN_SCHEDULE,
): ScanSchedule {
  return (
    schedule.find((s) => s.scanType === scanType) ?? {
      scanType,
      intervalHours: 24,
      enabled: true,
    }
  );
}

/** Returns the interval (hours) between runs for a scan type. */
export function getScanIntervalHours(
  scanType: ScanType,
  schedule: ScanSchedule[] = DEFAULT_SCAN_SCHEDULE,
): number {
  return getScanSchedule(scanType, schedule).intervalHours;
}

// ─── Scheduling decision ──────────────────────────────────────────────────────

/**
 * Returns true if enough time has elapsed since the last run for this scan type
 * to run again.
 *
 * The caller must persist `lastRunAt` externally (e.g., in a workspace
 * preferences table or in-memory for single-server deployments).
 *
 * @param scanType - The scan type to check.
 * @param lastRunAt - ISO timestamp of the last completed run. Null if never run.
 * @param schedule - Override the default schedule. Defaults to DEFAULT_SCAN_SCHEDULE.
 */
export function shouldRunScan(
  scanType: ScanType,
  lastRunAt: string | null,
  schedule: ScanSchedule[] = DEFAULT_SCAN_SCHEDULE,
): boolean {
  const entry = getScanSchedule(scanType, schedule);
  if (!entry.enabled) return false;
  if (!lastRunAt) return true; // Never run — run now.

  const lastRunMs = new Date(lastRunAt).getTime();
  const intervalMs = entry.intervalHours * 60 * 60 * 1000;
  return Date.now() - lastRunMs >= intervalMs;
}

/**
 * Returns the ISO timestamp after which this scan type will be due again.
 * Returns null if the scan has never run (already due).
 */
export function getNextScanDueAt(
  scanType: ScanType,
  lastRunAt: string | null,
  schedule: ScanSchedule[] = DEFAULT_SCAN_SCHEDULE,
): string | null {
  if (!lastRunAt) return null;
  const intervalMs = getScanIntervalHours(scanType, schedule) * 60 * 60 * 1000;
  const nextMs = new Date(lastRunAt).getTime() + intervalMs;
  return new Date(nextMs).toISOString();
}
