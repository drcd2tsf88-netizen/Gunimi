import type { Contact } from "@/types/contact";
import type { ContactTask } from "@/server/actions/crm/getContactTasks";
import type { ContactNote } from "@/server/actions/crm/getContactNotes";
import type { Deal } from "@/types/deal";
import type { ContactDecisionResult } from "./decision";
import { MS_PER_DAY } from "@/lib/workspace/constants";

export type ContactPrepItem = {
  iconKey: "company" | "activity" | "task" | "note" | "deal";
  labelKey: string;
  value: string;
  href?: string;
  secondaryRaw?: string;
  secondaryKey?: string;
  secondaryParams?: Record<string, string | number>;
};

export function resolveContactPreparation(
  contact: Contact,
  decision: ContactDecisionResult | null,
  tasks: ContactTask[],
  notes: ContactNote[],
  deals: Deal[],
): ContactPrepItem[] {
  if (!decision) return [];

  const now = Date.now();
  const items: ContactPrepItem[] = [];

  switch (decision.action) {
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

    case "follow_up": {
      if (contact.company_name) {
        items.push({
          iconKey: "company",
          labelKey: "prepItemCompany",
          value: contact.company_name,
          href: contact.company_id
            ? `/dashboard/companies/${contact.company_id}`
            : undefined,
        });
      }
      if (contact.last_contacted_at) {
        const daysAgo = Math.floor(
          (now - new Date(contact.last_contacted_at).getTime()) / MS_PER_DAY,
        );
        items.push({
          iconKey: "activity",
          labelKey: "prepItemLastContact",
          value: new Date(contact.last_contacted_at).toLocaleDateString(
            undefined,
            { month: "short", day: "numeric", year: "numeric" },
          ),
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
      const openDeals = deals.filter(
        (d) => d.stage !== "won" && d.stage !== "lost",
      );
      if (openDeals.length > 0) {
        items.push({
          iconKey: "deal",
          labelKey: "prepItemDeal",
          value: openDeals[0].title,
          href: `/dashboard/deals/${openDeals[0].id}`,
        });
      }
      break;
    }

    case "deal_attention": {
      const openDeals = deals
        .filter((d) => d.stage !== "won" && d.stage !== "lost")
        .slice(0, 2);
      for (const deal of openDeals) {
        items.push({
          iconKey: "deal",
          labelKey: "prepItemDeal",
          value: deal.title,
          href: `/dashboard/deals/${deal.id}`,
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

    case "link_company": {
      if (contact.position) {
        items.push({
          iconKey: "company",
          labelKey: "position",
          value: contact.position,
        });
      }
      if (contact.email) {
        items.push({
          iconKey: "activity",
          labelKey: "email",
          value: contact.email,
        });
      }
      break;
    }

    case "initiate_relationship": {
      if (contact.email) {
        items.push({
          iconKey: "activity",
          labelKey: "email",
          value: contact.email,
        });
      }
      if (contact.phone) {
        items.push({
          iconKey: "activity",
          labelKey: "phone",
          value: contact.phone,
        });
      }
      if (contact.company_name) {
        items.push({
          iconKey: "company",
          labelKey: "prepItemCompany",
          value: contact.company_name,
          href: contact.company_id
            ? `/dashboard/companies/${contact.company_id}`
            : undefined,
        });
      }
      break;
    }

    case "add_contact_info": {
      if (contact.position) {
        items.push({
          iconKey: "company",
          labelKey: "position",
          value: contact.position,
        });
      }
      if (contact.company_name) {
        items.push({
          iconKey: "company",
          labelKey: "prepItemCompany",
          value: contact.company_name,
          href: contact.company_id
            ? `/dashboard/companies/${contact.company_id}`
            : undefined,
        });
      }
      break;
    }

    default:
      break;
  }

  return items.slice(0, 4);
}
