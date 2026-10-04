"use server";

import { openai } from "@/lib/ai/providers/openai";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { insertBusinessMemory } from "@/lib/memory/businessMemoryQueries";
import { checkAIBudget } from "@/lib/ai/checkAIBudget";
import { logAIUsage } from "@/lib/ai/logUsage";
import { logger } from "@/lib/logger";

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

async function emailInsightExists(workspaceId: string, contactId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("workspace_memories")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("entity_id", contactId)
    .eq("entity_type", "contact")
    .eq("memory_type", "relationship_pattern")
    .eq("created_by", "ai_core")
    .limit(1)
    .maybeSingle();
  return !!data;
}

type ContactGroup = {
  contactId: string;
  contactName: string;
  threads: Array<{ subject: string; snippet: string }>;
};

export async function generateEmailConnectionWakeup({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<void> {
  try {
    const allowed = await checkAIBudget(workspaceId);
    if (!allowed) return;

    const language = await getWorkspaceLanguage(workspaceId);

    const { data: threads } = await supabaseAdmin
      .from("email_threads")
      .select("contact_id, subject, snippet")
      .eq("workspace_id", workspaceId)
      .not("contact_id", "is", null)
      .order("last_message_at", { ascending: false })
      .limit(60);

    if (!threads?.length) return;

    // Collect unique contact IDs
    const contactIds = [...new Set(threads.map((t) => t.contact_id as string))].slice(0, 12);

    const { data: people } = await supabaseAdmin
      .from("workspace_people")
      .select("id, full_name")
      .in("id", contactIds);

    if (!people?.length) return;

    const nameById = new Map(people.map((p) => [p.id, p.full_name ?? "Unknown"]));

    // Group threads by contact
    const byContact = new Map<string, ContactGroup>();
    for (const thread of threads) {
      const contactId = thread.contact_id as string;
      if (!byContact.has(contactId)) {
        byContact.set(contactId, {
          contactId,
          contactName: nameById.get(contactId) ?? "Unknown",
          threads: [],
        });
      }
      const group = byContact.get(contactId)!;
      if (group.threads.length < 5) {
        group.threads.push({
          subject: (thread.subject as string) ?? "",
          snippet: (thread.snippet as string) ?? "",
        });
      }
    }

    // Only contacts with ≥2 threads have enough signal
    const candidates = [...byContact.values()].filter((c) => c.threads.length >= 2);

    for (const candidate of candidates) {
      const exists = await emailInsightExists(workspaceId, candidate.contactId);
      if (exists) continue;

      const threadLines = candidate.threads
        .map((t, i) => `${i + 1}. "${t.subject}" — ${t.snippet}`)
        .join("\n");

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 100,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `You are Gunimi AI, an embedded business intelligence layer. Based on email thread data, write exactly 1-2 sentences about the nature of this business relationship. Focus on communication frequency, topics discussed, and business context. Be specific. Do not start with "Based on". Write in ${language}.`,
          },
          {
            role: "user",
            content: `Contact: ${candidate.contactName}\n${candidate.threads.length} email threads:\n${threadLines}`,
          },
        ],
      });

      const content = completion.choices[0]?.message?.content?.trim();
      if (!content) continue;

      const usage = completion.usage;
      if (usage) {
        await logAIUsage({
          workspaceId,
          userId: null,
          feature: "summary",
          model: "gpt-4o-mini",
          inputTokens: usage.prompt_tokens,
          outputTokens: usage.completion_tokens,
        });
      }

      await insertBusinessMemory({
        workspaceId,
        entityId: candidate.contactId,
        entityType: "contact",
        memoryType: "relationship_pattern",
        content,
        confidence: "inferred",
        source: "ai_extraction",
        createdBy: "ai_core",
      });
    }
  } catch (err) {
    logger.error("generateEmailConnectionWakeup failed:", err);
  }
}
