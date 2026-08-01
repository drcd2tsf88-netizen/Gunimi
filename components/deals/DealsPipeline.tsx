"use client";

import DealPipelineColumn from "./DealPipelineColumn";
import { Deal } from "@/types/deal";
import type { WorkspaceDealStage } from "@/types/dealStage";

type Props = {
  deals: Deal[];
  stages: WorkspaceDealStage[];
  onRefresh: () => void;
  onEdit: (deal: Deal) => void;
};

export default function DealsPipeline({ deals, stages, onRefresh, onEdit }: Props) {
  return (
    <div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage, index) => {
          const stageDeals = deals.filter((deal) => deal.stage === stage.slug);
          const prevSlug = index > 0 ? stages[index - 1].slug : undefined;
          const nextSlug = index < stages.length - 1 ? stages[index + 1].slug : undefined;

          return (
            <div key={stage.id} className="w-[240px] shrink-0">
              <DealPipelineColumn
                stage={stage}
                deals={stageDeals}
                canMoveBack={index > 0}
                canMoveForward={index < stages.length - 1}
                prevSlug={prevSlug}
                nextSlug={nextSlug}
                onRefresh={onRefresh}
                onEdit={onEdit}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
