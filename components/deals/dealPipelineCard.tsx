"use client";

import { useRouter }
from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Building2,
  User,
} from "lucide-react";

import { useTranslations }
from "next-intl";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitButton
from "@/components/ui/OrbitButton";

import { Deal } from "@/types/deal";

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
    useTranslations();

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
          gap-4
        "
      >
        <div>
          <h3
            className="
              text-sm
              font-semibold
            "
          >
            {deal.title}
          </h3>

          {deal.company?.name && (
            <div
              className="
                mt-2

                flex
                items-center
                gap-2

                text-xs
                text-white/50
              "
            >
              <Building2
                size={12}
              />

              {deal.company.name}
            </div>
          )}
        </div>

        <div
          className="
            grid
            gap-3
          "
        >
          <div>
            <p
              className="
                text-xs
                text-white/40
              "
            >
             {t("deals.value")}
            </p>

            <p
              className="
                text-sm
                font-medium
              "
            >
              €
              {Number(
                deal.value || 0
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p
              className="
                text-xs
                text-white/40
              "
            >
              {t("deals.probability")}
            </p>

            <p
              className="
                text-sm
              "
            >
              {
                deal.probability
              }
              %
            </p>
          </div>

          {deal.expected_close_date && (
  <div>
    <p
      className="
        text-xs
        text-white/40
      "
    >
      {t(
        "deals.expectedClose"
      )}
    </p>

    <div
      className="
        mt-1

        flex
        items-center
        gap-2

        text-xs
        text-white/50
      "
    >
      <Calendar
        size={12}
      />

      {new Date(
        deal.expected_close_date
      ).toLocaleDateString()}
    </div>
  </div>
)}
          

          {deal.owner?.full_name && (
  <div>
    <p
      className="
        text-xs
        text-white/40
      "
    >
      {t(
        "deals.owner"
      )}
    </p>

    <div
      className="
        mt-1

        flex
        items-center
        gap-2

        text-xs
        text-white/50
      "
    >
      <User
        size={12}
      />

      {
        deal.owner
          .full_name
      }
    </div>
  </div>
)}
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <OrbitButton
            variant="secondary"
            disabled={
              !canMoveBack
            }
            onClick={
              onMoveBack
            }
          >
            <ChevronLeft
              size={14}
            />
          </OrbitButton>

          <OrbitButton
            className="
              flex-1
            "
            variant="secondary"
            onClick={() =>
              router.push(
                `/dashboard/deals/${deal.id}`
              )
            }
          >
            {t(
              "deals.open"
            )}
          </OrbitButton>

          <OrbitButton
            disabled={
              !canMoveForward
            }
            onClick={
              onMoveForward
            }
          >
            <ChevronRight
              size={14}
            />
          </OrbitButton>
        </div>
      </div>
    </OrbitCard>
  );
}