"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Deal } from "@/types/deal";
import { formatCurrencyCompact } from "@/lib/utils/formatCurrency";

type DealStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

const OPEN_STAGES: DealStage[] = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
];

const CLOSED_STAGES: DealStage[] = ["won", "lost"];

const STAGE_DOT: Record<DealStage, string> = {
  lead: "bg-violet-400",
  qualified: "bg-cyan-400",
  proposal: "bg-blue-400",
  negotiation: "bg-amber-400",
  won: "bg-emerald-400",
  lost: "bg-zinc-500",
};

type Props = {
  deals: Deal[];
  selected: DealStage;
  onSelect: (stage: DealStage) => void;
};

export default function DealsStagePicker({
  deals,
  selected,
  onSelect,
}: Props) {
  const t = useTranslations("deals");

  function getCount(stage: DealStage) {
    return deals.filter((d) => d.stage === stage).length;
  }

  function getTotal(stage: DealStage): string | null {
    const total = deals
      .filter((d) => d.stage === stage)
      .reduce((sum, d) => sum + Number(d.value || 0), 0);

    if (total === 0) return null;

    return formatCurrencyCompact(total);
  }

  function renderStage(stage: DealStage) {
    const isSelected = selected === stage;
    const count = getCount(stage);
    const total = getTotal(stage);

    return (
      <button
        key={stage}
        onClick={() => onSelect(stage)}
        className={cn(
          `
          group
          flex
          w-full
          items-center
          gap-2.5

          rounded-xl

          px-3
          py-2

          text-left

          transition-all
          duration-150
          `,
          isSelected
            ? "bg-white/[0.07] text-white"
            : "text-white/45 hover:bg-white/[0.03] hover:text-white/75"
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            STAGE_DOT[stage]
          )}
        />

        <span
          className="
            flex-1
            truncate
            text-sm
            font-medium
          "
        >
          {t(stage)}
        </span>

        <span
          className={cn(
            "text-xs tabular-nums",
            isSelected ? "text-white/50" : "text-white/25"
          )}
        >
          {count}
        </span>

        {total && (
          <span
            className={cn(
              "text-xs tabular-nums",
              isSelected ? "text-white/40" : "text-white/20"
            )}
          >
            {total}
          </span>
        )}
      </button>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5">
      <p
        className="
          mb-1.5
          px-3

          text-[10px]
          uppercase
          tracking-[0.18em]

          text-zinc-600
        "
      >
        {t("pipeline")}
      </p>

      {OPEN_STAGES.map(renderStage)}

      <div
        className="
          my-3

          border-t
          border-white/[0.06]
        "
      />

      <p
        className="
          mb-1.5
          px-3

          text-[10px]
          uppercase
          tracking-[0.18em]

          text-zinc-600
        "
      >
        {t("closed")}
      </p>

      {CLOSED_STAGES.map(renderStage)}
    </nav>
  );
}
