// Signal Scan Engine — Public API
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Import from this module only. Internal modules are an implementation detail.

export type {
  ScanType,
  ScanContext,
  ScanResult,
  ScannerFn,
  ScannerDefinition,
  ScanSchedule,
  CompletedScanResult,
} from "./types";

export { SCAN_REGISTRY, getScannerDefinition, getAllScanTypes } from "./registry";

export { runScanToCompletion, runScanBatch } from "./runner";
export type { RunScanOptions } from "./runner";

export {
  DEFAULT_SCAN_SCHEDULE,
  getScanSchedule,
  getScanIntervalHours,
  shouldRunScan,
  getNextScanDueAt,
} from "./scheduler";
