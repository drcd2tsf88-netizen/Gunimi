// Signal Engine — Registry
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md Chapter 5
//
// Maps every SignalType to its static definition: tier, severity, default confidence,
// evidence locale key, action type, resolution condition, TTL, and surface visibility.
//
// Tier assignments and severity are PERMANENT per Invariant 3.
// No runtime code may override these values for individual signal instances.

import type {
  SignalType,
  SignalTier,
  SignalSeverity,
  SignalConfidence,
  SignalClaimer,
} from "./types";

export type SignalTypeDefinition = {
  /** Priority tier — permanent, never changed at runtime. */
  tier: SignalTier;
  severity: SignalSeverity;
  defaultConfidence: SignalConfidence;
  /** Locale key for the evidence sentence displayed to the user. */
  evidenceKey: string;
  /** Locale key for the recommended action label. */
  actionType: string;
  /** Human-readable resolution condition stored on each signal instance. */
  resolutionCondition: string;
  /** Time-to-live in days from producedAt. null = event-driven expiration only. */
  ttlDays: number | null;
  /** Surfaces on which this signal type is eligible to be displayed. */
  visibleOn: SignalClaimer[];
  /**
   * Whether task-level deduplication applies (Blueprint Ch. 9 exception).
   * When true, the dedup key is type + entityType + entityId + origin
   * rather than the standard type + entityType + entityId.
   */
  taskLevelDedup: boolean;
};

export const SIGNAL_REGISTRY: Record<SignalType, SignalTypeDefinition> = {

  // ─── Category 1 — Deal Signals ─────────────────────────────────────────────

  deal_approaching_close: {
    tier: 1,
    severity: "critical",
    defaultConfidence: "high",
    evidenceKey: "signals.deal_approaching_close.evidence",
    actionType: "signals.deal_approaching_close.action",
    resolutionCondition:
      "Deal marked won, lost, or close date updated beyond the 7-day threshold. TTL fallback: close date + 7 days.",
    ttlDays: null, // mixed: event-driven with TTL override on produce
    visibleOn: [
      "today_focus",
      "today_attention",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  deal_close_date_passed: {
    tier: 1,
    severity: "critical",
    defaultConfidence: "high",
    evidenceKey: "signals.deal_close_date_passed.evidence",
    actionType: "signals.deal_close_date_passed.action",
    resolutionCondition:
      "Close date updated to a future date, or deal won or lost.",
    ttlDays: 30,
    visibleOn: [
      "today_focus",
      "today_attention",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  deal_stale: {
    tier: 1,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.deal_stale.evidence",
    actionType: "signals.deal_stale.action",
    resolutionCondition: "Any activity recorded on the deal.",
    ttlDays: null,
    visibleOn: [
      "today_focus",
      "today_attention",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  proposal_unanswered: {
    tier: 1,
    severity: "critical",
    defaultConfidence: "high",
    evidenceKey: "signals.proposal_unanswered.evidence",
    actionType: "signals.proposal_unanswered.action",
    resolutionCondition:
      "Reply recorded or deal stage updated.",
    ttlDays: null,
    visibleOn: [
      "today_focus",
      "today_attention",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  deal_no_primary_contact: {
    tier: 2,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.deal_no_primary_contact.evidence",
    actionType: "signals.deal_no_primary_contact.action",
    resolutionCondition: "Contact linked to the deal.",
    ttlDays: null,
    visibleOn: ["workspace_decision", "workspace_situation"],
    taskLevelDedup: false,
  },

  deal_missing_value: {
    tier: 2,
    severity: "info",
    defaultConfidence: "high",
    evidenceKey: "signals.deal_missing_value.evidence",
    actionType: "signals.deal_missing_value.action",
    resolutionCondition: "Deal value set.",
    ttlDays: null,
    visibleOn: ["workspace_situation"],
    taskLevelDedup: false,
  },

  deal_missing_close_date: {
    tier: 2,
    severity: "info",
    defaultConfidence: "high",
    evidenceKey: "signals.deal_missing_close_date.evidence",
    actionType: "signals.deal_missing_close_date.action",
    resolutionCondition: "Close date added to the deal.",
    ttlDays: null,
    visibleOn: ["workspace_situation"],
    taskLevelDedup: false,
  },

  // ─── Category 2 — Contact Signals ──────────────────────────────────────────

  contact_stale: {
    tier: 2,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.contact_stale.evidence",
    actionType: "signals.contact_stale.action",
    resolutionCondition:
      "Any interaction recorded for the contact.",
    ttlDays: null,
    visibleOn: [
      "today_attention",
      "today_relationships",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  contact_overdue_task: {
    tier: 1,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.contact_overdue_task.evidence",
    actionType: "signals.contact_overdue_task.action",
    resolutionCondition: "Task completed or removed.",
    ttlDays: null,
    visibleOn: [
      "today_focus",
      "today_attention",
      "today_work",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: true, // dedup includes task origin
  },

  contact_new_no_interaction: {
    tier: 2,
    severity: "info",
    defaultConfidence: "high",
    evidenceKey: "signals.contact_new_no_interaction.evidence",
    actionType: "signals.contact_new_no_interaction.action",
    resolutionCondition: "First interaction recorded.",
    ttlDays: 30,
    visibleOn: ["today_relationships", "workspace_situation"],
    taskLevelDedup: false,
  },

  contact_no_company: {
    tier: 2,
    severity: "info",
    defaultConfidence: "high",
    evidenceKey: "signals.contact_no_company.evidence",
    actionType: "signals.contact_no_company.action",
    resolutionCondition: "Company linked to contact.",
    ttlDays: null,
    visibleOn: ["workspace_situation"],
    taskLevelDedup: false,
  },

  contact_no_reach: {
    tier: 2,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.contact_no_reach.evidence",
    actionType: "signals.contact_no_reach.action",
    resolutionCondition: "Email or phone added to contact.",
    ttlDays: null,
    visibleOn: ["workspace_decision", "workspace_situation"],
    taskLevelDedup: false,
  },

  contact_deal_stalling: {
    tier: 1,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.contact_deal_stalling.evidence",
    actionType: "signals.contact_deal_stalling.action",
    resolutionCondition: "Activity recorded on the deal.",
    ttlDays: null,
    visibleOn: [
      "today_focus",
      "today_attention",
      "today_relationships",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  // ─── Category 3 — Company Signals ──────────────────────────────────────────

  company_stale: {
    tier: 2,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.company_stale.evidence",
    actionType: "signals.company_stale.action",
    resolutionCondition: "Activity recorded on the company.",
    ttlDays: 60, // mixed: event-driven with 60-day TTL fallback
    visibleOn: [
      "today_attention",
      "today_relationships",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  company_no_contacts: {
    tier: 2,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.company_no_contacts.evidence",
    actionType: "signals.company_no_contacts.action",
    resolutionCondition: "Contact added and linked to the company.",
    ttlDays: null,
    visibleOn: [
      "today_relationships",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  company_no_active_deals: {
    tier: 2,
    severity: "info",
    defaultConfidence: "high",
    evidenceKey: "signals.company_no_active_deals.evidence",
    actionType: "signals.company_no_active_deals.action",
    resolutionCondition: "Active deal created or opened for the company.",
    ttlDays: null,
    visibleOn: ["workspace_situation"],
    taskLevelDedup: false,
  },

  company_closing_deal: {
    tier: 1,
    severity: "critical",
    defaultConfidence: "high",
    evidenceKey: "signals.company_closing_deal.evidence",
    actionType: "signals.company_closing_deal.action",
    resolutionCondition:
      "Deal closed or close date updated beyond the threshold.",
    ttlDays: null, // mixed: event-driven with close date + 7 days
    visibleOn: [
      "today_focus",
      "today_attention",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  company_incomplete_profile: {
    tier: 2,
    severity: "info",
    defaultConfidence: "high",
    evidenceKey: "signals.company_incomplete_profile.evidence",
    actionType: "signals.company_incomplete_profile.action",
    resolutionCondition: "Industry added to the company profile.",
    ttlDays: null,
    visibleOn: ["workspace_situation"],
    taskLevelDedup: false,
  },

  // ─── Category 4 — Commitment Signals ───────────────────────────────────────

  task_due_today: {
    tier: 3,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.task_due_today.evidence",
    actionType: "signals.task_due_today.action",
    resolutionCondition: "Task marked complete.",
    ttlDays: null,
    visibleOn: ["today_work"],
    taskLevelDedup: true,
  },

  task_overdue: {
    tier: 3,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.task_overdue.evidence",
    actionType: "signals.task_overdue.action",
    resolutionCondition: "Task completed or rescheduled.",
    ttlDays: null, // persists until resolved — no TTL
    visibleOn: ["today_attention", "today_work"],
    taskLevelDedup: true,
  },

  task_blocked: {
    tier: 3,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.task_blocked.evidence",
    actionType: "signals.task_blocked.action",
    resolutionCondition: "Block resolved.",
    ttlDays: null,
    visibleOn: ["today_work"],
    taskLevelDedup: true,
  },

  task_waiting_customer: {
    tier: 3,
    severity: "info",
    defaultConfidence: "high",
    evidenceKey: "signals.task_waiting_customer.evidence",
    actionType: "signals.task_waiting_customer.action",
    resolutionCondition: "Response received.",
    ttlDays: null,
    visibleOn: ["today_work"],
    taskLevelDedup: true,
  },

  // ─── Category 5 — Communication Signals ────────────────────────────────────

  email_important_unanswered: {
    tier: 1,
    severity: "critical",
    defaultConfidence: "high",
    evidenceKey: "signals.email_important_unanswered.evidence",
    actionType: "signals.email_important_unanswered.action",
    resolutionCondition:
      "Reply sent in thread, or user marks as resolved.",
    ttlDays: 30,
    visibleOn: [
      "today_focus",
      "today_attention",
      "workspace_decision",
      "workspace_situation",
    ],
    taskLevelDedup: false,
  },

  meeting_approaching: {
    tier: 1,
    severity: "warning",
    defaultConfidence: "high",
    evidenceKey: "signals.meeting_approaching.evidence",
    actionType: "signals.meeting_approaching.action",
    resolutionCondition: "Meeting start time passed.",
    ttlDays: null, // expires at meeting start time — set via expiresAt on produce
    visibleOn: ["today_focus", "today_attention"],
    taskLevelDedup: false,
  },

  meeting_no_preparation: {
    tier: 1,
    severity: "info",
    defaultConfidence: "medium",
    evidenceKey: "signals.meeting_no_preparation.evidence",
    actionType: "signals.meeting_no_preparation.action",
    resolutionCondition:
      "Note added for the meeting contact, or meeting time passed.",
    ttlDays: null, // expires at meeting start time
    visibleOn: ["today_attention"],
    taskLevelDedup: false,
  },

  // ─── Category 6 — Memory Signals (post-Alpha) ──────────────────────────────
  // Defined here for type completeness. Not produced in Open Alpha.
  // Require AI Core and Business Memory layer (post-Alpha).

  relationship_milestone: {
    tier: 4,
    severity: "info",
    defaultConfidence: "medium",
    evidenceKey: "signals.relationship_milestone.evidence",
    actionType: "signals.relationship_milestone.action",
    resolutionCondition: "Event date passed.",
    ttlDays: null,
    visibleOn: [],
    taskLevelDedup: false,
  },

  ai_pattern_detected: {
    tier: 4,
    severity: "info",
    defaultConfidence: "medium",
    evidenceKey: "signals.ai_pattern_detected.evidence",
    actionType: "signals.ai_pattern_detected.action",
    resolutionCondition: "User acknowledgment or 7-day TTL.",
    ttlDays: 7,
    visibleOn: [],
    taskLevelDedup: false,
  },

  memory_reminder: {
    tier: 4,
    severity: "info",
    defaultConfidence: "medium",
    evidenceKey: "signals.memory_reminder.evidence",
    actionType: "signals.memory_reminder.action",
    resolutionCondition: "User dismissal or 7-day TTL.",
    ttlDays: 7,
    visibleOn: [],
    taskLevelDedup: false,
  },
};

/** Returns true if the given signal type is in scope for Open Alpha (Categories 1–5). */
export function isAlphaSignalType(type: SignalType): boolean {
  return SIGNAL_REGISTRY[type].tier <= 3;
}

/** Returns the surface visibility list for a given signal type. */
export function getSignalVisibility(type: SignalType): SignalClaimer[] {
  return SIGNAL_REGISTRY[type].visibleOn;
}
