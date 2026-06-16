"use client";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitStatCard
from "@/components/ui/OrbitStatCard";

import {
  Briefcase,
  TrendingUp,
  Trophy,
  Activity,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import { Deal } from "@/types/deal";

type Props = {
  deals: Deal[];
};

export default function DealsMetrics({
  deals,
}: Props) {
  const t =
    useTranslations(
      "deals"
    );

  const openDeals =
    deals.filter(
      (deal) =>
        deal.stage !== "won" &&
        deal.stage !== "lost"
    );

  const wonDeals =
    deals.filter(
      (deal) =>
        deal.stage === "won"
    );

  const lostDeals =
    deals.filter(
      (deal) =>
        deal.stage === "lost"
    );

  const pipelineValue =
    openDeals.reduce(
      (sum, deal) =>
        sum +
        Number(
          deal.value || 0
        ),
      0
    );

  const wonRevenue =
    wonDeals.reduce(
      (sum, deal) =>
        sum +
        Number(
          deal.value || 0
        ),
      0
    );

  const winRate =
    wonDeals.length +
      lostDeals.length >
    0
      ? Math.round(
          (wonDeals.length /
            (
              wonDeals.length +
              lostDeals.length
            )) *
            100
        )
      : 0;

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
          title={t(
            "openOpportunities"
          )}
          value={String(
            openDeals.length
          )}
          icon={Briefcase}
        />

        <OrbitStatCard
          title={t(
            "pipelineValue"
          )}
          value={String(
            pipelineValue
          )}
          icon={TrendingUp}
        />

        <OrbitStatCard
          title={t(
            "wonRevenue"
          )}
          value={String(
            wonRevenue
          )}
          icon={Trophy}
        />

        <OrbitStatCard
          title={t(
            "winRate"
          )}
          value={`${winRate}`}
          icon={Activity}
        />
      </div>
    </OrbitSection>
  );
}