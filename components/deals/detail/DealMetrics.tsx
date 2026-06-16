"use client";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitStatCard
from "@/components/ui/OrbitStatCard";

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

  const daysOpen =
    Math.max(
      0,
      Math.floor(
        (
          Date.now() -
          new Date(
            deal.created_at
          ).getTime()
        ) /
          86400000
      )
    );

  return (
    <OrbitSection>
      <div
        className="
          grid
          gap-4

          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        <OrbitStatCard
          title={t("value")}
          value={String(
            Number(
              deal.value || 0
            )
          )}
          icon={TrendingUp}
        />

        <OrbitStatCard
          title={t(
            "probability"
          )}
          value={String(
            deal.probability || 0
          )}
          icon={Target}
        />

        <OrbitStatCard
          title={t(
            "expectedRevenue"
          )}
          value={String(
            Math.round(
              expectedRevenue
            )
          )}
          icon={Activity}
        />

        <OrbitStatCard
          title={t(
            "daysOpen"
          )}
          value={String(
            daysOpen
          )}
          icon={Calendar}
        />
      </div>
    </OrbitSection>
  );
}