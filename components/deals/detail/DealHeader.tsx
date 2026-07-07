"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Pencil } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiWorkspaceHeader from "@/components/ui/GunimiWorkspaceHeader";
import type { WorkspaceHealth } from "@/components/ui/GunimiWorkspaceHeader";

import { updateDealStage } from "@/server/actions/deals/updateDealStage";
import { Deal } from "@/types/deal";

const STAGES = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
] as const;

type DealStage = (typeof STAGES)[number];

const STAGE_BADGE: Record<DealStage, string> = {
  lead: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  qualified: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  proposal: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  negotiation: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  won: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  lost: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
};

const STAGE_DOT: Record<DealStage, string> = {
  lead: "bg-violet-400",
  qualified: "bg-cyan-400",
  proposal: "bg-blue-400",
  negotiation: "bg-amber-400",
  won: "bg-emerald-400",
  lost: "bg-zinc-400",
};

const STAGE_WEIGHTS: Record<string, number> = {
  negotiation: 1.2,
  proposal: 1.0,
  qualified: 0.85,
  lead: 0.7,
};

function computeDealHealth(
  probability: number | undefined,
  updatedAt: string | undefined,
  expectedCloseDate: string | undefined,
  stage: string,
): { healthScore: number; healthLabel: "Healthy" | "Warning" | "At Risk" } {
  const now = Date.now();
  const MS_PER_DAY = 86_400_000;

  const daysSinceUpdated = updatedAt
    ? Math.floor((now - new Date(updatedAt).getTime()) / MS_PER_DAY)
    : 30;

  const daysUntilClose = expectedCloseDate
    ? Math.floor((new Date(expectedCloseDate).getTime() - now) / MS_PER_DAY)
    : null;

  const stageWeight = STAGE_WEIGHTS[stage.toLowerCase()] ?? 1.0;
  const base = probability != null ? probability : stageWeight * 50;
  const staleFactor = Math.max(0, 1 - daysSinceUpdated / 30);

  let urgencyFactor = 1.0;
  if (daysUntilClose !== null) {
    if (daysUntilClose < 0) urgencyFactor = 0.5;
    else if (daysUntilClose === 0) urgencyFactor = 1.5;
    else if (daysUntilClose <= 7) urgencyFactor = 1.3;
    else if (daysUntilClose <= 14) urgencyFactor = 1.15;
  }

  const raw = base * staleFactor * urgencyFactor;
  const healthScore = Math.max(0, Math.min(100, Math.round(raw)));
  const healthLabel =
    healthScore >= 70 ? "Healthy" : healthScore >= 40 ? "Warning" : "At Risk";

  return { healthScore, healthLabel };
}

type Props = {
  deal: Deal;
  onEdit: () => void;
};

export default function DealHeader({ deal, onEdit }: Props) {
  const t = useTranslations("deals");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [currentStage, setCurrentStage] = useState<DealStage>(
    deal.stage as DealStage,
  );
  const [isPending, startTransition] = useTransition();

  function handleStageChange(stage: DealStage) {
    if (stage === currentStage) return;
    startTransition(async () => {
      const ok = await updateDealStage(deal.id, stage);
      if (ok) {
        setCurrentStage(stage);
        toast.success(t("stageUpdated"));
        router.refresh();
      } else {
        toast.error(t("failedToUpdateStage"));
      }
    });
  }

  const { healthLabel } = computeDealHealth(
    deal.probability,
    deal.updated_at,
    deal.expected_close_date,
    deal.stage,
  );

  const health: WorkspaceHealth = {
    level:
      healthLabel === "Healthy"
        ? "healthy"
        : healthLabel === "Warning"
          ? "warning"
          : "at-risk",
    label:
      healthLabel === "Healthy"
        ? t("healthStatusHealthy")
        : healthLabel === "Warning"
          ? t("healthStatusWarning")
          : t("healthStatusAtRisk"),
  };

  const context = deal.company ? (
    <Link
      href={`/dashboard/companies/${deal.company.id}`}
      className="inline-block text-xs text-white/40 transition-colors hover:text-violet-300"
    >
      {deal.company.name}
    </Link>
  ) : undefined;

  const actions = (
    <>
      <GunimiButton
        variant="secondary"
        onClick={onEdit}
        className="flex items-center gap-1.5 px-3"
      >
        <Pencil size={13} />
        {tCommon("edit")}
      </GunimiButton>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            disabled={isPending}
            aria-label={t("changeStageLabel")}
            className={cn(
              "group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all outline-none",
              "focus-visible:ring-2 focus-visible:ring-[#6D5BFF]/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#05060A]",
              STAGE_BADGE[currentStage],
              isPending && "cursor-not-allowed opacity-50",
            )}
          >
            {t(currentStage)}
            <ChevronDown
              size={11}
              aria-hidden
              className="transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-50 min-w-[160px] overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1F]/95 p-1.5 shadow-xl backdrop-blur-2xl"
          >
            {STAGES.map((stage) => (
              <DropdownMenu.Item
                key={stage}
                onSelect={() => handleStageChange(stage)}
                className={cn(
                  "flex w-full cursor-default select-none items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs outline-none transition-all",
                  stage === currentStage
                    ? "bg-white/[0.06] text-white"
                    : "text-white/50 data-[highlighted]:bg-white/[0.04] data-[highlighted]:text-white/80",
                )}
              >
                <span
                  className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STAGE_DOT[stage])}
                  aria-hidden
                />
                {t(stage)}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );

  return (
    <GunimiWorkspaceHeader
      type={t("workspaceType")}
      title={deal.title}
      context={context}
      owner={deal.owner?.full_name}
      health={health}
      backHref="/dashboard/deals"
      backLabel={t("backToPipeline")}
      actions={actions}
    />
  );
}
