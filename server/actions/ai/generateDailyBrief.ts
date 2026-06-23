"use server";

import OpenAI from "openai";
import type { WorkspaceAIContext } from "./getWorkspaceContext";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type DailyBriefItem = {
  text: string;
  entityType?: "deal" | "contact" | "company" | "task";
  entityId?: string;
  entityHref?: string;
};

export type DailyBrief = {
  summary: string;
  priorities: DailyBriefItem[];
  risks: DailyBriefItem[];
  opportunities: DailyBriefItem[];
};

type RawItem = {
  text?: string;
  entityType?: string;
  entityId?: string;
};

type RawBrief = {
  summary?: string;
  priorities?: RawItem[];
  risks?: RawItem[];
  opportunities?: RawItem[];
};

const ENTITY_HREFS: Record<string, (id: string) => string> = {
  deal: (id) => `/dashboard/deals/${id}`,
  contact: (id) => `/dashboard/crm/${id}`,
  company: (id) => `/dashboard/companies/${id}`,
  task: () => `/dashboard/tasks`,
};

export async function generateDailyBrief(
  ctx: WorkspaceAIContext
): Promise<DailyBrief | null> {
  try {
    const validDealIds = new Set(ctx.deals.map((d) => d.id));
    const validTaskIds = new Set(ctx.tasks.map((t) => t.id));

    const contextBlock = formatBriefContext(ctx);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      max_tokens: 600,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Orbit AI, an executive workspace intelligence system for ${ctx.workspaceName}. Analyze the workspace data and generate a structured founder daily brief.

${contextBlock}

Return a JSON object with this exact structure:
{
  "summary": "One specific sentence describing the most critical workspace state today. Reference real names and numbers.",
  "priorities": [
    { "text": "Specific actionable item with real name/value", "entityType": "deal|task|contact|company", "entityId": "exact-uuid-from-context" }
  ],
  "risks": [
    { "text": "Specific risk with real name/value", "entityType": "deal|task", "entityId": "exact-uuid-from-context" }
  ],
  "opportunities": [
    { "text": "Specific opportunity with real name/value", "entityType": "deal|company|contact", "entityId": "exact-uuid-from-context" }
  ]
}

STRICT RULES:
- Max 3 priorities, 2 risks, 2 opportunities
- Every item MUST reference real names, values or dates from the context — no generic statements
- entityId MUST be an exact UUID shown in the context — omit entityId entirely if no entity applies
- DO NOT invent UUIDs
- If a category has no relevant data, return an empty array []
- summary must be one sentence, specific, direct — no preamble`,
        },
        {
          role: "user",
          content: "Generate today's founder daily brief.",
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) return null;

    const raw = JSON.parse(content) as RawBrief;

    function resolveItems(items: RawItem[] | undefined): DailyBriefItem[] {
      return (items ?? [])
        .filter((item): item is RawItem & { text: string } => Boolean(item.text))
        .map((item) => {
          const type = item.entityType as DailyBriefItem["entityType"];
          const id = item.entityId;

          const isValidId =
            (type === "deal" && id && validDealIds.has(id)) ||
            (type === "task" && id && validTaskIds.has(id)) ||
            (type === "contact" && id) ||
            (type === "company" && id);

          const href =
            isValidId && type && id && ENTITY_HREFS[type]
              ? ENTITY_HREFS[type](id)
              : undefined;

          return {
            text: item.text,
            entityType: type,
            entityId: isValidId ? id : undefined,
            entityHref: href,
          };
        });
    }

    return {
      summary: raw.summary ?? "",
      priorities: resolveItems(raw.priorities),
      risks: resolveItems(raw.risks),
      opportunities: resolveItems(raw.opportunities),
    };
  } catch (error) {
    console.error("generateDailyBrief failed:", error);
    return null;
  }
}

function formatBriefContext(ctx: WorkspaceAIContext): string {
  const today = new Date();
  const lines: string[] = [
    `WORKSPACE: ${ctx.workspaceName}`,
    `DATE: ${today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`,
    `STATS: ${ctx.analytics.companies} companies | ${ctx.analytics.openDeals} open deals | ${ctx.analytics.openTasks} open tasks | ${ctx.analytics.members} members`,
  ];

  if (ctx.deals.length > 0) {
    lines.push("\nOPEN DEALS:");
    ctx.deals.forEach((d) => {
      const val = d.value != null ? `€${d.value.toLocaleString()}` : "no value set";
      const stale = d.daysSinceUpdated > 7 ? ` [STALE: ${d.daysSinceUpdated} days inactive]` : "";
      const co = d.company ? ` @ ${d.company}` : "";
      lines.push(`• [ID:${d.id}] ${d.title}${co} — ${d.stage} — ${val}${stale}`);
    });
  }

  const overdue = ctx.tasks.filter((t) => t.isOverdue);
  const upcoming = ctx.tasks.filter((t) => !t.isOverdue);

  if (overdue.length > 0) {
    lines.push("\nOVERDUE TASKS:");
    overdue.forEach((t) => {
      lines.push(`• [ID:${t.id}] [${t.priority.toUpperCase()}] ${t.title}`);
    });
  }

  if (upcoming.length > 0) {
    lines.push("\nUPCOMING TASKS:");
    upcoming.slice(0, 5).forEach((t) => {
      const due = t.dueDate
        ? ` — due ${new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        : "";
      lines.push(`• [ID:${t.id}] [${t.priority.toUpperCase()}] ${t.title}${due}`);
    });
  }

  if (ctx.meetings.length > 0) {
    lines.push("\nUPCOMING MEETINGS:");
    ctx.meetings.forEach((m) => {
      const when = new Date(m.startAt).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      lines.push(`• ${m.title} — ${when}`);
    });
  }

  const unread = ctx.emails.filter((e) => e.unread);
  if (unread.length > 0) {
    lines.push(`\nUNREAD EMAILS (${unread.length}):`);
    unread.forEach((e) =>
      lines.push(`• "${e.subject}"${e.contact ? ` from ${e.contact}` : ""}`)
    );
  }

  if (ctx.activity.length > 0) {
    lines.push("\nRECENT ACTIVITY:");
    ctx.activity.slice(0, 5).forEach((a) => lines.push(`• ${a.description}`));
  }

  return lines.join("\n");
}
