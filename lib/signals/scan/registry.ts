// Signal Scan Engine — Scanner Registry
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Single source of truth for all registered scan types.
// New scanners must be added here and nowhere else.

import { dealStaleScan } from "./scanners/dealStaleScan";
import { companyStaleScan } from "./scanners/companyStaleScan";
import { relationshipStaleScan } from "./scanners/relationshipStaleScan";
import { missingFollowUpScan } from "./scanners/missingFollowUpScan";
import { longRunningTaskScan } from "./scanners/longRunningTaskScan";
import type { ScannerDefinition, ScanType } from "./types";

export const SCAN_REGISTRY: Record<ScanType, ScannerDefinition> = {
  deal_stale: {
    scanType: "deal_stale",
    description:
      "Evaluates all active deals for temporal conditions: deal_stale, deal_approaching_close, deal_close_date_passed, deal_missing_close_date, deal_missing_value, deal_no_primary_contact, company_closing_deal, contact_deal_stalling.",
    targetEntity: "deal",
    defaultIntervalHours: 12,
    defaultBatchSize: 50,
    scanner: dealStaleScan,
  },

  company_stale: {
    scanType: "company_stale",
    description:
      "Evaluates all companies for temporal conditions: company_stale, company_no_contacts, company_no_active_deals, company_incomplete_profile.",
    targetEntity: "company",
    defaultIntervalHours: 24,
    defaultBatchSize: 50,
    scanner: companyStaleScan,
  },

  relationship_stale: {
    scanType: "relationship_stale",
    description:
      "Evaluates all contacts for temporal conditions: contact_stale, contact_new_no_interaction, contact_no_company, contact_no_reach, contact_overdue_task.",
    targetEntity: "contact",
    defaultIntervalHours: 24,
    defaultBatchSize: 50,
    scanner: relationshipStaleScan,
  },

  missing_follow_up: {
    scanType: "missing_follow_up",
    description:
      "Detects active stale deals with a linked contact but no follow-up. Produces contact_deal_stalling. NEVER resolves — resolution is owned by mutation hooks.",
    targetEntity: "cross_entity",
    defaultIntervalHours: 12,
    defaultBatchSize: 50,
    scanner: missingFollowUpScan,
  },

  long_running_tasks: {
    scanType: "long_running_tasks",
    description:
      "Evaluates all non-done tasks for temporal drift: task_overdue, task_due_today, task_blocked, task_waiting_customer, contact_overdue_task.",
    targetEntity: "task",
    defaultIntervalHours: 6,
    defaultBatchSize: 100,
    scanner: longRunningTaskScan,
  },
};

/** Returns the scanner definition for a scan type. Throws if not found. */
export function getScannerDefinition(scanType: ScanType): ScannerDefinition {
  const def = SCAN_REGISTRY[scanType];
  if (!def) throw new Error(`[SignalScanEngine] No scanner registered for: ${scanType}`);
  return def;
}

/** Returns all registered scan types. */
export function getAllScanTypes(): ScanType[] {
  return Object.keys(SCAN_REGISTRY) as ScanType[];
}
