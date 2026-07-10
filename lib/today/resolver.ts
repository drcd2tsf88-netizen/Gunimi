import { MS_PER_DAY } from "@/lib/workspace/constants";
import type {
  TodayRawDeal,
  TodayRawContact,
  TodayRawTask,
  TodayFocus,
  TodayAttentionItem,
  TodayRelationshipItem,
  TodayWorkItem,
  TodayHealth,
  ResolvedTodayData,
} from "./types";

// Thresholds
const ACTIVE_STAGES = new Set(["lead", "qualified", "proposal", "negotiation"]);
const STALE_DEAL_DAYS = 14;
const STALE_CONTACT_DEAL_DAYS = 21;
const STALE_CONTACT_GENERAL_DAYS = 45;
const CLOSING_SOON_DAYS = 7;
const MAX_ATTENTION = 5;
const MAX_RELATIONSHIPS = 5;
const MAX_WORK = 8;

// Internal signal shape — resolved before splitting into Focus/Attention
type Tier1Signal = {
  id: string; // "deal:{id}" | "contact:{id}" | "task:{id}"
  urgency: number; // higher = more urgent
  focusActionKey: string;
  focusActionParams?: Record<string, string | number>;
  focusReasonKey: string;
  focusReasonParams?: Record<string, string | number>;
  attentionLabelKey: string;
  attentionLabelParams?: Record<string, string | number>;
  attentionUrgency: "critical" | "warning";
  href: string;
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

function buildTodayStr(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function daysFromTodayToDate(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);
}

function daysAgoFromDate(dateStr: string): number {
  return -daysFromTodayToDate(dateStr);
}

// ─── Tier 1 signal collection ─────────────────────────────────────────────────

function collectTier1Signals(
  deals: TodayRawDeal[],
  contacts: TodayRawContact[],
  tasks: TodayRawTask[],
): Tier1Signal[] {
  const today = buildTodayStr();
  const now = new Date().getTime();
  const signals: Tier1Signal[] = [];

  const contactMap = new Map(contacts.map((c) => [c.id, c]));

  for (const deal of deals) {
    if (!ACTIVE_STAGES.has(deal.stage)) continue;

    const dealId = `deal:${deal.id}`;
    const href = `/dashboard/deals/${deal.id}`;

    // 1. Deal past expected close date — most urgent
    if (deal.expected_close_date && deal.expected_close_date < today) {
      const days = daysAgoFromDate(deal.expected_close_date);
      signals.push({
        id: dealId,
        urgency: 100 + days,
        focusActionKey: "today.focusDealPastCloseAction",
        focusActionParams: { title: deal.title, days },
        focusReasonKey: "today.focusDealPastCloseReason",
        attentionLabelKey: "today.attentionDealPastClose",
        attentionLabelParams: { title: deal.title, days },
        attentionUrgency: "critical",
        href,
      });
      continue;
    }

    // 2. Deal closing within 7 days
    if (deal.expected_close_date) {
      const remaining = daysFromTodayToDate(deal.expected_close_date);
      if (remaining >= 0 && remaining <= CLOSING_SOON_DAYS) {
        signals.push({
          id: dealId,
          urgency: 90 - remaining,
          focusActionKey: "today.focusDealClosingAction",
          focusActionParams: { title: deal.title, days: remaining },
          focusReasonKey: "today.focusDealClosingReason",
          attentionLabelKey: "today.attentionDealClosingSoon",
          attentionLabelParams: { title: deal.title, days: remaining },
          attentionUrgency: "warning",
          href,
        });
        continue;
      }
    }

    // 3. Stale deal — no update in 14+ days
    if (deal.updated_at) {
      const updatedMs = new Date(deal.updated_at).getTime();
      const daysSince = Math.floor((now - updatedMs) / MS_PER_DAY);
      if (daysSince >= STALE_DEAL_DAYS) {
        signals.push({
          id: dealId,
          urgency: 50,
          focusActionKey: "today.focusDealStaleAction",
          focusActionParams: { title: deal.title, days: daysSince },
          focusReasonKey: "today.focusDealStaleReason",
          attentionLabelKey: "today.attentionDealStale",
          attentionLabelParams: { title: deal.title, days: daysSince },
          attentionUrgency: "warning",
          href,
        });
      }
    }

    // 4. Stale contact linked to an active deal
    if (deal.contact?.id) {
      const contact = contactMap.get(deal.contact.id);
      if (contact?.last_contacted_at) {
        const days = daysAgoFromDate(contact.last_contacted_at);
        if (days >= STALE_CONTACT_DEAL_DAYS) {
          signals.push({
            id: `contact:${contact.id}`,
            urgency: 40,
            focusActionKey: "today.focusContactStaleAction",
            focusActionParams: { name: contact.name, days },
            focusReasonKey: "today.focusContactStaleReason",
            focusReasonParams: { deal: deal.title, days },
            attentionLabelKey: "today.attentionContactStale",
            attentionLabelParams: { name: contact.name, days },
            attentionUrgency: "warning",
            href: `/dashboard/contacts/${contact.id}`,
          });
        }
      }
    }
  }

  // 5. Overdue tasks
  for (const task of tasks) {
    if (task.status === "done") continue;
    const due = task.due_date?.split("T")[0];
    if (!due || due >= today) continue;

    const days = daysAgoFromDate(due);
    signals.push({
      id: `task:${task.id}`,
      urgency: 30 + days,
      focusActionKey: "today.focusTaskOverdueAction",
      focusActionParams: { title: task.title, days },
      focusReasonKey: "today.focusTaskOverdueReason",
      focusReasonParams: { days },
      attentionLabelKey: "today.attentionTaskOverdue",
      attentionLabelParams: { title: task.title, days },
      attentionUrgency: "warning",
      href: "/dashboard/tasks",
    });
  }

  return signals.sort((a, b) => b.urgency - a.urgency);
}

// ─── Public resolver ──────────────────────────────────────────────────────────

export function resolveTodayData(
  deals: TodayRawDeal[],
  contacts: TodayRawContact[],
  tasks: TodayRawTask[],
): ResolvedTodayData {
  const today = buildTodayStr();
  const signals = collectTier1Signals(deals, contacts, tasks);

  // Focus: highest-urgency signal
  const focusSignal = signals[0] ?? null;
  const focus: TodayFocus = focusSignal
    ? {
        actionKey: focusSignal.focusActionKey,
        actionParams: focusSignal.focusActionParams,
        reasonKey: focusSignal.focusReasonKey,
        reasonParams: focusSignal.focusReasonParams,
        href: focusSignal.href,
      }
    : null;

  // Attention: next signals after Focus (max 5)
  const attention: TodayAttentionItem[] = signals.slice(1, 1 + MAX_ATTENTION).map((s) => ({
    id: s.id,
    labelKey: s.attentionLabelKey,
    labelParams: s.attentionLabelParams,
    href: s.href,
    urgency: s.attentionUrgency,
  }));

  // Contacts already surfaced in Tier 1 signals (to avoid duplicates in Relationships)
  const tier1ContactIds = new Set<string>();
  for (const s of signals) {
    if (s.id.startsWith("contact:")) {
      tier1ContactIds.add(s.id.slice("contact:".length));
    }
    // Also exclude contacts linked to deals already in Tier 1
  }
  for (const deal of deals) {
    if (signals.some((s) => s.id === `deal:${deal.id}`) && deal.contact?.id) {
      tier1ContactIds.add(deal.contact.id);
    }
  }

  // Relationships: stale contacts not already in Tier 1
  const relationships: TodayRelationshipItem[] = [];
  for (const contact of contacts) {
    if (tier1ContactIds.has(contact.id)) continue;
    if (!contact.last_contacted_at) {
      relationships.push({
        id: contact.id,
        name: contact.name,
        labelKey: "today.relationshipNeverContacted",
        href: `/dashboard/contacts/${contact.id}`,
      });
    } else {
      const days = daysAgoFromDate(contact.last_contacted_at);
      if (days >= STALE_CONTACT_GENERAL_DAYS) {
        relationships.push({
          id: contact.id,
          name: contact.name,
          labelKey: "today.relationshipStale",
          labelParams: { days },
          href: `/dashboard/contacts/${contact.id}`,
        });
      }
    }
    if (relationships.length >= MAX_RELATIONSHIPS) break;
  }

  // Work: tasks due today or overdue
  const work: TodayWorkItem[] = [];
  for (const task of tasks) {
    if (task.status === "done") continue;
    const due = task.due_date?.split("T")[0];
    if (!due) continue;
    if (due < today) {
      work.push({ id: task.id, title: task.title, tag: "overdue" });
    } else if (due === today) {
      work.push({ id: task.id, title: task.title, tag: "today" });
    }
    if (work.length >= MAX_WORK) break;
  }
  // overdue first, then today's
  work.sort((a, b) => {
    if (a.tag === b.tag) return 0;
    return a.tag === "overdue" ? -1 : 1;
  });

  // Health: derived from signal count and criticality
  const hasCritical = signals.some((s) => s.attentionUrgency === "critical");
  const health: TodayHealth =
    signals.length === 0
      ? { level: "healthy", labelKey: "today.healthHealthy" }
      : hasCritical || signals.length >= 3
        ? { level: "urgent", labelKey: "today.healthUrgent" }
        : {
            level: "attention",
            labelKey: "today.healthAttention",
            labelParams: { count: signals.length },
          };

  return { health, focus, attention, relationships, work };
}
