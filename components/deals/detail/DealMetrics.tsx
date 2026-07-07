"use client";

import { useState } from "react";

import GunimiSection
from "@/components/layout/GunimiSection";

import GunimiStatCard
from "@/components/ui/GunimiStatCard";

import {
  TrendingUp,
  Target,
  Calendar,
  Activity,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import { Deal } from "@/types/deal";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type Props = {
  deal: Deal;
};

export default function DealMetrics({
  deal,
}: Props) {
  const t =
    useTranslations(
      "deals"
    );

  const expectedRevenue =
    Number(
      deal.value || 0
    ) *
    (
      Number(
        deal.probability || 0
      ) / 100
    );

  const [now] = useState(() => Date.now());

  const daysOpen =
    Math.max(
      0,
      Math.floor(
        (
          now -
          new Date(
            deal.created_at
          ).getTime()
        ) /
          86400000
      )
    );

  return (
    <GunimiSection>
      <div
        className="
          grid
          gap-4

          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        <GunimiStatCard
          title={t("value")}
          value={formatCurrency(Number(deal.value || 0))}
          icon={TrendingUp}
        />

        <GunimiStatCard
          title={t(
            "probability"
          )}
          value={`${deal.probability || 0}%`}
          icon={Target}
        />

        <GunimiStatCard
          title={t(
            "expectedRevenue"
          )}
          value={formatCurrency(Math.round(expectedRevenue))}
          icon={Activity}
        />

        <GunimiStatCard
          title={t(
            "daysOpen"
          )}
          value={String(daysOpen)}
          icon={Calendar}
        />
      </div>
    </GunimiSection>
  );
}