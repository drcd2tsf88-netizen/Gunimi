import type { MemoryImportance } from "./types";

const IMPORTANCE_MAP: Record<string, MemoryImportance> = {
  // Critical — irreversible business outcomes
  deal_won: "critical",
  deal_lost: "critical",

  // High — meaningful business events
  deal_created: "high",
  deal_stage_changed: "high",
  deal_deleted: "high",
  company_created: "high",
  company_deleted: "high",
  contact_created: "high",
  contact_deleted: "high",
  member_joined: "high",
  workspace_created: "high",
  companies_imported: "high",
  contacts_imported: "high",
  deals_imported: "high",

  // Normal — routine operational events
  automation_execution: "normal",
  note_created: "normal",
  deal_updated: "normal",
  company_updated: "normal",
  contact_updated: "normal",
  invite_sent: "normal",
  calendar_connected: "normal",
  email_connected: "normal",
  ai: "normal",

  // Low — maintenance and system events
  task_updated: "low",
  task_deleted: "low",
  note_updated: "low",
  note_deleted: "low",
  email_disconnected: "low",
  calendar_disconnected: "low",
  workspace_renamed: "low",
  member_removed: "low",
};

export function getImportance(activityType: string): MemoryImportance {
  return IMPORTANCE_MAP[activityType] ?? "normal";
}

export function isMilestone(activityType: string): boolean {
  const imp = getImportance(activityType);
  return imp === "critical" || imp === "high";
}

export const MILESTONE_TYPES: string[] = Object.entries(IMPORTANCE_MAP)
  .filter(([, v]) => v === "critical" || v === "high")
  .map(([k]) => k);
