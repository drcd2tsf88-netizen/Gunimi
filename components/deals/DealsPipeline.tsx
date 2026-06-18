"use client";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import DealPipelineColumn
from "./DealPipelineColumn";

import {
  useTranslations,
} from "next-intl";


const STAGES = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

type DealStage =
  (typeof STAGES)[number];

import { Deal } from "@/types/deal";

type Props = {
  deals: Deal[];

  onRefresh: () => void;
};

export default function DealsPipeline({
  deals,
  onRefresh,
}: Props) {
  const t =
    useTranslations(
      "deals"
    );

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t(
          "commercialPipeline"
        )}
        title={t(
          "commercialPipeline"
        )}
        subtitle={t(
          "commercialPipelineSubtitle"
        )}
      />

      <div
        className="
          mt-6

          flex
          gap-4

          overflow-x-auto

          pb-4
        "
      >
        {STAGES.map(
          (
            stage: DealStage
          ) => {
            const stageDeals =
              deals.filter(
                (deal) =>
                  deal.stage ===
                  stage
              );

            return (
              <div
                key={stage}
                className="
                  w-[280px]
                  shrink-0
                "
              >
                <DealPipelineColumn
                  stage={stage}
                  deals={
                    stageDeals
                  }
                  onRefresh={
                    onRefresh
                  }
                />
              </div>
            );
          }
        )}
      </div>
    </OrbitSection>
  );
}