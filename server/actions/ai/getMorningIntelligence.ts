"use server";

import OpenAI from "openai";
import type { WorkspaceAIContext } from "./getWorkspaceContext";
import { formatWorkspacePrompt } from "@/lib/ai/context/formatWorkspacePrompt";
import { logAIUsage } from "@/lib/ai/logUsage";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type BriefPriorityItem = {
  action: string;
  why: string;
  href: string;
};

export type BriefRiskItem = {
  text: string;
  href: string;
};

export type BriefOpportunityItem = {
  text: string;
  href: string;
};

export type BriefScheduleItem = {
  text: string;
  time: string | null;
  type: "meeting" | "deadline";
};

export type BriefSuggestion = {
  action: string;
  why: string;
  href: string;
};

export type MorningIntelligence = {
  opening: string;
  priorities: BriefPriorityItem[];
  suggestion: BriefSuggestion | null;
  schedule: BriefScheduleItem[];
  risks: BriefRiskItem[];
  opportunities: BriefOpportunityItem[];
  workspaceName: string;
  generatedAt: string;
};

type RawPriorityItem = { action?: string; why?: string; href?: string };
type RawSuggestion = { action?: string; why?: string; href?: string } | null;
type RawRiskItem = { text?: string; href?: string };
type RawOpportunityItem = { text?: string; href?: string };
type RawScheduleItem = { text?: string; time?: string; type?: string };

type RawMorningBrief = {
  opening?: string;
  priorities?: RawPriorityItem[];
  suggestion?: RawSuggestion;
  schedule?: RawScheduleItem[];
  risks?: RawRiskItem[];
  opportunities?: RawOpportunityItem[];
};

export async function getMorningIntelligence(
  ctx: WorkspaceAIContext,
  logContext?: { workspaceId: string; userId: string }
): Promise<MorningIntelligence | null> {
  try {
    const contextBlock = formatWorkspacePrompt(ctx);
    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.3,
      max_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Gunimi, a trusted executive assistant for ${ctx.workspaceName}.
Today is ${today}.

${contextBlock}

Brief the founder the way a calm, experienced executive assistant would — in plain, direct sentences. No labels. No jargon. No system terminology. No drama. Every sentence should sound like it came from someone who knows this business personally.

Return JSON with this exact structure:
{
  "opening": "One calm sentence stating the condition of the business right now. This is the very first thing the founder reads — make it count. Examples: 'Your pipeline needs attention today.' / 'Nothing urgent this morning — your business looks healthy.' / 'You have a busy day ahead.' / 'A good position this morning.' Never start with I. Never use technical or AI terminology.",
  "priorities": [
    {
      "action": "Short, direct statement of what needs to happen. Written like spoken advice, not a label. Examples: 'Call Acme Corp before end of day.' / 'Follow up with Maria Kowalski this morning.'",
      "why": "2-3 sentences explaining why. Use specific names, values, and number of days. Be honest about the consequence of not acting. No system labels.",
      "href": "/dashboard/deals or /dashboard/tasks or /dashboard/contacts or /dashboard/calendar"
    }
  ],
  "suggestion": {
    "action": "One sentence. Must start with I'd. Examples: 'I'd start with Acme Corp today.' / 'I'd prioritise the Johnson deal this afternoon.'",
    "why": "3-4 sentences. Why this action? Why today specifically? What is the cost of waiting? Be specific about names, values, and timing.",
    "href": "/dashboard/..."
  },
  "schedule": [
    { "text": "Name of the meeting or deadline", "time": "HH:MM AM/PM or null", "type": "meeting|deadline" }
  ],
  "risks": [
    { "text": "One natural sentence describing a specific risk. Name it, value it, age it. Example: 'Acme Corp has had no activity in 12 days — the €18,500 deal may be drifting.' No severity labels.", "href": "/dashboard/..." }
  ],
  "opportunities": [
    { "text": "One natural sentence describing a specific opportunity. Mention the contact or deal and the potential value.", "href": "/dashboard/..." }
  ]
}

RULES:
priorities: max 3. Only include items that genuinely need attention. Rank by business impact. If nothing genuinely needs attention, return [].
suggestion: exactly 1, or null if nothing meaningful to suggest.
schedule: today only — meetings and tasks due today. Max 5 items.
risks: max 3. Only real risks grounded in data. Never manufacture urgency.
opportunities: max 2. Only if there is a genuine, specific opportunity with evidence.
Early-stage workspace (fewer than 3 deals AND fewer than 5 contacts): set opening to an honest, warm sentence such as "You are just getting started — I will have more to share as your workspace grows." Return [] for priorities, risks, and opportunities. Only populate schedule if items exist.
Never use the words CRITICAL, HIGH, WARNING, PRIORITY, AI, RECOMMENDATION, SCORE, or any system-label terminology inside any text field. All text must read as calm spoken advice.
Return [] for empty arrays and null for suggestion when there is nothing to recommend.
Total reading time must stay under 45 seconds.`,
        },
        {
          role: "user",
          content: "What should I know this morning?",
        },
      ],
    });

    if (logContext) {
      void logAIUsage({
        workspaceId: logContext.workspaceId,
        userId: logContext.userId,
        feature: "brief",
        inputTokens: completion.usage?.prompt_tokens ?? 0,
        outputTokens: completion.usage?.completion_tokens ?? 0,
      });
    }

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const raw = JSON.parse(content) as RawMorningBrief;

    const validHrefs = new Set([
      "/dashboard/deals",
      "/dashboard/tasks",
      "/dashboard/contacts",
      "/dashboard/companies",
      "/dashboard/calendar",
    ]);

    function sanitizeHref(href?: string): string {
      if (href && validHrefs.has(href)) return href;
      return "/dashboard";
    }

    const opening =
      typeof raw.opening === "string" && raw.opening.trim()
        ? raw.opening.trim()
        : "Your workspace is ready.";

    const priorities: BriefPriorityItem[] = (raw.priorities ?? [])
      .filter(
        (p): p is RawPriorityItem & { action: string; why: string } =>
          Boolean(p.action && p.why)
      )
      .slice(0, 3)
      .map((p) => ({ action: p.action, why: p.why, href: sanitizeHref(p.href) }));

    const rawSuggestion = raw.suggestion;
    const suggestion: BriefSuggestion | null =
      rawSuggestion?.action && rawSuggestion?.why
        ? {
            action: rawSuggestion.action,
            why: rawSuggestion.why,
            href: sanitizeHref(rawSuggestion.href),
          }
        : null;

    const schedule: BriefScheduleItem[] = (raw.schedule ?? [])
      .filter((s): s is RawScheduleItem & { text: string } => Boolean(s.text))
      .slice(0, 5)
      .map((s) => ({
        text: s.text,
        time: s.time ?? null,
        type: s.type === "meeting" || s.type === "deadline" ? s.type : "meeting",
      }));

    const risks: BriefRiskItem[] = (raw.risks ?? [])
      .filter((r): r is RawRiskItem & { text: string } => Boolean(r.text))
      .slice(0, 3)
      .map((r) => ({ text: r.text, href: sanitizeHref(r.href) }));

    const opportunities: BriefOpportunityItem[] = (raw.opportunities ?? [])
      .filter((o): o is RawOpportunityItem & { text: string } => Boolean(o.text))
      .slice(0, 2)
      .map((o) => ({ text: o.text, href: sanitizeHref(o.href) }));

    return {
      opening,
      priorities,
      suggestion,
      schedule,
      risks,
      opportunities,
      workspaceName: ctx.workspaceName,
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}
