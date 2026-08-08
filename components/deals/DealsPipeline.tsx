"use client";

import { useRef, useTransition } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

import DealPipelineColumn from "./DealPipelineColumn";
import { updateDealStage } from "@/server/actions/deals/updateDealStage";
import { Deal } from "@/types/deal";
import type { WorkspaceDealStage } from "@/types/dealStage";

type Props = {
  deals: Deal[];
  stages: WorkspaceDealStage[];
  onStageMoved: (dealId: string, newStage: string) => void;
  onEdit: (deal: Deal) => void;
};

export default function DealsPipeline({ deals, stages, onStageMoved, onEdit }: Props) {
  const t = useTranslations("deals");
  const draggedDealRef = useRef<{ id: string; stage: string } | null>(null);
  const [, startTransition] = useTransition();

  function handleDragStart(dealId: string) {
    const deal = deals.find((d) => d.id === dealId);
    draggedDealRef.current = deal ? { id: deal.id, stage: deal.stage } : null;
  }

  function handleDrop(dealId: string, targetStage: string) {
    const dragged = draggedDealRef.current;
    draggedDealRef.current = null;

    if (!dragged || dragged.id !== dealId) return;
    if (dragged.stage === targetStage) return;

    onStageMoved(dealId, targetStage);

    startTransition(async () => {
      const success = await updateDealStage(dealId, targetStage);
      if (!success) {
        toast.error(t("failedToUpdateStage"));
        onStageMoved(dealId, dragged.stage);
      }
    });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = deals.filter((deal) => deal.stage === stage.slug);
        return (
          <div key={stage.id} className="w-[240px] shrink-0">
            <DealPipelineColumn
              stage={stage}
              deals={stageDeals}
              onDragStart={handleDragStart}
              onDrop={(dealId) => handleDrop(dealId, stage.slug)}
              onEdit={onEdit}
            />
          </div>
        );
      })}
    </div>
  );
}
