import type { Contact } from "@/types/contact";
import type { ContactTask } from "@/server/actions/crm/getContactTasks";
import type { Deal } from "@/types/deal";
import { MS_PER_DAY } from "@/lib/workspace/constants";
import { STALE_RELATIONSHIP_DAYS, NEW_RELATIONSHIP_DAYS } from "./constants";

export type ContactActionType =
  | "overdue_tasks"
  | "follow_up"
  | "deal_attention"
  | "link_company"
  | "initiate_relationship"
  | "add_contact_info";

export type ContactDecisionResult = {
  action: ContactActionType;
  actionKey: string;
  reasonKey: string;
  reasonParams?: Record<string, string | number>;
};

export function resolveContactDecision(
  contact: Contact,
  tasks: ContactTask[],
  deals: Deal[],
): ContactDecisionResult | null {
  const now = Date.now();

  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== "done" &&
      task.due_date &&
      new Date(task.due_date).getTime() < now,
  );

  if (overdueTasks.length > 0) {
    return {
      action: "overdue_tasks",
      actionKey: "decisionActionOverdueTasks",
      reasonKey: "decisionReasonOverdueTasks",
      reasonParams: { count: overdueTasks.length },
    };
  }

  const daysSinceContact = contact.last_contacted_at
    ? Math.floor(
        (now - new Date(contact.last_contacted_at).getTime()) / MS_PER_DAY,
      )
    : null;

  if (daysSinceContact !== null && daysSinceContact > STALE_RELATIONSHIP_DAYS) {
    return {
      action: "follow_up",
      actionKey: "decisionActionFollowUp",
      reasonKey: "decisionReasonFollowUp",
      reasonParams: {
        days: daysSinceContact,
        name: contact.name.split(" ")[0] ?? contact.name,
      },
    };
  }

  const openDeals = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const closingSoon = openDeals.find((d) => {
    if (!d.expected_close_date) return false;
    const daysUntilClose = Math.floor(
      (new Date(d.expected_close_date).getTime() - now) / MS_PER_DAY,
    );
    return daysUntilClose >= 0 && daysUntilClose <= 7;
  });

  if (closingSoon) {
    return {
      action: "deal_attention",
      actionKey: "decisionActionDealAttention",
      reasonKey: "decisionReasonDealAttention",
      reasonParams: { title: closingSoon.title },
    };
  }

  if (!contact.company_id) {
    return {
      action: "link_company",
      actionKey: "decisionActionLinkCompany",
      reasonKey: "decisionReasonLinkCompany",
    };
  }

  const daysSinceCreated = contact.created_at
    ? Math.floor((now - new Date(contact.created_at).getTime()) / MS_PER_DAY)
    : null;

  if (
    !contact.last_contacted_at &&
    daysSinceCreated !== null &&
    daysSinceCreated <= NEW_RELATIONSHIP_DAYS
  ) {
    return {
      action: "initiate_relationship",
      actionKey: "decisionActionInitiate",
      reasonKey: "decisionReasonInitiate",
    };
  }

  if (!contact.email && !contact.phone) {
    return {
      action: "add_contact_info",
      actionKey: "decisionActionAddContactInfo",
      reasonKey: "decisionReasonAddContactInfo",
    };
  }

  return null;
}
