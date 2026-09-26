"use server";

import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getUser } from "@/server/actions/auth/getUser";
import { checkAIBudget } from "@/lib/ai/checkAIBudget";
import { logAIUsage } from "@/lib/ai/logUsage";
import { getActiveSignalsForWorkspace } from "@/lib/signals/queries";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MS_PER_DAY = 86_400_000;

export type NextActionResult = {
  suggestion: string;
} | null;

export async function getNextAction(
  entityType: "contact" | "deal",
  entityId: string,
): Promise<NextActionResult> {
  try {
    const [workspace, user] = await Promise.all([getCurrentWorkspace(), getUser()]);
    if (!workspace || !user) return null;

    const budget = await checkAIBudget(workspace.id);
    if (!budget.allowed) return null;

    let contextLines: string[] = [];

    if (entityType === "contact") {
      const [personRow, dealsRow, signals] = await Promise.all([
        supabaseAdmin
          .from("workspace_people")
          .select("name, last_contacted_at, email, position")
          .eq("id", entityId)
          .eq("workspace_id", workspace.id)
          .maybeSingle(),
        supabaseAdmin
          .from("workspace_deals")
          .select("title, value, stage, probability")
          .eq("workspace_id", workspace.id)
          .eq("contact_id", entityId)
          .neq("stage", "won")
          .neq("stage", "lost"),
        getActiveSignalsForWorkspace(workspace.id, supabaseAdmin),
      ]);

      const person = personRow.data;
      if (!person) return null;

      const daysSince = person.last_contacted_at
        ? Math.floor((Date.now() - new Date(person.last_contacted_at).getTime()) / MS_PER_DAY)
        : null;

      const openDeals = dealsRow.data ?? [];
      const totalValue = openDeals.reduce((s, d) => s + Number(d.value ?? 0), 0);
      const contactSignals = signals.filter((s) => s.entityId === entityId).slice(0, 3);

      contextLines = [
        `Contact: ${person.name}${person.position ? ` (${person.position})` : ""}`,
        daysSince !== null ? `Last contacted: ${daysSince} day${daysSince !== 1 ? "s" : ""} ago` : "Never contacted",
        openDeals.length > 0
          ? `Open deals: ${openDeals.length} (total value €${totalValue.toLocaleString()})`
          : "No open deals",
        ...contactSignals.map((s) => `Signal: ${s.type.replace(/_/g, " ")}`),
      ];
    } else {
      const [dealRow, signals] = await Promise.all([
        supabaseAdmin
          .from("workspace_deals")
          .select("title, stage, value, probability, updated_at")
          .eq("id", entityId)
          .eq("workspace_id", workspace.id)
          .maybeSingle(),
        getActiveSignalsForWorkspace(workspace.id, supabaseAdmin),
      ]);

      const deal = dealRow.data;
      if (!deal) return null;

      const daysSinceUpdate = deal.updated_at
        ? Math.floor((Date.now() - new Date(deal.updated_at).getTime()) / MS_PER_DAY)
        : null;

      const dealSignals = signals.filter((s) => s.entityId === entityId).slice(0, 3);

      contextLines = [
        `Deal: ${deal.title}`,
        `Stage: ${deal.stage}, Probability: ${deal.probability}%`,
        `Value: €${Number(deal.value ?? 0).toLocaleString()}`,
        daysSinceUpdate !== null ? `Last updated: ${daysSinceUpdate} day${daysSinceUpdate !== 1 ? "s" : ""} ago` : "",
        ...dealSignals.map((s) => `Signal: ${s.type.replace(/_/g, " ")}`),
      ].filter(Boolean);
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content: `You are Gunimi, a calm executive assistant. Given the context below, write exactly ONE actionable suggestion for the workspace owner.

Rules:
- Start with "I'd"
- Maximum 2 sentences
- Be specific — use names, values, number of days
- No AI labels, no jargon, no markdown
- Sound like advice from a trusted colleague who knows this business`,
        },
        {
          role: "user",
          content: contextLines.join("\n"),
        },
      ],
    });

    void logAIUsage({
      workspaceId: workspace.id,
      userId: user.id,
      feature: "summary",
      inputTokens: completion.usage?.prompt_tokens ?? 0,
      outputTokens: completion.usage?.completion_tokens ?? 0,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) return null;

    return { suggestion: text };
  } catch {
    return null;
  }
}
