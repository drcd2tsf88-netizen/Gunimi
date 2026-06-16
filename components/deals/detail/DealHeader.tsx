"use client";

import {
  TrendingUp,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import OrbitCard
from "@/components/ui/OrbitCard";

type Props = {
  deal: any;
};

export default function DealHeader({
  deal,
}: Props) {
  const t =
    useTranslations(
      "deals"
    );

  return (
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
        <div>
          <p
            className="
              text-xs
              uppercase
              tracking-[0.18em]
              text-zinc-500
            "
          >
            {t(
              "opportunity"
            )}
          </p>

          <h1
            className="
              mt-3

              text-3xl
              font-semibold
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
                text-white/60
              "
            >
              {deal.description}
            </p>
          )}
        </div>

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <TrendingUp
            size={18}
            className="
              text-violet-300
            "
          />

          <span
            className="
              rounded-full

              border
              border-violet-500/20

              bg-violet-500/10

              px-3
              py-1

              text-xs
              text-violet-300
            "
          >
            {t(
              deal.stage
            )}
          </span>
        </div>
      </div>
    </OrbitCard>
  );
}