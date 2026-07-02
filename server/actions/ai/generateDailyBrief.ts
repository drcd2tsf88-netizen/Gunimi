"use server";

import OpenAI from "openai";
import type { WorkspaceAIContext } from "./getWorkspaceContext";
import { logAIUsage } from "@/lib/ai/logUsage";

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
  contact: (id) => `/dashboard/contacts/${id}`,
  company: (id) => `/dashboard/companies/${id}`,
  task: () => `/dashboard/tasks`,
};

export async function generateDailyBrief(
  ctx: WorkspaceAIContext,
  logContext?: { workspaceId: string; userId: string }
): Promise<DailyBrief | null> {
  try {
    const validDealIds = new Set(ctx.deals.map((d) => d.id));
    const validTaskIds = new Set(ctx.tasks.map((t) => t.id));
    const validContactIds = new Set(ctx.contacts.map((c) => c.id));
    const validCompanyIds = new Set(ctx.companies.map((c) => c.id));

    // Also include contact IDs from deals (deal contacts may not be in the neglected list)
    ctx.deals.forEach((d) => {
      if (d.contactId) validContactIds.add(d.contactId);
    });

    const contextBlock = formatBriefContext(ctx);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      max_tokens: 800,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Orbit AI, an executive workspace intelligence system for ${ctx.workspaceName}. Generate a founder daily brief from the workspace data below.

${contextBlock}

Return JSON with this exact structure:
{
  "summary": "One specific sentence — real names/numbers, direct, no filler. Focus on the most critical state.",
  "priorities": [
    { "text": "Action with specific name/value/date", "entityType": "deal|task|contact|company", "entityId": "exact [ID:uuid] from context" }
  ],
  "risks": [
    { "text": "Risk with specific name/value", "entityType": "deal|contact", "entityId": "exact [ID:uuid] from context" }
  ],
  "opportunities": [
    { "text": "Opportunity with probability/value", "entityType": "deal|contact|company", "entityId": "exact [ID:uuid] from context" }
  ]
}

PRIORITIES (max 3, ranked by urgency):
1. Deals closing within 7 days — mention name, value, days remaining
2. Overdue tasks — mention title, priority, and assignee if known
3. Deals past expected close date — mention name and days overdue

RISKS (max 3):
1. Revenue at risk — exact dollar figure from REVENUE INTELLIGENCE
2. Deals past close date (from PAST DUE CLOSE DATES section)
3. Neglected contacts — name, company, days since last contact

OPPORTUNITIES (max 3):
1. High-probability deals (>60%) closing soon — mention probability and value
2. High-health-score deals (Healthy, 70+) with strong value
3. Never-contacted leads at high-value companies

STRICT RULES:
- Every item must reference real workspace data — no generic statements
- entityId must be an exact UUID from the [ID:uuid] markers in context — never invent IDs
- Omit entityId if no direct entity applies
- Empty array [] for any category with no relevant data
- summary: one sentence, specific, direct`,
        },
        {
          role: "user",
          content: "Generate today's founder daily brief.",
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
            (type === "contact" && id && validContactIds.has(id)) ||
            (type === "company" && id && validCompanyIds.has(id));

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

function fmt(value: number): string {
  return `$${value.toLocaleString()}`;
}

function formatBriefContext(ctx: WorkspaceAIContext): string {
  const today = new Date();
  const { derived } = ctx;

  const lines: string[] = [
    `WORKSPACE: ${ctx.workspaceName}`,
    `DATE: ${today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`,
    `STATS: ${ctx.analytics.companies} companies | ${ctx.analytics.openDeals} open deals | ${ctx.analytics.openTasks} open tasks | ${ctx.analytics.members} members`,
  ];

  // Revenue intelligence — highest priority signal block
  lines.push("\nREVENUE INTELLIGENCE:");
  if (derived.revenueAtRisk > 0) {
    lines.push(
      `• Revenue at risk: ${fmt(derived.revenueAtRisk)} (${derived.stalledDealsCount} stalled deal${derived.stalledDealsCount !== 1 ? "s" : ""}, no activity >7 days)`
    );
  }
  if (derived.pastDueRevenue > 0) {
    lines.push(
      `• Past-due revenue: ${fmt(derived.pastDueRevenue)} (${derived.pastDueDeals.length} deal${derived.pastDueDeals.length !== 1 ? "s" : ""} past expected close date)`
    );
  }
  if (derived.upcomingRevenue > 0) {
    lines.push(
      `• Expected close revenue (weighted by probability): ${fmt(derived.upcomingRevenue)}`
    );
  }
  if (derived.neglectedContacts.length > 0) {
    lines.push(`• ${derived.neglectedContacts.length} contact${derived.neglectedContacts.length !== 1 ? "s" : ""} not reached in >14 days`);
  }
  if (derived.neverContactedContacts.length > 0) {
    lines.push(`• ${derived.neverContactedContacts.length} lead${derived.neverContactedContacts.length !== 1 ? "s" : ""} never contacted`);
  }

  // Past due deals — explicit risk section
  if (derived.pastDueDeals.length > 0) {
    lines.push("\nPAST DUE CLOSE DATES:");
    derived.pastDueDeals.forEach((d) => {
      const co = d.company ? ` @ ${d.company}` : "";
      const val = d.value != null ? ` — ${fmt(d.value)}` : "";
      lines.push(`• [ID:${d.id}] ${d.title}${co} — ${d.daysPastDue} days past expected close${val}`);
    });
  }

  // Upcoming closings — opportunity signal
  if (derived.upcomingClosings.length > 0) {
    lines.push("\nUPCOMING CLOSINGS (next 14 days):");
    derived.upcomingClosings.forEach((d) => {
      const val = d.value != null ? ` — ${fmt(d.value)}` : "";
      const prob = d.probability != null ? ` — ${d.probability}% probability` : "";
      const co = d.company ? ` @ ${d.company}` : "";
      lines.push(
        `• [ID:${d.id}] ${d.title}${co} — closes in ${d.daysUntilClose} day${d.daysUntilClose !== 1 ? "s" : ""}${val}${prob}`
      );
    });
  }

  // Neglected contacts — relationship risk
  if (derived.neglectedContacts.length > 0) {
    lines.push("\nNEGLECTED CONTACTS (>14 days since last contact):");
    derived.neglectedContacts.forEach((c) => {
      const co = c.company ? ` @ ${c.company}` : "";
      const status = c.status ? ` [${c.status}]` : "";
      lines.push(`• [ID:${c.id}] ${c.name}${status}${co} — ${c.daysSinceContacted} days`);
    });
  }

  // Never-contacted leads
  if (derived.neverContactedContacts.length > 0) {
    lines.push("\nNEVER-CONTACTED LEADS:");
    derived.neverContactedContacts.forEach((c) => {
      const co = c.company ? ` @ ${c.company}` : "";
      lines.push(`• [ID:${c.id}] ${c.name}${co} — ${c.ageInDays} days old, no outreach`);
    });
  }

  // Open deals with health scores and contact IDs for linking
  if (ctx.deals.length > 0) {
    lines.push("\nOPEN DEALS:");
    ctx.deals.forEach((d) => {
      const val = d.value != null ? ` — ${fmt(d.value)}` : "";
      const prob = d.probability != null ? ` — ${d.probability}%` : "";
      const stale = d.daysSinceUpdated > 7 ? ` [STALE:${d.daysSinceUpdated}d]` : "";
      const co = d.company ? ` @ ${d.company}` : "";
      const contact = d.contactId
        ? ` | contact:[ID:${d.contactId}] ${d.contactName ?? ""}`
        : d.contactName
          ? ` | contact: ${d.contactName}`
          : "";
      const health = ` | health:${d.healthScore}(${d.healthLabel})`;
      lines.push(
        `• [ID:${d.id}] ${d.title}${co} — ${d.stage}${val}${prob}${health}${stale}${contact}`
      );
    });
  }

  // Overdue tasks
  const overdue = ctx.tasks.filter((t) => t.isOverdue);
  const upcoming = ctx.tasks.filter((t) => !t.isOverdue);

  if (overdue.length > 0) {
    lines.push("\nOVERDUE TASKS:");
    overdue.forEach((t) => {
      const owner = t.assigneeName ? ` | owner: ${t.assigneeName}` : "";
      lines.push(`• [ID:${t.id}] [${t.priority.toUpperCase()}] ${t.title}${owner}`);
    });
  }

  if (upcoming.length > 0) {
    lines.push("\nUPCOMING TASKS:");
    upcoming.slice(0, 5).forEach((t) => {
      const due = t.dueDate
        ? ` — due ${new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        : "";
      const owner = t.assigneeName ? ` | owner: ${t.assigneeName}` : "";
      lines.push(`• [ID:${t.id}] [${t.priority.toUpperCase()}] ${t.title}${due}${owner}`);
    });
  }

  // Weekly focus
  const wf = derived.weeklyFocus;
  if (wf.tasks.length > 0 || wf.closings.length > 0 || wf.meetings.length > 0) {
    lines.push("\nWEEKLY FOCUS (next 7 days):");
    if (wf.closings.length > 0)
      lines.push(`• Closing: ${wf.closings.map((d) => `${d.title} in ${d.daysUntilClose}d`).join(", ")}`);
    if (wf.tasks.length > 0)
      lines.push(`• Tasks due: ${wf.tasks.map((t) => t.title).join(", ")}`);
    if (wf.meetings.length > 0)
      lines.push(`• Meetings: ${wf.meetings.map((m) => m.title).join(", ")}`);
  }

  // Pipeline momentum
  const pm = derived.pipelineMomentum;
  if (pm.wonCount + pm.lostCount > 0) {
    lines.push("\nPIPELINE MOMENTUM (last 30 days):");
    if (pm.wonCount > 0) lines.push(`• Won: ${pm.wonCount} deal${pm.wonCount !== 1 ? "s" : ""} — ${fmt(pm.wonValue)}`);
    if (pm.lostCount > 0) lines.push(`• Lost: ${pm.lostCount} deal${pm.lostCount !== 1 ? "s" : ""} — ${fmt(pm.lostValue)}`);
    lines.push(`• Win rate: ${pm.winRate}%`);
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
    ctx.activity.slice(0, 4).forEach((a) => lines.push(`• ${a.description}`));
  }

  return lines.join("\n");
}
