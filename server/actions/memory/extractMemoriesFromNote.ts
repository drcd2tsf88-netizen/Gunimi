"use server";

import { openai } from "@/lib/ai/providers/openai";
import { logger } from "@/lib/logger";
import { insertBusinessMemory } from "@/lib/memory/businessMemoryQueries";
import type { BusinessMemoryType, MemoryConfidence, ProvenanceEntry } from "@/lib/memory/businessMemoryTypes";

type ExtractionInput = {
  workspaceId: string;
  noteId: string;
  noteTitle: string;
  noteContent: string | null;
  contactId?: string | null;
  companyId?: string | null;
  createdAt: string;
};

type ExtractedItem = {
  memory_type: "commitment" | "context";
  content: string;
  confidence: "stated" | "inferred";
};

const SYSTEM_PROMPT = `You extract business intelligence from CRM notes.
Only extract specific, observable facts — never assumptions, sentiment, motivations, or predictions.

Extract two categories:
1. commitment: An explicit commitment made (sender sends something, contact asked for something, deadline stated)
2. context: Significant business context that affects future interactions (budget freeze, role change, company event, timing constraint)

Rules — every extracted item MUST satisfy ALL of these:
- Names a specific entity (a contact name, company, role, or event)
- States an observable fact (not "seems", "probably", "might", "appears")
- Would be accepted as a factual briefing by a business professional
- Is currently true — not a prediction or assumption

Do NOT extract:
- Generic observations without specifics ("follow-up needed")
- Sentiment or emotion ("seems enthusiastic")
- Predictions or speculation
- Information already in structured CRM fields (deal value, contact email)
- Activity log facts ("email sent", "call scheduled")

Return JSON: { "memories": [ { "memory_type": "commitment" | "context", "content": "...", "confidence": "stated" | "inferred" } ] }
Return empty array if no qualifying facts exist. Max 3 items total.`;

export async function extractMemoriesFromNote(input: ExtractionInput): Promise<void> {
  try {
    const fullText = [input.noteTitle, input.noteContent ?? ""].join("\n").trim();
    if (fullText.length < 30) return;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Note:\n${fullText}` },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return;

    const parsed = JSON.parse(raw) as { memories?: ExtractedItem[] };
    const items = parsed.memories ?? [];
    if (!items.length) return;

    const entityId = input.contactId ?? input.companyId;
    const entityType = input.contactId ? "contact" : "company";
    if (!entityId) return;

    const provenance: ProvenanceEntry = {
      provenanceId: `prov_${Date.now()}`,
      sourceType: "note",
      sourceId: `note_id:${input.noteId}`,
      sourceDate: input.createdAt,
      extractedOn: new Date().toISOString(),
      extractedBy: "ai_core",
      contribution: "created",
      versionAt: "1.0",
    };

    for (const item of items.slice(0, 3)) {
      if (!item.content || !item.memory_type || !item.confidence) continue;
      if (item.content.length < 10) continue;

      await insertBusinessMemory({
        workspaceId: input.workspaceId,
        entityId,
        entityType: entityType as "contact" | "company",
        memoryType: item.memory_type as BusinessMemoryType,
        content: item.content.trim(),
        confidence: item.confidence as MemoryConfidence,
        source: "ai_extraction",
        createdBy: "ai_core",
        evidenceIds: [`note_id:${input.noteId}`],
        provenance: [provenance],
      });
    }
  } catch {
    logger.error("extractMemoriesFromNote failed");
  }
}
