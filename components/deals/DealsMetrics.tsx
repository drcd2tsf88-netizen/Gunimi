"use client";

import {
  Briefcase,
  TrendingUp,
  Trophy,
  Activity,
} from "lucide-react";

import { useTranslations }
from "next-intl";

import OrbitMetricGrid
from "@/components/ui/OrbitMetricGrid";

import { formatCurrency } from "@/lib/utils/formatCurrency";

import { Deal }
from "@/types/deal";

type Props = {
  deals: Deal[];
};

export default function DealsMetrics({
  deals,
}: Props) {
  const t = useTranslations("deals");

  const openDeals = deals.filter(
    (deal) =>
      deal.stage !== "won" &&
      deal.stage !== "lost"
  );

  const wonDeals = deals.filter(
    (deal) => deal.stage === "won"
  );

  const lostDeals = deals.filter(
    (deal) => deal.stage === "lost"
  );

  const pipelineValue = openDeals.reduce(
    (sum, deal) => sum + Number(deal.value || 0),
    0
  );

  const wonRevenue = wonDeals.reduce(
    (sum, deal) => sum + Number(deal.value || 0),
    0
  );

  const winRate =
    wonDeals.length + lostDeals.length > 0
      ? Math.round(
          (wonDeals.length /
            (wonDeals.length + lostDeals.length)) *
            100
        )
      : 0;

  return (
    <OrbitMetricGrid
      items={[
        {
          label: t("openOpportunities"),
          value: String(openDeals.length),
          icon: Briefcase,
        },
        {
          label: t("pipelineValue"),
          value: formatCurrency(pipelineValue),
          icon: TrendingUp,
        },
        {
          label: t("wonRevenue"),
          value: formatCurrency(wonRevenue),
          icon: Trophy,
        },
        {
          label: t("winRate"),
          value: `${winRate}%`,
          icon: Activity,
        },
      ]}
    />
  );
}
