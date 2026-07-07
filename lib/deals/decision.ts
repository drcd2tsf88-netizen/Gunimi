import type { Deal } from "@/types/deal";
import type { DealRelatedTask } from "@/server/actions/deals/getDealRelatedTasks";
import { MS_PER_DAY, STALE_THRESHOLD_DAYS, LARGE_DEAL_THRESHOLD, LOW_PROBABILITY_THRESHOLD } from "./constants";

export type DealActionType =
  | "follow_up"
  | "prepare_close"
  | "update_close_date"
  | "set_close_date"
  | "overdue_tasks"
  | "review_qualification"
  | "link_company"
  | "link_contact"
  | "add_lost_reason";

export type DealDecisionResult = {
  action: DealActionType;
  actionKey: string;
  reasonKey: string;
  reasonParams?: Record<string, string | number>;
};

export function resolveDealDecision(
  deal: Deal,
  tasks: DealRelatedTask[],
): DealDecisionResult | null {
  const now = Date.now();

  if (deal.stage === "won") return null;

  if (deal.stage === "lost") {
    if (!deal.lost_reason) {
      return {
        action: "add_lost_reason",
        actionKey: "decisionActionAddLostReason",
        reasonKey: "decisionReasonAddLostReason",
      };
    }
    return null;
  }

  const daysUntilClose = deal.expected_close_date
    ? Math.floor((new Date(deal.expected_close_date).getTime() - now) / MS_PER_DAY)
    : null;

  if (daysUntilClose !== null && daysUntilClose < 0) {
    return {
      action: "update_close_date",
      actionKey: "decisionActionUpdateCloseDate",
      reasonKey: "decisionReasonUpdateCloseDate",
    };
  }

  if (daysUntilClose !== null && daysUntilClose <= 7) {
    return {
      action: "prepare_close",
      actionKey: "decisionActionPrepareClose",
      reasonKey: "decisionReasonPrepareClose",
      reasonParams: { days: daysUntilClose },
    };
  }

  const daysSinceUpdate = deal.updated_at
    ? Math.floor((now - new Date(deal.updated_at).getTime()) / MS_PER_DAY)
    : null;

  if (daysSinceUpdate !== null && daysSinceUpdate > STALE_THRESHOLD_DAYS) {
    return {
      action: "follow_up",
      actionKey: "decisionActionFollowUp",
      reasonKey: "decisionReasonFollowUp",
      reasonParams: { days: daysSinceUpdate },
    };
  }

  const overdueCount = tasks.filter(
    (task) =>
      task.status !== "done" &&
      task.due_date &&
      new Date(task.due_date).getTime() < now,
  ).length;

  if (overdueCount > 0) {
    return {
      action: "overdue_tasks",
      actionKey: "decisionActionOverdueTasks",
      reasonKey: "decisionReasonOverdueTasks",
      reasonParams: { count: overdueCount },
    };
  }

  if (!deal.expected_close_date) {
    return {
      action: "set_close_date",
      actionKey: "decisionActionSetCloseDate",
      reasonKey: "decisionReasonSetCloseDate",
    };
  }

  const value = Number(deal.value || 0);
  const probability = Number(deal.probability || 0);

  if (value >= LARGE_DEAL_THRESHOLD && probability < LOW_PROBABILITY_THRESHOLD) {
    return {
      action: "review_qualification",
      actionKey: "decisionActionReviewQualification",
      reasonKey: "decisionReasonReviewQualification",
    };
  }

  if (!deal.company) {
    return {
      action: "link_company",
      actionKey: "decisionActionLinkCompany",
      reasonKey: "decisionReasonLinkCompany",
    };
  }

  if (!deal.contact) {
    return {
      action: "link_contact",
      actionKey: "decisionActionLinkContact",
      reasonKey: "decisionReasonLinkContact",
    };
  }

  return null;
}
