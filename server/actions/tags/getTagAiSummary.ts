"use server";

import { openai } from "@/lib/ai/providers/openai";
import { getTagWithEntities } from "./getTagWithEntities";
import { logger } from "@/lib/logger";

export async function getTagAiSummary(tagId: string): Promise<string | null> {
  try {
    const result = await getTagWithEntities(tagId);
    if (!result) return null;

    const { tag, contacts, companies, deals, tasks, notes } = result;
    const total =
      contacts.length + companies.length + deals.length + tasks.length + notes.length;
    if (total === 0) return null;

    const lines: string[] = [`Tag: "${tag.name}"`];

    if (contacts.length > 0) {
      const names = contacts
        .slice(0, 12)
        .map((c) => [c.first_name, c.last_name].filter(Boolean).join(" "));
      lines.push(`Contacts (${contacts.length}): ${names.join(", ")}`);
    }
    if (companies.length > 0) {
      const names = companies.slice(0, 12).map((c) => c.name);
      lines.push(`Companies (${companies.length}): ${names.join(", ")}`);
    }
    if (deals.length > 0) {
      const items = deals
        .slice(0, 12)
        .map(
          (d) =>
            `${d.name} [${d.stage ?? "—"}${d.value != null ? `, $${d.value.toLocaleString()}` : ""}]`
        );
      lines.push(`Deals (${deals.length}): ${items.join(", ")}`);
    }
    if (tasks.length > 0) {
      const items = tasks.slice(0, 12).map((t) => `${t.title} [${t.status}, ${t.priority}]`);
      lines.push(`Tasks (${tasks.length}): ${items.join(", ")}`);
    }
    if (notes.length > 0) {
      const items = notes.slice(0, 12).map((n) => n.title);
      lines.push(`Notes (${notes.length}): ${items.join(", ")}`);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 140,
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content: `You are an AI embedded in a business workspace OS called Gunimi.
Analyze the provided tag data and write exactly 2 sentences that describe what this tag represents and what patterns you observe.
Be specific — mention entity types, themes, or business context you detect.
Write in present tense. Do not start with "This tag". Return only the 2-sentence insight, nothing else.`,
        },
        {
          role: "user",
          content: lines.join("\n"),
        },
      ],
    });

    return completion.choices[0]?.message?.content?.trim() ?? null;
  } catch (err) {
    logger.error("getTagAiSummary failed:", err);
    return null;
  }
}
