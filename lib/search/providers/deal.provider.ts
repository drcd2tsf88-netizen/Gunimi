import { searchDeals } from "@/server/actions/search/searchDeals";
import type { DealRow } from "@/server/actions/search/searchDeals";

import { searchRegistry } from "@/lib/search/registry";
import type { EntityResult, SearchProvider, SearchQuery } from "@/lib/search/types";

// Title matches rank highest; customer name next; stage last.
function scoreDeal(
  title: string,
  stage: string,
  customerName: string | null,
  query: string
): number {
  const q = query.toLowerCase();
  const t = title.toLowerCase();

  if (t === q) return 1.0;
  if (t.startsWith(q)) return 0.9;
  if (t.split(" ").some((word) => word.startsWith(q))) return 0.8;
  if (t.includes(q)) return 0.7;

  if (customerName) {
    const cn = customerName.toLowerCase();
    if (cn === q) return 0.65;
    if (cn.startsWith(q)) return 0.6;
    if (cn.split(" ").some((word) => word.startsWith(q))) return 0.58;
    if (cn.includes(q)) return 0.55;
  }

  const s = stage.toLowerCase();
  if (s === q) return 0.5;
  if (s.startsWith(q)) return 0.45;
  if (s.includes(q)) return 0.4;

  return 0.35;
}

function mapDeal(deal: DealRow, query: string): EntityResult {
  return {
    kind: "entity",
    id: `deal:${deal.id}`,
    entityType: "deal",
    entityId: deal.id,
    href: `/dashboard/deals/${deal.id}`,
    title: deal.title,
    // Customer name provides deal context; stage shown when no contact is linked.
    description: deal.customer_name ?? deal.stage,
    category: "crm",
    score: scoreDeal(deal.title, deal.stage, deal.customer_name, query),
    priority: 25,
    metadata: { stage: deal.stage, value: deal.value },
  };
}

const dealSearchProvider: SearchProvider = {
  id: "workspace-deals",
  name: "Deals",
  priority: 25,

  async search({ query, limit = 20 }: SearchQuery): Promise<EntityResult[]> {
    if (!query.trim()) return [];

    const { deals } = await searchDeals(query);

    return deals
      .map((deal) => mapDeal(deal, query))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
};

// Auto-registers when this module is imported
searchRegistry.register(dealSearchProvider);
