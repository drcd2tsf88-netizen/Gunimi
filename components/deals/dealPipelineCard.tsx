"use client";

import Link from "next/link";

import { useRouter }
from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";

import { useTranslations }
from "next-intl";

import GunimiCard
from "@/components/ui/GunimiCard";

import GunimiButton
from "@/components/ui/GunimiButton";

import { Deal }
from "@/types/deal";

import { formatCurrency }
from "@/lib/utils/formatCurrency";

type Props = {
  deal: Deal;

  canMoveBack: boolean;

  canMoveForward: boolean;

  onMoveBack: () => void;

  onMoveForward: () => void;

  onEdit: () => void;
};

export default function DealPipelineCard({
  deal,
  canMoveBack,
  canMoveForward,
  onMoveBack,
  onMoveForward,
  onEdit,
}: Props) {
  const router =
    useRouter();

  const t =
    useTranslations("deals");

  const closeLabel =
    deal.expected_close_date
      ? new Date(
          deal.expected_close_date
        ).toLocaleDateString(
          undefined,
          {
            month: "short",
            day: "numeric",
          }
        )
      : null;

  return (
    <GunimiCard
      className="
        p-4

        transition-all

        hover:border-violet-500/20
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3.5
        "
      >
        {/* TITLE + COMPANY */}

        <div>
          {deal.company?.name && (
            <Link
              href={`/dashboard/companies/${deal.company.id}`}
              className="
                mb-1
                block

                text-[10px]
                uppercase

                tracking-[0.12em]

                text-white/35

                transition-colors
                hover:text-violet-300
                focus-visible:outline-none
                focus-visible:underline
              "
            >
              {deal.company.name}
            </Link>
          )}

          <h3
            className="
              text-sm
              font-semibold
              leading-snug
            "
          >
            {deal.title}
          </h3>
        </div>

        {/* INLINE METADATA */}

        <p
          className="
            text-xs
            text-white/40
          "
        >
          {formatCurrency(Number(deal.value || 0))}

          {" · "}

          {deal.probability}%

          {closeLabel && (
            <>
              {" · "}
              {closeLabel}
            </>
          )}
        </p>

        {/* ACTIONS */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <GunimiButton
            variant="secondary"
            disabled={!canMoveBack}
            onClick={onMoveBack}
            className="
              shrink-0
              px-2.5
            "
          >
            <ChevronLeft size={14} />
          </GunimiButton>

          <GunimiButton
            className="
              flex-1
            "
            onClick={() =>
              router.push(
                `/dashboard/deals/${deal.id}`
              )
            }
          >
            {t("open")}
          </GunimiButton>

          <GunimiButton
            variant="secondary"
            onClick={onEdit}
            className="
              shrink-0
              px-2.5
            "
          >
            <Pencil size={13} />
          </GunimiButton>

          <GunimiButton
            variant="secondary"
            disabled={!canMoveForward}
            onClick={onMoveForward}
            className="
              shrink-0
              px-2.5
            "
          >
            <ChevronRight size={14} />
          </GunimiButton>
        </div>
      </div>
    </GunimiCard>
  );
}
