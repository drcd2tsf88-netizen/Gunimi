// Signal Scan Engine — Scan Runner
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Drives a single scanner to completion across multiple batches.
// Handles cursor advancement, cancellation, and progress reporting.
//
// Usage:
//   const result = await runScanToCompletion("deal_stale", workspaceId, {
//     batchSize: 50,
//     signal: abortController.signal,
//     onProgress: (r) => logger.info("[scan]", r),
//   });

import { getScannerDefinition } from "./registry";
import type { CompletedScanResult, ScanResult, ScanType } from "./types";

export type RunScanOptions = {
  /** AbortSignal for cooperative cancellation. Null to run without cancellation. */
  signal?: AbortSignal | null;
  /** Entities per batch. Defaults to scanner's defaultBatchSize. */
  batchSize?: number;
  /** Cursor to resume from a previous partial run. Null to start fresh. */
  startCursor?: string | null;
  /** Called after each batch with the intermediate result. */
  onProgress?: (batchResult: ScanResult) => void;
};

/**
 * Drives a scanner to completion (or until cancelled) across multiple batches.
 *
 * Returns a CompletedScanResult that aggregates all batch results.
 * When the scan is cancelled mid-run, `completed` is false and `nextCursor`
 * holds the resume point for the next call.
 */
export async function runScanToCompletion(
  scanType: ScanType,
  workspaceId: string,
  options: RunScanOptions = {},
): Promise<CompletedScanResult> {
  const def = getScannerDefinition(scanType);
  const batchSize = options.batchSize ?? def.defaultBatchSize;
  const signal = options.signal ?? null;
  const onProgress = options.onProgress;

  let cursor = options.startCursor ?? null;
  let batchesRun = 0;
  let totalScanned = 0;
  let totalProduced = 0;
  let totalResolved = 0;
  const startMs = Date.now();

  while (true) {
    if (signal?.aborted) {
      return {
        scanType,
        workspaceId,
        entitiesScanned: totalScanned,
        signalsProduced: totalProduced,
        signalsResolved: totalResolved,
        completed: false,
        batchesRun,
        nextCursor: cursor,
        durationMs: Date.now() - startMs,
      };
    }

    const batchResult = await def.scanner({
      workspaceId,
      cursor,
      batchSize,
      signal,
    });

    batchesRun++;
    totalScanned += batchResult.entitiesScanned;
    totalProduced += batchResult.signalsProduced;
    totalResolved += batchResult.signalsResolved;

    onProgress?.(batchResult);

    if (batchResult.completed || signal?.aborted) {
      return {
        scanType,
        workspaceId,
        entitiesScanned: totalScanned,
        signalsProduced: totalProduced,
        signalsResolved: totalResolved,
        completed: batchResult.completed,
        batchesRun,
        nextCursor: batchResult.nextCursor,
        durationMs: Date.now() - startMs,
      };
    }

    cursor = batchResult.nextCursor;

    if (!cursor) {
      return {
        scanType,
        workspaceId,
        entitiesScanned: totalScanned,
        signalsProduced: totalProduced,
        signalsResolved: totalResolved,
        completed: true,
        batchesRun,
        nextCursor: null,
        durationMs: Date.now() - startMs,
      };
    }
  }
}

/**
 * Runs a single batch and returns the raw result.
 * Useful for testing individual batch behaviour.
 */
export async function runScanBatch(
  scanType: ScanType,
  workspaceId: string,
  cursor: string | null,
  batchSize?: number,
): Promise<ScanResult> {
  const def = getScannerDefinition(scanType);
  return def.scanner({
    workspaceId,
    cursor,
    batchSize: batchSize ?? def.defaultBatchSize,
    signal: null,
  });
}
