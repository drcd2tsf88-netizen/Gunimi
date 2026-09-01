export type BusinessMemoryType =
  | "commitment"
  | "relationship_pattern"
  | "preference"
  | "outcome"
  | "context"
  | "team"
  | "risk";

export type MemoryConfidence = "observed" | "stated" | "inferred" | "uncertain";

export type MemoryState = "active" | "weakened" | "evolved" | "decayed" | "archived";

export type MemorySource =
  | "note"
  | "signal_archive"
  | "interaction_pattern"
  | "ai_extraction"
  | "user_manual";

export type MemoryActor = "system" | "user" | "ai_core";

export type BusinessMemoryEntityType = "contact" | "company" | "deal";

export type VersionChangeReason =
  | "initial"
  | "reinforcement"
  | "contradiction"
  | "correction"
  | "merge"
  | "summarization";

export type MemoryVersion = {
  version: string;
  content: string;
  confidence: MemoryConfidence;
  changedBy: MemoryActor;
  changeReason: VersionChangeReason;
  timestamp: string;
  evidenceIds: string[];
};

export type ProvenanceSourceType =
  | "note"
  | "signal"
  | "email"
  | "meeting"
  | "activity"
  | "user_correction"
  | "ai_synthesis";

export type ProvenanceContribution = "created" | "reinforced" | "evolved" | "merged" | "corrected";

export type ProvenanceEntry = {
  provenanceId: string;
  sourceType: ProvenanceSourceType;
  sourceId: string;
  sourceDate: string;
  extractedOn: string;
  extractedBy: MemoryActor;
  contribution: ProvenanceContribution;
  versionAt: string;
};

export type BusinessMemory = {
  id: string;
  workspace_id: string;
  entity_id: string;
  entity_type: BusinessMemoryEntityType;
  memory_type: BusinessMemoryType;
  content: string;
  state: MemoryState;
  confidence: MemoryConfidence;
  source: MemorySource;
  created_by: MemoryActor;
  updated_by: MemoryActor;
  signal_ids: string[];
  evidence_ids: string[];
  revision: number;
  version: string;
  version_history: MemoryVersion[];
  provenance: ProvenanceEntry[];
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BusinessMemoryRow = {
  id: string;
  workspace_id: string;
  entity_id: string;
  entity_type: string;
  memory_type: string;
  content: string;
  state: string;
  confidence: string;
  source: string;
  created_by: string;
  updated_by: string;
  signal_ids: string[];
  evidence_ids: string[];
  revision: number;
  version: string;
  version_history: unknown;
  provenance: unknown;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export function formatBusinessMemory(row: BusinessMemoryRow): BusinessMemory {
  return {
    ...row,
    entity_type: row.entity_type as BusinessMemoryEntityType,
    memory_type: row.memory_type as BusinessMemoryType,
    state: row.state as MemoryState,
    confidence: row.confidence as MemoryConfidence,
    source: row.source as MemorySource,
    created_by: row.created_by as MemoryActor,
    updated_by: row.updated_by as MemoryActor,
    version_history: (row.version_history as MemoryVersion[]) ?? [],
    provenance: (row.provenance as ProvenanceEntry[]) ?? [],
  };
}
