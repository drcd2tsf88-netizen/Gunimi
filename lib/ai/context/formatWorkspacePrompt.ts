import type { WorkspaceAIContext } from "@/server/actions/ai/getWorkspaceContext";

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

  const lines: string[] = [
    `ORBIT WORKSPACE CONTEXT`,
    `Workspace: ${ctx.workspaceName}`,
    `Today: ${dateStr}`,
    ``,
    `OVERVIEW`,
    `Companies: ${ctx.analytics.companies} | Open Deals: ${ctx.analytics.openDeals} | Open Tasks: ${ctx.analytics.openTasks} | Members: ${ctx.analytics.members}`,
  ];

  if (ctx.deals.length > 0) {
    lines.push(``, `OPEN PIPELINE (${ctx.deals.length} deals)`);
    ctx.deals.slice(0, 8).forEach((d) => {
      const val = d.value != null ? `$${d.value.toLocaleString()}` : "no value";
      const co = d.company ? ` @ ${d.company}` : "";
      const stale = d.daysSinceUpdated > 7 ? ` ⚠ ${d.daysSinceUpdated}d stale` : "";
      lines.push(`• ${d.title}${co} — ${d.stage} — ${val}${stale}`);
    });
  }

  if (stalledDeals.length > 0) {
    lines.push(``, `⚠ STALLED DEALS (no update >7 days): ${stalledDeals.map((d) => d.title).join(", ")}`);
  }

  if (overdueTasks.length > 0) {
    lines.push(``, `OVERDUE TASKS (${overdueTasks.length})`);
    overdueTasks.slice(0, 8).forEach((t) => {
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title} — OVERDUE`);
    });
  }

  if (upcomingTasks.length > 0) {
    lines.push(``, `UPCOMING TASKS (${upcomingTasks.length})`);
    upcomingTasks.slice(0, 5).forEach((t) => {
      const due = t.dueDate
        ? ` — due ${new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
        : "";
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title}${due}`);
    });
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
- Be direct and specific — reference actual deal names, task titles, contact names from the data above
- When asked "what needs attention", prioritize: overdue tasks first, then stalled deals, then unread emails
- Use bullet points for lists; prose for analysis
- Keep responses concise — max 3-4 paragraphs unless detail is explicitly requested
- If the user asks about something not in the data, say so rather than inventing information`;
}
