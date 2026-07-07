import type { Deal } from "@/types/deal";
import type { DealRelatedTask } from "@/server/actions/deals/getDealRelatedTasks";
import type { DealRelatedNote } from "@/server/actions/deals/getDealRelatedNotes";
import type { WorkspaceActivity } from "@/types/activity";
import type { DealDecisionResult } from "./decision";
import { MS_PER_DAY } from "./constants";

export type PrepItem = {
  iconKey: "contact" | "activity" | "task" | "note";
  labelKey: string;
  value: string;
  href?: string;
  secondaryRaw?: string;
  secondaryKey?: string;
  secondaryParams?: Record<string, string | number>;
};

export function resolveDealPreparation(
  deal: Deal,
  tasks: DealRelatedTask[],
  activities: WorkspaceActivity[],
  notes: DealRelatedNote[],
  decision: DealDecisionResult | null,
): PrepItem[] {
  if (!decision) return [];

  const now = Date.now();
  const items: PrepItem[] = [];

  switch (decision.action) {
    case "follow_up": {
      if (deal.contact) {
        items.push({
          iconKey: "contact",
          labelKey: "prepItemContact",
          value: deal.contact.name,
          href: `/dashboard/crm/${deal.contact.id}`,
          secondaryRaw: deal.contact.email,
        });
      }
      if (activities.length > 0) {
        const latest = activities[0];
        const daysAgo = Math.floor(
          (now - new Date(latest.created_at).getTime()) / MS_PER_DAY,
        );
        items.push({
          iconKey: "activity",
          labelKey: "prepItemLastActivity",
          value: latest.title ?? latest.type ?? "—",
          secondaryKey: "prepDaysAgo",
          secondaryParams: { days: daysAgo },
        });
      }
      if (notes.length > 0) {
        items.push({
          iconKey: "note",
          labelKey: "prepItemNote",
          value: notes[0].title,
        });
      }
      break;
    }

    case "prepare_close": {
      if (deal.contact) {
        items.push({
          iconKey: "contact",
          labelKey: "prepItemContact",
          value: deal.contact.name,
          href: `/dashboard/crm/${deal.contact.id}`,
          secondaryRaw: deal.contact.email,
        });
      }
      const overdueTasks = tasks
        .filter(
          (task) =>
            task.status !== "done" &&
            task.due_date &&
            new Date(task.due_date).getTime() < now,
        )
        .slice(0, 2);
      for (const task of overdueTasks) {
        items.push({
          iconKey: "task",
          labelKey: "prepItemTask",
          value: task.title,
        });
      }
      break;
    }

    case "update_close_date": {
      if (deal.contact) {
        items.push({
          iconKey: "contact",
          labelKey: "prepItemContact",
          value: deal.contact.name,
          href: `/dashboard/crm/${deal.contact.id}`,
          secondaryRaw: deal.contact.email,
        });
      }
      break;
    }

    case "overdue_tasks": {
      const overdueTasks = tasks
        .filter(
          (task) =>
            task.status !== "done" &&
            task.due_date &&
            new Date(task.due_date).getTime() < now,
        )
        .slice(0, 3);
      for (const task of overdueTasks) {
        items.push({
          iconKey: "task",
          labelKey: "prepItemTask",
          value: task.title,
        });
      }
      break;
    }

    case "set_close_date": {
      if (deal.contact) {
        items.push({
          iconKey: "contact",
          labelKey: "prepItemContact",
          value: deal.contact.name,
          href: `/dashboard/crm/${deal.contact.id}`,
          secondaryRaw: deal.contact.email,
        });
      }
      break;
    }

    case "review_qualification": {
      if (deal.contact) {
        items.push({
          iconKey: "contact",
          labelKey: "prepItemContact",
          value: deal.contact.name,
          href: `/dashboard/crm/${deal.contact.id}`,
          secondaryRaw: deal.contact.email,
        });
      }
      if (activities.length > 0) {
        const latest = activities[0];
        const daysAgo = Math.floor(
          (now - new Date(latest.created_at).getTime()) / MS_PER_DAY,
        );
        items.push({
          iconKey: "activity",
          labelKey: "prepItemLastActivity",
          value: latest.title ?? latest.type ?? "—",
          secondaryKey: "prepDaysAgo",
          secondaryParams: { days: daysAgo },
        });
      }
      if (notes.length > 0) {
        items.push({
          iconKey: "note",
          labelKey: "prepItemNote",
          value: notes[0].title,
        });
      }
      break;
    }

    default:
      break;
  }

  return items.slice(0, 4);
}
