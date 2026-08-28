"use server";

import { openai } from "@/lib/ai/providers/openai";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getTagWithEntities } from "./getTagWithEntities";
import { logger } from "@/lib/logger";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const LANG_NAMES: Record<string, string> = {
  sk: "Slovak",
  cs: "Czech",
  en: "English",
};

async function getWorkspaceLanguage(workspaceId: string): Promise<string> {
  const { data } = await supabaseAdmin
    .from("workspaces")
    .select("preferences")
    .eq("id", workspaceId)
    .maybeSingle();
  const lang = (data?.preferences as { language?: string } | null)?.language ?? "en";
  return LANG_NAMES[lang] ?? "English";
}

export async function getTagAiSummary(tagId: string, force = false): Promise<string | null> {
  try {
    // Fast path: return cached summary if fresh
    if (!force) {
      const { data: cached } = await supabaseAdmin
        .from("workspace_tags")
        .select("ai_summary, ai_summary_at")
        .eq("id", tagId)
        .maybeSingle();

      if (cached?.ai_summary && cached.ai_summary_at) {
        const age = Date.now() - new Date(cached.ai_summary_at).getTime();
        if (age < CACHE_TTL_MS) return cached.ai_summary;
      }
    }

    // Fetch entities for context
    const result = await getTagWithEntities(tagId);
    if (!result) return null;

    const { tag, contacts, companies, deals, tasks, notes } = result;
    const total = contacts.length + companies.length + deals.length + tasks.length + notes.length;
    if (total === 0) return null;

    const language = await getWorkspaceLanguage(tag.workspace_id);

    const lines: string[] = [`Tag: "${tag.name}"`, `Total tagged entities: ${total}`];

    if (contacts.length > 0) {
      const names = contacts
        .slice(0, 15)
        .map((c) => [c.first_name, c.last_name].filter(Boolean).join(" "));
      lines.push(`Contacts (${contacts.length}): ${names.join(", ")}`);
    }
    if (companies.length > 0) {
      const items = companies.slice(0, 15).map((c) => `${c.name}${c.industry ? ` [${c.industry}]` : ""}`);
      lines.push(`Companies (${companies.length}): ${items.join(", ")}`);
    }
    if (deals.length > 0) {
      const items = deals
        .slice(0, 15)
        .map((d) => `${d.title} [${d.stage ?? "—"}${d.value != null ? `, €${d.value.toLocaleString()}` : ""}]`);
      lines.push(`Deals (${deals.length}): ${items.join(", ")}`);
    }
    if (tasks.length > 0) {
      const items = tasks.slice(0, 15).map((t) => `${t.title} [${t.status}, ${t.priority}]`);
      lines.push(`Tasks (${tasks.length}): ${items.join(", ")}`);
    }
    if (notes.length > 0) {
      const items = notes.slice(0, 15).map((n) => n.title);
      lines.push(`Notes (${notes.length}): ${items.join(", ")}`);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 180,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `You are an AI embedded in Gunimi, a business workspace OS.
Analyze the tag data and write exactly 2–3 sentences describing what this tag represents and what business patterns you observe across its entities.
Be specific: mention entity types, industries, deal stages, or themes you detect.
If there is a clear actionable pattern (e.g. stalled deals, VIP contacts, specific industry cluster), mention it.
Write in present tense. Do not start with "This tag". Return only the insight text, nothing else.
IMPORTANT: Write your response in ${language}. Do not use any other language.`,
        },
        {
          role: "user",
          content: lines.join("\n"),
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content?.trim() ?? null;

    // Persist to cache
    if (summary) {
      await supabaseAdmin
        .from("workspace_tags")
        .update({ ai_summary: summary, ai_summary_at: new Date().toISOString() })
        .eq("id", tagId);
    }

    return summary;
  } catch (err) {
    logger.error("getTagAiSummary failed:", err);
    return null;
  }
}
