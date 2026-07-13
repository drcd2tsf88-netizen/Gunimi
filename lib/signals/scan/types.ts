// Signal Scan Engine — Type Definitions
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Temporal intelligence layer. Detects business conditions that can only emerge
// over time, not on individual mutations. Complements the mutation-based producers.

// ─── Scan type catalogue ──────────────────────────────────────────────────────

/** All registered scan types. */
export type ScanType =
  | "deal_stale"
  | "company_stale"
  | "relationship_stale"
  | "missing_follow_up"
  | "long_running_tasks";

// ─── Execution inputs ─────────────────────────────────────────────────────────

/**
 * Context passed to a scanner on every batch execution.
 *
 * Cursor-based pagination: the scanner processes entities WHERE id > cursor,
 * ordered by id. On first call, cursor is null. On subsequent calls, it is
 * the last entity ID processed in the previous batch.
 */
export type ScanContext = {
  workspaceId: string;
  /** Last entity ID processed in a previous batch. Null on first call. */
  cursor: string | null;
  /** Number of entities to process per batch. */
  batchSize: number;
  /** AbortSignal for cooperative cancellation. Null if no cancellation needed. */
  signal: AbortSignal | null;
};

// ─── Execution outputs ────────────────────────────────────────────────────────

/**
 * Result of a single batch scan execution.
 *
 * When completed is false AND nextCursor is non-null: more entities remain
 * — call again with nextCursor to continue.
 *
 * When completed is false AND the AbortSignal is aborted: scan was cancelled —
 * use nextCursor to resume later.
 *
 * When completed is true: all entities in the workspace have been evaluated.
 */
export type ScanResult = {
  scanType: ScanType;
  workspaceId: string;
  /** Number of entities evaluated in this batch. */
  entitiesScanned: number;
  /**
   * Signals produced in this batch.
   * Note: scanners that delegate to producers cannot track per-signal counts.
   * This field is populated when the scanner tracks signals directly.
   */
  signalsProduced: number;
  /** Signals resolved in this batch. Same caveat as signalsProduced. */
  signalsResolved: number;
  /** True when all entities have been scanned (no cursor left). */
  completed: boolean;
  /** Cursor to pass on the next call to continue. Null when scan is complete. */
  nextCursor: string | null;
  /** Wall-clock duration of this batch in milliseconds. */
  durationMs: number;
};

// ─── Scanner definition ───────────────────────────────────────────────────────

export type ScannerFn = (context: ScanContext) => Promise<ScanResult>;

export type ScannerDefinition = {
  scanType: ScanType;
  /** Human-readable description of what this scanner detects. */
  description: string;
  /** Primary entity this scanner evaluates. "cross_entity" for multi-entity scanners. */
  targetEntity: "deal" | "contact" | "company" | "task" | "cross_entity";
  /** Recommended interval between full workspace scans (hours). */
  defaultIntervalHours: number;
  /** Default batch size per execution. */
  defaultBatchSize: number;
  scanner: ScannerFn;
};

// ─── Scheduling ───────────────────────────────────────────────────────────────

/**
 * Schedule configuration for a single scan type.
 * The caller is responsible for tracking lastRunAt and calling shouldRunScan().
 */
export type ScanSchedule = {
  scanType: ScanType;
  /** Hours between full workspace scans. */
  intervalHours: number;
  enabled: boolean;
};

// ─── Aggregated completion result (returned by runScanToCompletion) ───────────

export type CompletedScanResult = Omit<ScanResult, "nextCursor"> & {
  batchesRun: number;
  nextCursor: string | null; // non-null only if scan was aborted before completion
};
