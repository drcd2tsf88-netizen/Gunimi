import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { formatBusinessMemory } from "./businessMemoryTypes";
import type { BusinessMemory, BusinessMemoryEntityType, BusinessMemoryType, MemorySource, MemoryActor, MemoryConfidence, ProvenanceEntry, MemoryVersion, VersionChangeReason } from "./businessMemoryTypes";

const SURFACEABLE_STATES = ["active", "evolved"] as const;
const SURFACEABLE_CONFIDENCE = ["observed", "stated", "inferred"] as const;

export async function queryEntityBusinessMemories(
  workspaceId: string,
  entityId: string,
  entityType: BusinessMemoryEntityType,
  limit = 10
): Promise<BusinessMemory[]> {
  const { data } = await supabaseAdmin
    .from("workspace_memories")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("entity_id", entityId)
    .eq("entity_type", entityType)
    .in("state", SURFACEABLE_STATES)
    .in("confidence", SURFACEABLE_CONFIDENCE)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(formatBusinessMemory);
}

export async function insertBusinessMemory(payload: {
  workspaceId: string;
  entityId: string;
  entityType: BusinessMemoryEntityType;
  memoryType: BusinessMemoryType;
  content: string;
  confidence: MemoryConfidence;
  source: MemorySource;
  createdBy: MemoryActor;
  evidenceIds?: string[];
  signalIds?: string[];
  provenance?: ProvenanceEntry[];
}): Promise<BusinessMemory | null> {
  const now = new Date().toISOString();

  const initialVersion: MemoryVersion = {
    version: "1.0",
    content: payload.content,
    confidence: payload.confidence,
    changedBy: payload.createdBy,
    changeReason: "initial" as VersionChangeReason,
    timestamp: now,
    evidenceIds: payload.evidenceIds ?? [],
  };

  const { data, error } = await supabaseAdmin
    .from("workspace_memories")
    .insert({
      workspace_id: payload.workspaceId,
      entity_id: payload.entityId,
      entity_type: payload.entityType,
      memory_type: payload.memoryType,
      content: payload.content,
      confidence: payload.confidence,
      state: "active",
      source: payload.source,
      created_by: payload.createdBy,
      updated_by: payload.createdBy,
      signal_ids: payload.signalIds ?? [],
      evidence_ids: payload.evidenceIds ?? [],
      revision: 1,
      version: "1.0",
      version_history: [initialVersion],
      provenance: payload.provenance ?? [],
    })
    .select()
    .single();

  if (error) return null;
  return formatBusinessMemory(data);
}

export async function archiveBusinessMemoryById(
  workspaceId: string,
  memoryId: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from("workspace_memories")
    .update({ state: "archived", updated_at: new Date().toISOString(), updated_by: "user" })
    .eq("id", memoryId)
    .eq("workspace_id", workspaceId);

  return !error;
}
