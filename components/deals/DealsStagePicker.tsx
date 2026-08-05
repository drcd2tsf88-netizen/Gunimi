"use client";

import { cn } from "@/lib/utils";
import { Deal } from "@/types/deal";
import { formatCurrencyCompact } from "@/lib/utils/formatCurrency";
import { STAGE_DOT_CLASS } from "@/lib/deals/defaultStages";
import type { WorkspaceDealStage } from "@/types/dealStage";
import { useTranslations } from "next-intl";

const KNOWN_SLUGS = new Set(["lead", "qualified", "proposal", "negotiation", "won", "lost"]);

type Props = {
  deals: Deal[];
  stages: WorkspaceDealStage[];
  selected: string;
  onSelect: (slug: string) => void;
};

export default function DealsStagePicker({ deals, stages, selected, onSelect }: Props) {
  const t = useTranslations("deals");

  const openStages = stages.filter((s) => !s.is_won && !s.is_lost);
  const closedStages = stages.filter((s) => s.is_won || s.is_lost);

  function getCount(slug: string) {
    return deals.filter((d) => d.stage === slug).length;
  }

  function getTotal(slug: string): string | null {
    const total = deals
      .filter((d) => d.stage === slug)
      .reduce((sum, d) => sum + Number(d.value || 0), 0);
    if (total === 0) return null;
    return formatCurrencyCompact(total);
  }

  function renderStage(stage: WorkspaceDealStage) {
    const isSelected = selected === stage.slug;
    const count = getCount(stage.slug);
    const total = getTotal(stage.slug);
    const dotClass = STAGE_DOT_CLASS[stage.color] ?? "bg-zinc-500";

    return (
      <button
        key={stage.id}
        onClick={() => onSelect(stage.slug)}
        className={cn(
          `group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-150`,
          isSelected
            ? "bg-white/[0.07] text-white"
            : "text-white/45 hover:bg-white/[0.03] hover:text-white/75"
        )}
      >
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClass)} />

        <span className="flex-1 truncate text-sm font-medium">
            {KNOWN_SLUGS.has(stage.slug) ? t(stage.slug as "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost") : stage.name}
          </span>

        <span className={cn("text-xs tabular-nums", isSelected ? "text-white/50" : "text-white/25")}>
          {count}
        </span>

        {total && (
          <span className={cn("text-xs tabular-nums", isSelected ? "text-white/40" : "text-white/20")}>
            {total}
          </span>
        )}
      </button>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5">
      {openStages.length > 0 && (
        <>
          <p className="mb-1.5 px-3 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            {t("pipeline")}
          </p>
          {openStages.map(renderStage)}
        </>
      )}

      {closedStages.length > 0 && (
        <>
          <div className="my-3 border-t border-white/[0.06]" />
          <p className="mb-1.5 px-3 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            {t("closed")}
          </p>
          {closedStages.map(renderStage)}
        </>
      )}
    </nav>
  );
}
