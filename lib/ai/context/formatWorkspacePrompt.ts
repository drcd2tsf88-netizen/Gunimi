import type { WorkspaceAIContext } from "@/server/actions/ai/getWorkspaceContext";

function fmt(value: number): string {
  return `$${value.toLocaleString()}`;
}

export function formatWorkspacePrompt(ctx: WorkspaceAIContext): string {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const overdueTasks = ctx.tasks.filter((t) => t.isOverdue);
  const upcomingTasks = ctx.tasks.filter((t) => !t.isOverdue && t.dueDate);
  const stalledDeals = ctx.deals.filter((d) => d.daysSinceUpdated > 7);
  const unreadEmails = ctx.emails.filter((e) => e.unread);
  const { derived } = ctx;

  const lines: string[] = [
    `ORBIT WORKSPACE CONTEXT`,
    `Workspace: ${ctx.workspaceName}`,
    `Today: ${dateStr}`,
    ``,
    `OVERVIEW`,
    `Companies: ${ctx.analytics.companies} | Open Deals: ${ctx.analytics.openDeals} | Open Tasks: ${ctx.analytics.openTasks} | Members: ${ctx.analytics.members}`,
  ];

  // Revenue intelligence block — highest signal, shown first
  const hasRevenueSignals =
    derived.revenueAtRisk > 0 ||
    derived.pastDueRevenue > 0 ||
    derived.upcomingRevenue > 0 ||
    derived.upcomingClosings.length > 0 ||
    derived.neglectedContacts.length > 0 ||
    derived.neverContactedContacts.length > 0;

  if (hasRevenueSignals) {
    lines.push(``, `REVENUE INTELLIGENCE`);
    if (derived.revenueAtRisk > 0) {
      lines.push(
        `• Revenue at risk: ${fmt(derived.revenueAtRisk)} across ${derived.stalledDealsCount} stalled deal${derived.stalledDealsCount !== 1 ? "s" : ""} (no activity >7 days)`
      );
    }
    if (derived.pastDueRevenue > 0) {
      lines.push(
        `• Past-due revenue: ${fmt(derived.pastDueRevenue)} in ${derived.pastDueDeals.length} deal${derived.pastDueDeals.length !== 1 ? "s" : ""} past expected close date`
      );
    }
    if (derived.upcomingRevenue > 0) {
      lines.push(
        `• Expected close revenue (weighted): ${fmt(derived.upcomingRevenue)} across ${derived.upcomingClosings.length} deal${derived.upcomingClosings.length !== 1 ? "s" : ""} closing within 14 days`
      );
    }
    if (derived.neglectedContacts.length > 0) {
      lines.push(
        `• ${derived.neglectedContacts.length} contact${derived.neglectedContacts.length !== 1 ? "s" : ""} not reached in >14 days`
      );
    }
    if (derived.neverContactedContacts.length > 0) {
      lines.push(
        `• ${derived.neverContactedContacts.length} lead${derived.neverContactedContacts.length !== 1 ? "s" : ""} have never been contacted`
      );
    }
  }

  // Pipeline momentum (last 30 days)
  const { pipelineMomentum: pm } = derived;
  if (pm.wonCount > 0 || pm.lostCount > 0) {
    lines.push(``, `PIPELINE MOMENTUM (last 30 days)`);
    if (pm.wonCount > 0) lines.push(`• Won: ${pm.wonCount} deal${pm.wonCount !== 1 ? "s" : ""} — ${fmt(pm.wonValue)}`);
    if (pm.lostCount > 0) lines.push(`• Lost: ${pm.lostCount} deal${pm.lostCount !== 1 ? "s" : ""} — ${fmt(pm.lostValue)}`);
    if (pm.wonCount + pm.lostCount > 0) lines.push(`• Win rate: ${pm.winRate}%`);
  }

  // Open pipeline with health scores
  if (ctx.deals.length > 0) {
    lines.push(``, `OPEN PIPELINE (${ctx.deals.length} deals)`);
    ctx.deals.slice(0, 8).forEach((d) => {
      const val = d.value != null ? fmt(d.value) : "no value";
      const co = d.company ? ` @ ${d.company}` : "";
      const contact = d.contactName ? ` | contact: ${d.contactName}` : "";
      const prob = d.probability != null ? ` | ${d.probability}%` : "";
      const close =
        d.daysUntilClose != null && d.daysUntilClose >= 0
          ? ` | closes in ${d.daysUntilClose}d`
          : d.daysUntilClose != null
            ? ` | ⚠ PAST close date`
            : "";
      const health = ` | health: ${d.healthScore} ${d.healthLabel}`;
      const stale = d.daysSinceUpdated > 7 ? ` ⚠ ${d.daysSinceUpdated}d stale` : "";
      lines.push(`• ${d.title}${co} — ${d.stage} — ${val}${prob}${close}${health}${contact}${stale}`);
    });
  }

  if (stalledDeals.length > 0) {
    lines.push(
      ``,
      `⚠ STALLED DEALS: ${stalledDeals.map((d) => d.title).join(", ")}`
    );
  }

  if (derived.pastDueDeals.length > 0) {
    lines.push(``, `⚠ PAST DUE CLOSE DATES`);
    derived.pastDueDeals.forEach((d) => {
      const co = d.company ? ` @ ${d.company}` : "";
      const val = d.value != null ? ` — ${fmt(d.value)}` : "";
      lines.push(`• ${d.title}${co} — ${d.daysPastDue} days past expected close${val}`);
    });
  }

  if (derived.upcomingClosings.length > 0) {
    lines.push(``, `UPCOMING CLOSINGS (next 14 days)`);
    derived.upcomingClosings.forEach((d) => {
      const val = d.value != null ? ` — ${fmt(d.value)}` : "";
      const prob = d.probability != null ? ` — ${d.probability}% probability` : "";
      const co = d.company ? ` @ ${d.company}` : "";
      lines.push(
        `• ${d.title}${co} — closes in ${d.daysUntilClose} day${d.daysUntilClose !== 1 ? "s" : ""}${val}${prob}`
      );
    });
  }

  if (derived.neglectedContacts.length > 0) {
    lines.push(``, `NEGLECTED CONTACTS (last contact >14 days ago)`);
    derived.neglectedContacts.forEach((c) => {
      const co = c.company ? ` @ ${c.company}` : "";
      const status = c.status ? ` [${c.status}]` : "";
      lines.push(`• ${c.name}${status}${co} — ${c.daysSinceContacted} days since last contact`);
    });
  }

  if (derived.neverContactedContacts.length > 0) {
    lines.push(``, `NEVER-CONTACTED LEADS (added >7 days ago, no outreach)`);
    derived.neverContactedContacts.forEach((c) => {
      const co = c.company ? ` @ ${c.company}` : "";
      lines.push(`• ${c.name}${co} — ${c.ageInDays} days since added`);
    });
  }

  if (overdueTasks.length > 0) {
    lines.push(``, `OVERDUE TASKS (${overdueTasks.length})`);
    overdueTasks.slice(0, 8).forEach((t) => {
      const owner = t.assigneeName ? ` | owner: ${t.assigneeName}` : "";
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title} — OVERDUE${owner}`);
    });
  }

  if (upcomingTasks.length > 0) {
    lines.push(``, `UPCOMING TASKS (${upcomingTasks.length})`);
    upcomingTasks.slice(0, 5).forEach((t) => {
      const due = t.dueDate
        ? ` — due ${new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        : "";
      const owner = t.assigneeName ? ` | owner: ${t.assigneeName}` : "";
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title}${due}${owner}`);
    });
  }

  // Weekly focus summary
  const wf = derived.weeklyFocus;
  if (wf.tasks.length > 0 || wf.meetings.length > 0 || wf.closings.length > 0) {
    lines.push(``, `WEEKLY FOCUS (next 7 days)`);
    if (wf.tasks.length > 0)
      lines.push(`• Tasks due: ${wf.tasks.map((t) => t.title).join(", ")}`);
    if (wf.meetings.length > 0)
      lines.push(`• Meetings: ${wf.meetings.map((m) => m.title).join(", ")}`);
    if (wf.closings.length > 0)
      lines.push(`• Closings: ${wf.closings.map((d) => `${d.title} (${d.daysUntilClose}d)`).join(", ")}`);
  }

  if (ctx.meetings.length > 0) {
    lines.push(``, `UPCOMING MEETINGS`);
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

  if (unreadEmails.length > 0) {
    lines.push(``, `UNREAD EMAILS (${unreadEmails.length})`);
    unreadEmails.forEach((e) => {
      const from = e.contact ? ` from ${e.contact}` : "";
      lines.push(`• ${e.subject}${from}`);
    });
  }

  if (ctx.activity.length > 0) {
    lines.push(``, `RECENT ACTIVITY`);
    ctx.activity.slice(0, 6).forEach((a) => {
      lines.push(`• ${a.description}`);
    });
  }

  if (ctx.memory.length > 0) {
    lines.push(``, `WORKSPACE KNOWLEDGE`);
    ctx.memory.forEach((m) => {
      lines.push(`• ${m}`);
    });
  }

  return lines.join("\n");
}

export function buildChatSystemPrompt(ctx: WorkspaceAIContext): string {
  const contextBlock = formatWorkspacePrompt(ctx);

  return `You are Orbit AI, the intelligent workspace assistant for ${ctx.workspaceName}.

You have live access to this workspace's current data. Answer every question with specific, actionable insights grounded in actual workspace data — never generic responses.

${contextBlock}

RESPONSE GUIDELINES:
- Reference actual names, values and dates from the data — never generic statements
- "What needs attention": prioritize overdue tasks → past-due close dates → stalled deals → neglected contacts
- "Revenue at risk": quote the exact figure from REVENUE INTELLIGENCE section
- "Which clients need follow-up": use NEGLECTED CONTACTS and NEVER-CONTACTED LEADS sections
- "Closing soon": use UPCOMING CLOSINGS with probability and value
- "This week": use WEEKLY FOCUS section for a direct answer
- "Pipeline performance": use PIPELINE MOMENTUM win rate and values
- "Deal health": use health scores from OPEN PIPELINE — Healthy=70+, Warning=40-69, At Risk=<40
- Use bullet points for lists; prose for analysis
- Max 3-4 paragraphs unless explicitly asked for more
- If data is not present in context, say so — never invent information`;
}
