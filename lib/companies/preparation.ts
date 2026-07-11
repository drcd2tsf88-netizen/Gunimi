import type { WorkspaceActivity } from "@/types/activity";
import type { CompanyDecisionResult } from "./decision";
import { MS_PER_DAY } from "./constants";

export type CompanyPrepItem = {
  iconKey: "contact" | "activity" | "deal";
  labelKey: string;
  value: string;
  href?: string;
  secondaryRaw?: string;
  secondaryKey?: string;
  secondaryParams?: Record<string, string | number>;
};

export function resolveCompanyPreparation(
  activities: WorkspaceActivity[],
  decision: CompanyDecisionResult | null,
): CompanyPrepItem[] {
  if (!decision) return [];

  const now = Date.now();
  const items: CompanyPrepItem[] = [];

  switch (decision.action) {
    case "closing_deal": {
      if (decision.closingDeal) {
        items.push({
          iconKey: "deal",
          labelKey: "prepItemDeal",
          value: decision.closingDeal.title,
          href: `/dashboard/deals/${decision.closingDeal.id}`,
          secondaryRaw: decision.closingDeal.value
            ? `$${Number(decision.closingDeal.value).toLocaleString()}`
            : undefined,
        });
      }
      if (decision.primaryContact) {
        items.push({
          iconKey: "contact",
          labelKey: "prepItemContact",
          value: decision.primaryContact.name,
          href: `/dashboard/crm/${decision.primaryContact.id}`,
          secondaryRaw: decision.primaryContact.email ?? undefined,
        });
      }
      break;
    }

    case "stale_relationship": {
      if (decision.primaryContact) {
        items.push({
          iconKey: "contact",
          labelKey: "prepItemContact",
          value: decision.primaryContact.name,
          href: `/dashboard/crm/${decision.primaryContact.id}`,
          secondaryRaw: decision.primaryContact.email ?? undefined,
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
      break;
    }

    case "no_contacts":
    case "incomplete_profile":
      // No preparation needed — the action itself is the task
      break;

    case "no_active_deals": {
      if (decision.primaryContact) {
        items.push({
          iconKey: "contact",
          labelKey: "prepItemContact",
          value: decision.primaryContact.name,
          href: `/dashboard/crm/${decision.primaryContact.id}`,
          secondaryRaw: decision.primaryContact.email ?? undefined,
        });
      }
      break;
    }
  }

  return items.slice(0, 4);
}
