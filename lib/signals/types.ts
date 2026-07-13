// Signal Engine — Type Definitions
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// This file is the single source of truth for all Signal types in Gunimi.
// No entity domain may define signal types independently.

// ─── Enumerations ─────────────────────────────────────────────────────────────

/** All 25 signal types defined in the Signal Engine Blueprint Chapter 5. */
export type SignalType =
  // Category 1 — Deal Signals
  | "deal_approaching_close"
  | "deal_close_date_passed"
  | "deal_stale"
  | "proposal_unanswered"
  | "deal_no_primary_contact"
  | "deal_missing_value"
  | "deal_missing_close_date"
  // Category 2 — Contact (Relationship) Signals
  | "contact_stale"
  | "contact_overdue_task"
  | "contact_new_no_interaction"
  | "contact_no_company"
  | "contact_no_reach"
  | "contact_deal_stalling"
  // Category 3 — Company (Commercial Relationship) Signals
  | "company_stale"
  | "company_no_contacts"
  | "company_no_active_deals"
  | "company_closing_deal"
  | "company_incomplete_profile"
  // Category 4 — Commitment Signals
  | "task_due_today"
  | "task_overdue"
  | "task_blocked"
  | "task_waiting_customer"
  // Category 5 — Communication Signals
  | "email_important_unanswered"
  | "meeting_approaching"
  | "meeting_no_preparation"
  // Category 6 — Memory Signals (post-Alpha, defined for type completeness)
  | "relationship_milestone"
  | "ai_pattern_detected"
  | "memory_reminder";

export type EntityType = "deal" | "contact" | "company" | "task" | "email";

/** Priority tier (1 = highest). Permanent for the lifetime of a signal type. */
export type SignalTier = 1 | 2 | 3 | 4;

export type SignalSeverity = "critical" | "warning" | "info";

export type SignalConfidence = "high" | "medium" | "low";

/** The lifecycle states a signal passes through. */
export type SignalState =
  | "active"
  | "claimed"
  | "suppressed"
  | "resolved"
  | "archived";

/** Authorized signal producers (Chapter 6). */
export type SignalProducer =
  | "deal_resolver"
  | "contact_resolver"
  | "company_resolver"
  | "task_engine"
  | "email_engine"
  | "ai_core"; // post-Alpha

/** Authorized signal consumers (Chapter 7). */
export type SignalClaimer =
  | "today_focus"
  | "today_attention"
  | "today_relationships"
  | "today_work"
  | "workspace_decision"
  | "workspace_situation"
  | "business_memory"; // post-Alpha

/** Consumer priority order for claim suppression (Chapter 8, Level 1).
 *  Lower index = higher priority. A signal claimed by index N suppresses all at index > N. */
export const SIGNAL_CLAIMER_PRIORITY: SignalClaimer[] = [
  "today_focus",
  "workspace_decision",
  "today_attention",
  "workspace_situation",
  "today_relationships",
  "today_work",
  "business_memory",
];

/** User dismissal types (Chapter 8, Level 2). */
export type DismissalType = "remind_later" | "not_urgent" | "not_relevant";

/** TTL in hours per dismissal type. */
export const DISMISSAL_TTL_HOURS: Record<DismissalType, number | null> = {
  remind_later: 24,
  not_urgent: 7 * 24,
  not_relevant: null, // Until underlying condition resolves and recurs
};

// ─── Signal Evolution (Chapter 19) ───────────────────────────────────────────

export type SignalEvolutionState =
  | "initial"
  | "escalated"
  | "de_escalated"
  | "evolved"
  | "resolved";

export type SeverityDelta = {
  from: SignalSeverity;
  to: SignalSeverity;
  reason: string;
};

export type EvidenceUpdate = {
  evidenceKey: string;
  evidenceData: Record<string, string | number>;
};

/** A single event in a signal's evolution history. */
export type EvolutionEvent = {
  evolutionId: string;
  timestamp: string; // ISO 8601
  previousState: SignalEvolutionState;
  newState: SignalEvolutionState;
  trigger: string;
  evidenceUpdate: EvidenceUpdate | null;
  severityChange: SeverityDelta | null;
};

// ─── Signal Contract (Chapter 4 + Chapter 18 Identity) ───────────────────────

/** The complete Signal record — all fields from the Signal Contract and Identity Contract. */
export type Signal = {
  // Primary identity
  id: string;
  workspaceId: string;

  // Signal Contract
  entityType: EntityType;
  entityId: string;
  type: SignalType;
  tier: SignalTier;
  severity: SignalSeverity;
  confidence: SignalConfidence;
  evidenceKey: string;
  evidenceData: Record<string, string | number>;
  actionType: string;
  producedBy: SignalProducer;
  producedAt: string;
  expiresAt: string | null;
  resolutionCondition: string;
  state: SignalState;
  claimedBy: SignalClaimer | null;
  suppressedUntil: string | null;
  resolvedAt: string | null;

  // Signal Identity (Chapter 18)
  origin: string;
  correlationId: string;
  parentSignalId: string | null;

  // Signal Evolution (Chapter 19)
  evolutionHistory: EvolutionEvent[];

  // Row timestamps
  createdAt: string;
  updatedAt: string;
};

// ─── Database row shape (snake_case from Supabase) ───────────────────────────

export type SignalRow = {
  id: string;
  workspace_id: string;
  entity_type: string;
  entity_id: string;
  type: string;
  tier: number;
  severity: string;
  confidence: string;
  evidence_key: string;
  evidence_data: Record<string, string | number>;
  action_type: string;
  produced_by: string;
  produced_at: string;
  expires_at: string | null;
  resolution_condition: string;
  state: string;
  claimed_by: string | null;
  suppressed_until: string | null;
  resolved_at: string | null;
  origin: string;
  correlation_id: string;
  parent_signal_id: string | null;
  evolution_history: EvolutionEvent[];
  created_at: string;
  updated_at: string;
};

/** Converts a database row to the typed Signal shape. */
export function rowToSignal(row: SignalRow): Signal {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    entityType: row.entity_type as EntityType,
    entityId: row.entity_id,
    type: row.type as SignalType,
    tier: row.tier as SignalTier,
    severity: row.severity as SignalSeverity,
    confidence: row.confidence as SignalConfidence,
    evidenceKey: row.evidence_key,
    evidenceData: row.evidence_data,
    actionType: row.action_type,
    producedBy: row.produced_by as SignalProducer,
    producedAt: row.produced_at,
    expiresAt: row.expires_at,
    resolutionCondition: row.resolution_condition,
    state: row.state as SignalState,
    claimedBy: row.claimed_by as SignalClaimer | null,
    suppressedUntil: row.suppressed_until,
    resolvedAt: row.resolved_at,
    origin: row.origin,
    correlationId: row.correlation_id,
    parentSignalId: row.parent_signal_id,
    evolutionHistory: row.evolution_history,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Production input ─────────────────────────────────────────────────────────

/** Parameters passed by a producer to the Signal Engine when creating a signal. */
export type ProduceSignalParams = {
  workspaceId: string;
  entityType: EntityType;
  entityId: string;
  type: SignalType;
  confidence: SignalConfidence;
  evidenceData: Record<string, string | number>;
  producedBy: SignalProducer;
  origin: string;
  correlationId?: string;
  parentSignalId?: string;
  /** Override the type's default expiresAt by providing a specific ISO timestamp. */
  expiresAt?: string;
};
