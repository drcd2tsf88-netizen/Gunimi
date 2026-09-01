"use server";

import { logger } from "@/lib/logger";
import { insertBusinessMemory } from "@/lib/memory/businessMemoryQueries";
import type { ProvenanceEntry } from "@/lib/memory/businessMemoryTypes";

type OutcomeInput = {
  workspaceId: string;
  dealId: string;
  dealTitle: string;
  stage: string;
  outcome: "won" | "lost";
  contactId: string | null;
  companyId: string | null;
};

export async function createOutcomeMemory(input: OutcomeInput): Promise<void> {
  try {
    const content =
      input.outcome === "won"
        ? `Deal "${input.dealTitle}" was won at stage "${input.stage}".`
        : `Deal "${input.dealTitle}" was lost at stage "${input.stage}".`;

    const provenance: ProvenanceEntry = {
      provenanceId: `prov_deal_${input.dealId}_${Date.now()}`,
      sourceType: "activity",
      sourceId: `deal_id:${input.dealId}`,
      sourceDate: new Date().toISOString(),
      extractedOn: new Date().toISOString(),
      extractedBy: "system",
      contribution: "created",
      versionAt: "1.0",
    };

    const targets: Array<{ entityId: string; entityType: "contact" | "company" | "deal" }> = [
      { entityId: input.dealId, entityType: "deal" },
    ];
    if (input.contactId) targets.push({ entityId: input.contactId, entityType: "contact" });
    if (input.companyId) targets.push({ entityId: input.companyId, entityType: "company" });

    for (const target of targets) {
      await insertBusinessMemory({
        workspaceId: input.workspaceId,
        entityId: target.entityId,
        entityType: target.entityType,
        memoryType: "outcome",
        content,
        confidence: "observed",
        source: "signal_archive",
        createdBy: "system",
        evidenceIds: [`deal_id:${input.dealId}`],
        provenance: [provenance],
      });
    }
  } catch {
    logger.error("createOutcomeMemory failed");
  }
}
