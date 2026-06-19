"use client";

import { useTransition } from "react";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import {
  Briefcase,
} from "lucide-react";

import { cn } from "@/lib/utils";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitEmptyState
from "@/components/ui/OrbitEmptyState";

import DealPipelineCard
from "./dealPipelineCard";

import {
  updateDealStage,
} from "@/server/actions/deals/updateDealStage";

const STAGES = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

const STAGE_TITLE_COLOR: Record<string, string> = {
  lead: "text-white",
  qualified: "text-white",
  proposal: "text-white",
  negotiation: "text-white",
  won: "text-emerald-400",
  lost: "text-zinc-500",
};

import { Deal } from "@/types/deal";

type Props = {
  stage:
    (typeof STAGES)[number];

  deals: Deal[];

  onRefresh: () => void;
};

export default function DealPipelineColumn({
  stage,
  deals,
  onRefresh,
}: Props) {
  const t =
    useTranslations(
      "deals"
    );

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const stageIndex =
    STAGES.indexOf(
      stage
    );

  const stageValue =
    deals.reduce(
      (
        total,
        deal
      ) =>
        total +
        Number(
          deal.value || 0
        ),
      0
    );

  async function moveDeal(
    dealId: string,
    nextStage:
      (typeof STAGES)[number]
  ) {
    startTransition(
      async () => {
        const success =
          await updateDealStage(
            dealId,
            nextStage
          );

        if (!success) {
          toast.error(
            t(
              "failedToUpdateStage"
            )
          );

          return;
        }

        toast.success(
          t(
            "stageUpdated"
          )
        );

        onRefresh();
      }
    );
  }

  return (
    <OrbitCard
      className="
        h-full

        min-h-[600px]

        p-4
      "
    >
      {/* HEADER */}

      <div
        className="
          mb-5

          border-b
          border-white/[0.08]

          pb-4
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <div>
            <h3
              className={cn(
                "text-sm font-semibold",
                STAGE_TITLE_COLOR[stage]
              )}
            >
              {t(stage)}
            </h3>

            <p
              className="
                mt-1

                text-xs
                text-white/40
              "
            >
              {deals.length}
              {" "}
              {t(
                "opportunities"
              )}
            </p>
          </div>

          <div
            className="
              text-right
            "
          >
            <p
              className="
                text-xs
                text-white/40
              "
            >
              {t(
                "pipelineValue"
              )}
            </p>

            <p
              className="
                mt-1

                text-sm
                font-medium
              "
            >
              €
              {stageValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div
        className="
          space-y-3
        "
      >
        {deals.length ===
          0 && (
          <OrbitEmptyState
            title={t(
              "noDeals"
            )}
            description={t(
              "noDealsDescription"
            )}
            icon={
              Briefcase
            }
          />
        )}

        {deals.map(
          (deal) => (
            <DealPipelineCard
              key={deal.id}
              deal={deal}
              canMoveBack={
                stageIndex >
                0
              }
              canMoveForward={
                stageIndex <
                STAGES.length -
                  1
              }
              onMoveBack={() =>
                moveDeal(
                  deal.id,
                  STAGES[
                    stageIndex -
                      1
                  ]
                )
              }
              onMoveForward={() =>
                moveDeal(
                  deal.id,
                  STAGES[
                    stageIndex +
                      1
                  ]
                )
              }
            />
          )
        )}

        {isPending && (
          <div
            className="
              py-3

              text-center

              text-xs
              text-white/40
            "
          >
            {t(
              "loading"
            )}
          </div>
        )}
      </div>
    </OrbitCard>
  );
}