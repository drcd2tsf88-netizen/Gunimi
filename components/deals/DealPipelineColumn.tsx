"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";

import DealPipelineCard from "./dealPipelineCard";

import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { WorkspaceDealStage } from "@/types/dealStage";
import { Deal } from "@/types/deal";

const KNOWN_SLUGS = new Set([
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
]);

type Props = {
  stage: WorkspaceDealStage;
  deals: Deal[];
  onDragStart: (dealId: string) => void;
  onDrop: (dealId: string) => void;
  onEdit: (deal: Deal) => void;
};

export default function DealPipelineColumn({
  stage,
  deals,
  onDragStart,
  onDrop,
  onEdit,
}: Props) {
  const t = useTranslations("deals");
  const [isDragOver, setIsDragOver] = useState(false);

  const stageValue = deals.reduce((total, deal) => total + Number(deal.value || 0), 0);

  const titleColor = stage.is_won
    ? "text-emerald-400"
    : stage.is_lost
      ? "text-zinc-500"
      : "text-white";

  return (
    <div
      className="h-full"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const dealId = e.dataTransfer.getData("dealId");
        if (dealId) onDrop(dealId);
      }}
    >
      <GunimiCard
        className={cn(
          "h-full min-h-[600px] p-4 transition-colors duration-150",
          isDragOver && "border-violet-500/40 bg-violet-500/[0.04]"
        )}
      >
        {/* HEADER */}
        <div className="mb-5 border-b border-white/[0.08] pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className={cn("text-sm font-semibold", titleColor)}>
                {KNOWN_SLUGS.has(stage.slug)
                  ? t(
                      stage.slug as
                        | "lead"
                        | "qualified"
                        | "proposal"
                        | "negotiation"
                        | "won"
                        | "lost"
                    )
                  : stage.name}
              </h3>
              <p className="mt-1 text-xs text-white/40">
                {deals.length} {t("opportunities")}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-white/40">{t("pipelineValue")}</p>
              <p className="mt-1 text-sm font-medium">{formatCurrency(stageValue)}</p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-3">
          {deals.length === 0 && (
            <GunimiEmptyState
              title={t("noDeals")}
              description={t("noDealsDescription")}
              icon={Briefcase}
            />
          )}

          {deals.map((deal) => (
            <DealPipelineCard
              key={deal.id}
              deal={deal}
              onDragStart={onDragStart}
              onEdit={() => onEdit(deal)}
            />
          ))}
        </div>
      </GunimiCard>
    </div>
  );
}
