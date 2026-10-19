"use server";

import { openai } from "@/lib/ai/providers/openai";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { insertBusinessMemory } from "@/lib/memory/businessMemoryQueries";
import { checkAIBudget } from "@/lib/ai/checkAIBudget";
import { logAIUsage } from "@/lib/ai/logUsage";
import { logger } from "@/lib/logger";
import { getWorkspaceAILanguage } from "@/lib/ai/getWorkspaceAILanguage";

async function dealFirstLookExists(workspaceId: string, dealId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("workspace_memories")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("entity_id", dealId)
    .eq("entity_type", "deal")
    .eq("memory_type", "context")
    .eq("created_by", "ai_core")
    .limit(1)
    .maybeSingle();
  return !!data;
}

export async function generateDealFirstLook({
  workspaceId,
  dealId,
  title,
  stage,
  value,
  currency,
  companyName,
  contactName,
}: {
  workspaceId: string;
  dealId: string;
  title: string;
  stage: string;
  value?: number | null;
  currency?: string | null;
  companyName?: string | null;
  contactName?: string | null;
}): Promise<void> {
  try {
    if (await dealFirstLookExists(workspaceId, dealId)) return;

    const budget = await checkAIBudget(workspaceId);
    if (!budget.allowed) return;

    const language = await getWorkspaceAILanguage(workspaceId);

    const lines: string[] = [`Deal: ${title}`, `Stage: ${stage}`];
    if (value != null) lines.push(`Value: ${value}${currency ? ` ${currency}` : ""}`);
    if (companyName) lines.push(`Company: ${companyName}`);
    if (contactName) lines.push(`Contact: ${contactName}`);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 120,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `You are Gunimi AI — an embedded business intelligence layer inside a workspace OS.
A new deal was just added to the pipeline. Based only on the available data (title, stage, value, company, contact), write exactly 2 sentences about this deal.
Infer what you can: deal urgency, likely objections, recommended next steps, or strategic importance.
Be specific and actionable. Do not fabricate specific facts. Do not say "I cannot determine" — always make a reasonable inference.
Do not start with "Based on" or "This deal". Write naturally as if briefing a sales manager.
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
      entityId: dealId,
      entityType: "deal",
      memoryType: "context",
      content,
      confidence: "inferred",
      source: "ai_extraction",
      createdBy: "ai_core",
    });
  } catch (err) {
    logger.error("generateDealFirstLook failed:", err);
  }
}
