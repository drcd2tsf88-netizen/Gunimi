import { getAITasks } from "@/server/actions/ai/read/getAITasks";
import { getAIDeals } from "@/server/actions/ai/read/getAIDeals";
import { getAIContacts } from "@/server/actions/ai/read/getAIContacts";
import { getAICompanies } from "@/server/actions/ai/read/getAICompanies";
import { getAIMeetings } from "@/server/actions/ai/read/getAIMeetings";
import { getAINotes } from "@/server/actions/ai/read/getAINotes";
import { getAIActivity } from "@/server/actions/ai/read/getAIActivity";
import { getAIStats } from "@/server/actions/ai/read/getAIStats";

import type { AITask } from "@/server/actions/ai/read/getAITasks";
import type { AIDeal } from "@/server/actions/ai/read/getAIDeals";
import type { AIContact } from "@/server/actions/ai/read/getAIContacts";
import type { AICompany } from "@/server/actions/ai/read/getAICompanies";
import type { AIMeeting } from "@/server/actions/ai/read/getAIMeetings";
import type { AIActivity } from "@/server/actions/ai/read/getAIActivity";
import type { AIStats } from "@/server/actions/ai/read/getAIStats";

function fmt(value: number): string {
  return `$${value.toLocaleString()}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ─── Task Block ───────────────────────────────────────────────────────────────

function formatTaskBlock(tasks: AITask[]): string {
  if (tasks.length === 0) return "LIVE TASKS — No open tasks found.";

  const overdue = tasks.filter((t) => t.isOverdue);
  const dueToday = tasks.filter((t) => t.isDueToday && !t.isOverdue);
  const upcoming = tasks.filter((t) => !t.isOverdue && !t.isDueToday && t.dueDate);
  const noDue = tasks.filter((t) => !t.dueDate);

  const lines: string[] = [
    `LIVE TASKS — ${tasks.length} open | ${overdue.length} overdue | ${dueToday.length} due today`,
  ];

  if (overdue.length > 0) {
    lines.push("\nOVERDUE (action required):");
    for (const t of overdue) {
      const owner = t.assigneeName ? ` | ${t.assigneeName}` : "";
      const days = t.daysPastDue ? ` — ${t.daysPastDue}d overdue` : "";
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title}${days}${owner}`);
    }
  }

  if (dueToday.length > 0) {
    lines.push("\nDUE TODAY:");
    for (const t of dueToday) {
      const owner = t.assigneeName ? ` | ${t.assigneeName}` : "";
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title}${owner}`);
    }
  }

  if (upcoming.length > 0) {
    lines.push("\nUPCOMING:");
    for (const t of upcoming.slice(0, 10)) {
      const owner = t.assigneeName ? ` | ${t.assigneeName}` : "";
      const due = t.dueDate ? ` — due ${formatDate(t.dueDate)}` : "";
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title}${due}${owner}`);
    }
  }

  if (noDue.length > 0) {
    lines.push(`\nNO DUE DATE (${noDue.length} tasks):`);
    for (const t of noDue.slice(0, 5)) {
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title}`);
    }
    if (noDue.length > 5) lines.push(`  …and ${noDue.length - 5} more`);
  }

  return lines.join("\n");
}

// ─── Deal Block ───────────────────────────────────────────────────────────────

function formatDealBlock(deals: AIDeal[]): string {
  if (deals.length === 0) return "LIVE DEALS — No open deals found.";

  const pipelineValue = deals.reduce((s, d) => s + (d.value ?? 0), 0);
  const stale = deals.filter((d) => d.isStale);
  const pastDue = deals.filter((d) => d.daysPastDue != null);
  const closingSoon = deals.filter(
    (d) => d.daysUntilClose != null && d.daysUntilClose <= 14
  );

  const lines: string[] = [
    `LIVE DEALS — ${deals.length} open | pipeline: ${fmt(pipelineValue)}`,
  ];

  if (stale.length > 0) {
    lines.push("\nSTALE — NO ACTIVITY >7 DAYS (needs attention):");
    for (const d of stale) {
      const co = d.company ? ` @ ${d.company}` : "";
      const val = d.value != null ? ` — ${fmt(d.value)}` : "";
      lines.push(
        `• ${d.title}${co}${val} — ${d.stage} — ${d.daysSinceUpdated}d stale — health: ${d.healthScore} ${d.healthLabel}`
      );
    }
  }

  if (pastDue.length > 0) {
    lines.push("\nPAST EXPECTED CLOSE DATE:");
    for (const d of pastDue) {
      const co = d.company ? ` @ ${d.company}` : "";
      const val = d.value != null ? ` — ${fmt(d.value)}` : "";
      lines.push(
        `• ${d.title}${co}${val} — ${d.daysPastDue}d past expected close`
      );
    }
  }

  if (closingSoon.length > 0) {
    lines.push("\nCLOSING SOON (next 14 days):");
    for (const d of closingSoon) {
      const co = d.company ? ` @ ${d.company}` : "";
      const val = d.value != null ? ` — ${fmt(d.value)}` : "";
      const prob = d.probability != null ? ` — ${d.probability}% probability` : "";
      lines.push(
        `• ${d.title}${co}${val} — closes in ${d.daysUntilClose}d${prob}`
      );
    }
  }

  lines.push("\nALL OPEN DEALS:");
  for (const d of deals) {
    const co = d.company ? ` @ ${d.company}` : "";
    const val = d.value != null ? ` — ${fmt(d.value)}` : "";
    const contact = d.contactName ? ` | contact: ${d.contactName}` : "";
    const close =
      d.daysUntilClose != null
        ? ` | closes in ${d.daysUntilClose}d`
        : d.daysPastDue != null
          ? ` | ⚠ ${d.daysPastDue}d past due`
          : "";
    lines.push(
      `• ${d.title}${co} — ${d.stage}${val} — health: ${d.healthScore} ${d.healthLabel}${close}${contact}`
    );
  }

  return lines.join("\n");
}

// ─── Contact Block ────────────────────────────────────────────────────────────

function formatContactBlock(contacts: AIContact[], companies: AICompany[]): string {
  const neglected = contacts.filter((c) => c.isNeglected);
  const neverContacted = contacts.filter((c) => c.neverContacted);
  const active = contacts.filter((c) => !c.isNeglected && !c.neverContacted);

  const lines: string[] = [
    `LIVE CONTACTS — ${contacts.length} total | ${neglected.length} neglected | ${neverContacted.length} never contacted`,
  ];

  if (neglected.length > 0) {
    lines.push("\nNEGLECTED (>14 days since last contact):");
    for (const c of neglected.slice(0, 15)) {
      const co = c.company ? ` @ ${c.company}` : "";
      const status = c.status ? ` [${c.status}]` : "";
      lines.push(
        `• ${c.name}${status}${co} — ${c.daysSinceContacted}d since last contact`
      );
    }
    if (neglected.length > 15)
      lines.push(`  …and ${neglected.length - 15} more`);
  }

  if (neverContacted.length > 0) {
    lines.push("\nNEVER CONTACTED:");
    for (const c of neverContacted.slice(0, 10)) {
      const co = c.company ? ` @ ${c.company}` : "";
      lines.push(`• ${c.name}${co}`);
    }
    if (neverContacted.length > 10)
      lines.push(`  …and ${neverContacted.length - 10} more`);
  }

  if (active.length > 0) {
    lines.push(`\nACTIVE CONTACTS (${active.length}):`);
    for (const c of active.slice(0, 10)) {
      const co = c.company ? ` @ ${c.company}` : "";
      const last = c.daysSinceContacted != null
        ? ` — last contact: ${c.daysSinceContacted}d ago`
        : "";
      lines.push(`• ${c.name}${co}${last}`);
    }
    if (active.length > 10) lines.push(`  …and ${active.length - 10} more`);
  }

  if (companies.length > 0) {
    lines.push(`\nCOMPANIES (${companies.length}):`);
    const listed = companies
      .map((c) => (c.industry ? `${c.name} (${c.industry})` : c.name))
      .join(" | ");
    lines.push(`• ${listed}`);
  }

  return lines.join("\n");
}

// ─── Meeting Block ────────────────────────────────────────────────────────────

function formatMeetingBlock(meetings: AIMeeting[]): string {
  if (meetings.length === 0) return "LIVE CALENDAR — No upcoming meetings in the next 14 days.";

  const today = meetings.filter((m) => m.isToday);
  const upcoming = meetings.filter((m) => !m.isToday);

  const lines: string[] = [
    `LIVE CALENDAR — ${meetings.length} upcoming meetings`,
  ];

  if (today.length > 0) {
    lines.push("\nTODAY:");
    for (const m of today) {
      const loc = m.location ? ` @ ${m.location}` : "";
      const time = new Date(m.startAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      lines.push(`• ${m.title} — ${time}${loc}`);
    }
  }

  if (upcoming.length > 0) {
    lines.push("\nUPCOMING:");
    for (const m of upcoming) {
      const loc = m.location ? ` @ ${m.location}` : "";
      const organizer = m.organizerName ? ` | ${m.organizerName}` : "";
      lines.push(`• ${m.title} — ${formatDateTime(m.startAt)}${loc}${organizer}`);
    }
  }

  return lines.join("\n");
}

// ─── Activity Block ───────────────────────────────────────────────────────────

function formatActivityBlock(activity: AIActivity[]): string {
  if (activity.length === 0) return "LIVE ACTIVITY — No recent activity found.";

  const lines: string[] = [`LIVE ACTIVITY — Last ${activity.length} events:`];
  for (const a of activity) {
    const when = formatDate(a.createdAt);
    const title = a.title ? `${a.title}: ` : "";
    lines.push(`• [${when}] ${title}${a.description}`);
  }
  return lines.join("\n");
}

// ─── Stats Block ──────────────────────────────────────────────────────────────

function formatStatsBlock(stats: AIStats): string {
  const lines: string[] = [
    `LIVE WORKSPACE STATISTICS — ${stats.workspaceName}`,
    ``,
    `OVERVIEW:`,
    `• Companies: ${stats.totalCompanies} | Contacts: ${stats.totalContacts} | Open deals: ${stats.openDeals} | Open tasks: ${stats.openTasks} | Overdue tasks: ${stats.overdueTasks} | Members: ${stats.totalMembers}`,
    ``,
    `PIPELINE:`,
    `• Total pipeline value: ${fmt(stats.pipelineValue)}`,
    `• Stale deals (>7d no activity): ${stats.staleDeals} — ${fmt(stats.revenueAtRisk)} at risk`,
  ];

  if (stats.wonDealsLast30 + stats.lostDealsLast30 > 0) {
    lines.push(
      `• Won last 30 days: ${stats.wonDealsLast30} deals — ${fmt(stats.wonValueLast30)}`,
      `• Lost last 30 days: ${stats.lostDealsLast30} deals`,
      `• Win rate: ${stats.winRate}%`
    );
  }

  lines.push(
    ``,
    `DEAL HEALTH:`,
    `• Healthy (≥70): ${stats.healthyDeals} | Warning (40-69): ${stats.warningDeals} | At Risk (<40): ${stats.atRiskDeals}`,
    ``,
    `TASK STATUS:`,
    `• ${stats.openTasks} open | ${stats.overdueTasks} overdue${stats.openTasks > 0 ? ` (${Math.round((stats.overdueTasks / stats.openTasks) * 100)}%)` : ""}`
  );

  return lines.join("\n");
}

// ─── General Pulse Block ──────────────────────────────────────────────────────

function formatPulseBlock(
  tasks: AITask[],
  deals: AIDeal[],
  meetings: AIMeeting[]
): string {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const overdue = tasks.filter((t) => t.isOverdue);
  const dueToday = tasks.filter((t) => t.isDueToday);
  const todayMeetings = meetings.filter((m) => m.isToday);
  const staleDeals = deals.filter((d) => d.isStale || d.daysPastDue != null);

  const lines: string[] = [`LIVE WORKSPACE PULSE — ${today}`];

  if (overdue.length > 0 || dueToday.length > 0) {
    lines.push("\nTASKS REQUIRING ACTION:");
    for (const t of overdue.slice(0, 5)) {
      const days = t.daysPastDue ? ` — OVERDUE ${t.daysPastDue}d` : " — OVERDUE";
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title}${days}`);
    }
    for (const t of dueToday.slice(0, 3)) {
      lines.push(`• [${t.priority.toUpperCase()}] ${t.title} — DUE TODAY`);
    }
  } else if (tasks.length > 0) {
    const highPriority = tasks
      .filter((t) => t.priority === "high")
      .slice(0, 3);
    if (highPriority.length > 0) {
      lines.push("\nHIGH PRIORITY TASKS:");
      for (const t of highPriority) {
        const due = t.dueDate ? ` — due ${formatDate(t.dueDate)}` : "";
        lines.push(`• ${t.title}${due}`);
      }
    }
  }

  if (todayMeetings.length > 0) {
    lines.push("\nMEETINGS TODAY:");
    for (const m of todayMeetings) {
      const time = new Date(m.startAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      lines.push(`• ${m.title} — ${time}`);
    }
  } else if (meetings.length > 0) {
    lines.push("\nNEXT MEETING:");
    const next = meetings[0];
    lines.push(`• ${next.title} — ${formatDateTime(next.startAt)}`);
  }

  if (staleDeals.length > 0) {
    lines.push("\nDEALS NEEDING ATTENTION:");
    for (const d of staleDeals.slice(0, 5)) {
      const co = d.company ? ` @ ${d.company}` : "";
      const val = d.value != null ? ` — ${fmt(d.value)}` : "";
      const reason =
        d.daysPastDue != null
          ? `past close date ${d.daysPastDue}d ago`
          : `${d.daysSinceUpdated}d no activity`;
      lines.push(`• ${d.title}${co}${val} — ${reason}`);
    }
  }

  return lines.join("\n");
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export async function buildFocusedContext(
  agentName: string,
  message: string
): Promise<string | null> {
  const lower = message.toLowerCase();

  try {
    if (agentName === "Task Agent") {
      const tasks = await getAITasks();
      return formatTaskBlock(tasks);
    }

    if (agentName === "Deals Agent") {
      const deals = await getAIDeals();
      return formatDealBlock(deals);
    }

    if (agentName === "CRM Agent") {
      const [contacts, companies] = await Promise.all([
        getAIContacts(),
        getAICompanies(),
      ]);
      return formatContactBlock(contacts, companies);
    }

    if (agentName === "Calendar Agent") {
      const meetings = await getAIMeetings(14);
      return formatMeetingBlock(meetings);
    }

    if (agentName === "Email Agent") {
      // Email data already fully represented in baseline context
      return null;
    }

    if (agentName === "Analytics Agent") {
      const [stats, deals, tasks] = await Promise.all([
        getAIStats(),
        getAIDeals(),
        getAITasks(),
      ]);
      const blocks: string[] = [];
      if (stats) blocks.push(formatStatsBlock(stats));
      if (deals.length > 0) blocks.push(formatDealBlock(deals));
      if (tasks.length > 0) blocks.push(formatTaskBlock(tasks));
      return blocks.length > 0 ? blocks.join("\n\n") : null;
    }

    // Gunimi AI — general intent
    if (
      lower.includes("activity") ||
      lower.includes("happened") ||
      lower.includes("recent") ||
      lower.includes("yesterday") ||
      lower.includes("last week") ||
      lower.includes("history")
    ) {
      const since =
        lower.includes("yesterday") || lower.includes("last 24")
          ? new Date(Date.now() - 86_400_000).toISOString()
          : lower.includes("last week") || lower.includes("this week")
            ? new Date(Date.now() - 7 * 86_400_000).toISOString()
            : undefined;
      const activity = await getAIActivity(30, since);
      return formatActivityBlock(activity);
    }

    if (lower.includes("note") || lower.includes("notes")) {
      const notes = await getAINotes(15);
      if (notes.length === 0) return "LIVE NOTES — No notes found in workspace.";
      const lines = [`LIVE NOTES — ${notes.length} recent notes:`];
      for (const n of notes) {
        const title = n.title ? `**${n.title}** — ` : "";
        const when = formatDate(n.createdAt);
        const preview = n.content.slice(0, 200);
        lines.push(`• [${when}] ${title}${preview}${n.content.length > 200 ? "…" : ""}`);
      }
      return lines.join("\n");
    }

    // Default general query: workspace pulse
    const [tasks, deals, meetings] = await Promise.all([
      getAITasks(),
      getAIDeals(),
      getAIMeetings(7),
    ]);
    return formatPulseBlock(tasks, deals, meetings);
  } catch {
    return null;
  }
}
