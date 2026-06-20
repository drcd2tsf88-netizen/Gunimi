"use client";

import DealPipelineColumn
from "./DealPipelineColumn";


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
  return (
    <div>
      <div
        className="
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
                  w-[240px]
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
    </div>
  );
}