"use client";

import { useTransition } from "react";

import toast from "react-hot-toast";

import { useTranslations } from "next-intl";

import { Briefcase } from "lucide-react";

import { cn } from "@/lib/utils";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";

import DealPipelineCard from "./dealPipelineCard";

import { updateDealStage } from "@/server/actions/deals/updateDealStage";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { WorkspaceDealStage } from "@/types/dealStage";
import { Deal } from "@/types/deal";

const KNOWN_SLUGS = new Set(["lead", "qualified", "proposal", "negotiation", "won", "lost"]);

type Props = {
  stage: WorkspaceDealStage;
  deals: Deal[];
  canMoveBack: boolean;
  canMoveForward: boolean;
  prevSlug?: string;
  nextSlug?: string;
  onRefresh: () => void;
  onEdit: (deal: Deal) => void;
};

export default function DealPipelineColumn({
  stage,
  deals,
  canMoveBack,
  canMoveForward,
  prevSlug,
  nextSlug,
  onRefresh,
  onEdit,
}: Props) {
  const t = useTranslations("deals");
  const [isPending, startTransition] = useTransition();

  const stageValue = deals.reduce((total, deal) => total + Number(deal.value || 0), 0);

  const titleColor = stage.is_won
    ? "text-emerald-400"
    : stage.is_lost
      ? "text-zinc-500"
      : "text-white";

  async function moveDeal(dealId: string, targetSlug: string) {
    startTransition(async () => {
      const success = await updateDealStage(dealId, targetSlug);

      if (!success) {
        toast.error(t("failedToUpdateStage"));
        return;
      }

      toast.success(t("stageUpdated"));
      onRefresh();
    });
  }

  return (
    <GunimiCard className="h-full min-h-[600px] p-4">
      {/* HEADER */}
      <div className="mb-5 border-b border-white/[0.08] pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className={cn("text-sm font-semibold", titleColor)}>
              {KNOWN_SLUGS.has(stage.slug) ? t(stage.slug as "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost") : stage.name}
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
            canMoveBack={canMoveBack}
            canMoveForward={canMoveForward}
            onMoveBack={() => prevSlug && moveDeal(deal.id, prevSlug)}
            onMoveForward={() => nextSlug && moveDeal(deal.id, nextSlug)}
            onEdit={() => onEdit(deal)}
          />
        ))}

        {isPending && (
          <div className="py-3 text-center text-xs text-white/40">{t("loading")}</div>
        )}
      </div>
    </GunimiCard>
  );
}
