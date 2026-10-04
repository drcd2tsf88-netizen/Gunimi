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

async function firstLookExists(workspaceId: string, contactId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("workspace_memories")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("entity_id", contactId)
    .eq("entity_type", "contact")
    .eq("memory_type", "context")
    .eq("created_by", "ai_core")
    .limit(1)
    .maybeSingle();
  return !!data;
}

export async function generateContactFirstLook({
  workspaceId,
  contactId,
  name,
  email,
  companyName,
  position,
}: {
  workspaceId: string;
  contactId: string;
  name: string;
  email?: string | null;
  companyName?: string | null;
  position?: string | null;
}): Promise<void> {
  try {
    if (await firstLookExists(workspaceId, contactId)) return;

    const allowed = await checkAIBudget(workspaceId);
    if (!allowed) return;

    const language = await getWorkspaceLanguage(workspaceId);

    const domain = email?.split("@")[1] ?? null;

    const lines: string[] = [`Name: ${name}`];
    if (email) lines.push(`Email: ${email}`);
    if (domain) lines.push(`Email domain: ${domain}`);
    if (companyName) lines.push(`Company: ${companyName}`);
    if (position) lines.push(`Position: ${position}`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 120,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `You are Gunimi AI — an embedded business intelligence layer inside a workspace OS.
A new contact was just added. Based only on the available data (name, email domain, company, position), write exactly 2 sentences about this person.
Infer what you can: industry, likely role seniority, company type from domain, potential context for outreach.
Be specific and actionable. Do not fabricate specific facts. Do not say "I cannot determine" — always make a reasonable inference.
Do not start with "Based on" or "This contact". Write naturally as if briefing a colleague.
Write in ${language}. Return only the 2 sentences, nothing else.`,
        },
        {
          role: "user",
          content: lines.join("\n"),
        },
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) return;

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
      entityId: contactId,
      entityType: "contact",
      memoryType: "context",
      content,
      confidence: "inferred",
      source: "ai_extraction",
      createdBy: "ai_core",
    });
  } catch (err) {
    logger.error("generateContactFirstLook failed:", err);
  }
}
