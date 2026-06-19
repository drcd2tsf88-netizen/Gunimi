"use client";

import Link
from "next/link";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import toast
from "react-hot-toast";

import { cn }
from "@/lib/utils";

import { updateDealStage }
from "@/server/actions/deals/updateDealStage";

import OrbitCard
from "@/components/ui/OrbitCard";

import { Deal }
from "@/types/deal";

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

const STAGE_BADGE: Record<DealStage, string> = {
  lead:
    "border-violet-500/20 bg-violet-500/10 text-violet-300",
  qualified:
    "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  proposal:
    "border-blue-500/20 bg-blue-500/10 text-blue-300",
  negotiation:
    "border-amber-500/20 bg-amber-500/10 text-amber-300",
  won:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  lost:
    "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
};

const STAGE_DOT: Record<DealStage, string> = {
  lead: "bg-violet-400",
  qualified: "bg-cyan-400",
  proposal: "bg-blue-400",
  negotiation: "bg-amber-400",
  won: "bg-emerald-400",
  lost: "bg-zinc-400",
};

type Props = {
  deal: Deal;
};

export default function DealHeader({
  deal,
}: Props) {
  const t =
    useTranslations("deals");

  const router =
    useRouter();

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const [stageOpen, setStageOpen] =
    useState(false);

  const [currentStage, setCurrentStage] =
    useState<DealStage>(
      deal.stage as DealStage
    );

  const [isPending, startTransition] =
    useTransition();

  // CLOSE ON OUTSIDE CLICK

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          e.target as Node
        )
      ) {
        setStageOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside
      );
  }, []);

  // STAGE CHANGE

  function handleStageChange(
    stage: DealStage
  ) {
    setStageOpen(false);

    if (stage === currentStage) {
      return;
    }

    startTransition(async () => {
      const ok =
        await updateDealStage(
          deal.id,
          stage
        );

      if (ok) {
        setCurrentStage(stage);
        toast.success(t("stageUpdated"));
        router.refresh();
      } else {
        toast.error(
          t("failedToUpdateStage")
        );
      }
    });
  }

  return (
    <div
      className="
        space-y-4
      "
    >
      {/* BACK */}

      <Link
        href="/dashboard/deals"
        className="
          inline-flex
          items-center
          gap-2

          text-sm
          text-white/40

          transition-colors

          hover:text-white/80
        "
      >
        <ArrowLeft size={14} />
        {t("backToPipeline")}
      </Link>

      {/* HEADER CARD */}

      <OrbitCard
        className="
          p-6
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-6
          "
        >
          {/* TITLE */}

          <div
            className="
              min-w-0
              flex-1
            "
          >
            <p
              className="
                text-xs
                uppercase

                tracking-[0.18em]

                text-zinc-500
              "
            >
              {t("opportunity")}
            </p>

            <h1
              className="
                mt-3

                text-3xl
                font-semibold
                leading-tight
              "
            >
              {deal.title}
            </h1>

            {deal.description && (
              <p
                className="
                  mt-3

                  max-w-3xl

                  text-sm
                  leading-relaxed
                  text-white/60
                "
              >
                {deal.description}
              </p>
            )}
          </div>

          {/* STAGE SELECTOR */}

          <div
            ref={dropdownRef}
            className="
              relative
              shrink-0
            "
          >
            <button
              onClick={() =>
                setStageOpen((prev) => !prev)
              }
              disabled={isPending}
              className={cn(
                `
                flex
                items-center
                gap-2

                rounded-full

                border

                px-3
                py-1.5

                text-xs
                font-medium

                transition-all
                `,
                STAGE_BADGE[currentStage],
                isPending &&
                  "cursor-not-allowed opacity-50"
              )}
            >
              {t(currentStage)}

              <ChevronDown
                size={12}
                className={cn(
                  "transition-transform duration-200",
                  stageOpen && "rotate-180"
                )}
              />
            </button>

            {/* DROPDOWN */}

            {stageOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+6px)]
                  z-50

                  min-w-[160px]

                  overflow-hidden

                  rounded-2xl

                  border
                  border-white/10

                  bg-[#0A0F1F]/95

                  p-1.5

                  shadow-xl

                  backdrop-blur-2xl
                "
              >
                {STAGES.map((stage) => (
                  <button
                    key={stage}
                    onClick={() =>
                      handleStageChange(stage)
                    }
                    className={cn(
                      `
                      flex
                      w-full
                      items-center
                      gap-2.5

                      rounded-xl

                      px-3
                      py-2.5

                      text-xs

                      transition-all
                      `,
                      stage === currentStage
                        ? "bg-white/[0.06] text-white"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        STAGE_DOT[stage]
                      )}
                    />

                    {t(stage)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </OrbitCard>
    </div>
  );
}
