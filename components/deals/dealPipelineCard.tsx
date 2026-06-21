"use client";

import Link from "next/link";

import { useRouter }
from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useTranslations }
from "next-intl";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitButton
from "@/components/ui/OrbitButton";

import { Deal }
from "@/types/deal";

type Props = {
  deal: Deal;

  canMoveBack: boolean;

  canMoveForward: boolean;

  onMoveBack: () => void;

  onMoveForward: () => void;
};

export default function DealPipelineCard({
  deal,
  canMoveBack,
  canMoveForward,
  onMoveBack,
  onMoveForward,
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
    <OrbitCard
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
          €
          {Number(
            deal.value || 0
          ).toLocaleString()}

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
          <OrbitButton
            variant="secondary"
            disabled={!canMoveBack}
            onClick={onMoveBack}
            className="
              shrink-0
              px-2.5
            "
          >
            <ChevronLeft size={14} />
          </OrbitButton>

          <OrbitButton
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
          </OrbitButton>

          <OrbitButton
            variant="secondary"
            disabled={!canMoveForward}
            onClick={onMoveForward}
            className="
              shrink-0
              px-2.5
            "
          >
            <ChevronRight size={14} />
          </OrbitButton>
        </div>
      </div>
    </OrbitCard>
  );
}
