import type { Company } from "@/types/company";
import type { Contact } from "@/types/contact";
import type { Deal } from "@/types/deal";
import { MS_PER_DAY, STALE_COMPANY_DAYS, CLOSING_SOON_DAYS } from "./constants";

export type CompanyActionType =
  | "closing_deal"
  | "stale_relationship"
  | "no_contacts"
  | "no_active_deals"
  | "incomplete_profile";

export type CompanyDecisionResult = {
  action: CompanyActionType;
  actionKey: string;
  reasonKey: string;
  reasonParams?: Record<string, string | number>;
  closingDeal?: Deal;
  primaryContact?: Contact;
};

function isOpenDeal(deal: Deal): boolean {
  return deal.stage !== "won" && deal.stage !== "lost";
}

export function resolveCompanyDecision(
  company: Company,
  contacts: Contact[],
  deals: Deal[],
): CompanyDecisionResult | null {
  const now = Date.now();

  const openDeals = deals.filter(isOpenDeal);

  // 1. Closing deal — open deal closes within CLOSING_SOON_DAYS
  const closingSoon = openDeals
    .filter((d) => {
      if (!d.expected_close_date) return false;
      const daysLeft = Math.floor(
        (new Date(d.expected_close_date).getTime() - now) / MS_PER_DAY,
      );
      return daysLeft >= 0 && daysLeft <= CLOSING_SOON_DAYS;
    })
    .sort((a, b) => {
      const aTime = new Date(a.expected_close_date!).getTime();
      const bTime = new Date(b.expected_close_date!).getTime();
      return aTime - bTime;
    })[0];

  if (closingSoon) {
    const daysLeft = Math.floor(
      (new Date(closingSoon.expected_close_date!).getTime() - now) / MS_PER_DAY,
    );
    return {
      action: "closing_deal",
      actionKey: "decisionActionClosingDeal",
      reasonKey: "decisionReasonClosingDeal",
      reasonParams: { deal: closingSoon.title, days: daysLeft },
      closingDeal: closingSoon,
      primaryContact: contacts[0],
    };
  }

  // 2. Stale relationship — no activity in more than STALE_COMPANY_DAYS
  const daysSinceActivity = company.last_activity_at
    ? Math.floor((now - new Date(company.last_activity_at).getTime()) / MS_PER_DAY)
    : null;

  if (daysSinceActivity === null || daysSinceActivity > STALE_COMPANY_DAYS) {
    return {
      action: "stale_relationship",
      actionKey: "decisionActionStaleRelationship",
      reasonKey: daysSinceActivity !== null
        ? "decisionReasonStaleRelationship"
        : "decisionReasonStaleRelationshipNoHistory",
      reasonParams: daysSinceActivity !== null ? { days: daysSinceActivity } : undefined,
      primaryContact: contacts[0],
    };
  }

  // 3. No contacts
  if (contacts.length === 0) {
    return {
      action: "no_contacts",
      actionKey: "decisionActionNoContacts",
      reasonKey: "decisionReasonNoContacts",
    };
  }

  // 4. No active deals (but has contacts)
  if (openDeals.length === 0) {
    return {
      action: "no_active_deals",
      actionKey: "decisionActionNoActiveDeals",
      reasonKey: "decisionReasonNoActiveDeals",
      primaryContact: contacts[0],
    };
  }

  // 5. Incomplete profile — missing industry
  if (!company.industry) {
    return {
      action: "incomplete_profile",
      actionKey: "decisionActionIncompleteProfile",
      reasonKey: "decisionReasonIncompleteProfile",
    };
  }

  // Healthy state
  return null;
}
