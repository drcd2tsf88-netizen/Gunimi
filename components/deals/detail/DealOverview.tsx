"use client";

import {
  useTranslations,
} from "next-intl";

import GunimiCard
from "@/components/ui/GunimiCard";

import GunimiHeading
from "@/components/ui/GunimiHeading";

import { Deal } from "@/types/deal";

type Props = {
  deal: Deal;
};

export default function DealOverview({
  deal,
}: Props) {
  const t =
    useTranslations(
      "deals"
    );

  return (
    <GunimiCard
      className="
        p-6
      "
    >
      <GunimiHeading
        title={t(
          "overview"
        )}
      />

      <div
        className="
          mt-6
          space-y-6
        "
      >
        <div>
          <p
            className="
              text-xs
              text-white/40
            "
          >
            {t(
              "description"
            )}
          </p>

          <p
            className="
              mt-2
              text-sm
            "
          >
            {deal.description ||
              "—"}
          </p>
        </div>

        <div>
          <p
            className="
              text-xs
              text-white/40
            "
          >
            {t(
              "expectedClose"
            )}
          </p>

          <p
            className="
              mt-2
              text-sm
            "
          >
            {deal.expected_close_date
              ? new Date(
                  deal.expected_close_date
                ).toLocaleDateString()
              : "—"}
          </p>
        </div>

        {deal.lost_reason && (
          <div>
            <p
              className="
                text-xs
                text-white/40
              "
            >
              {t(
                "lostReason"
              )}
            </p>

            <p
              className="
                mt-2
                text-sm
              "
            >
              {
                deal.lost_reason
              }
            </p>
          </div>
        )}
      </div>
    </GunimiCard>
  );
}