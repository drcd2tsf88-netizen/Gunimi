"use client";

import { useTranslations } from "next-intl";
import { Deal } from "@/types/deal";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type Props = {
  deals: Deal[];
};

export default function DealsMetricStrip({ deals }: Props) {
  const t = useTranslations("deals");

  const openDeals = deals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost"
  );
  const wonDeals = deals.filter((d) => d.stage === "won");
  const lostDeals = deals.filter((d) => d.stage === "lost");

  const pipelineValue = openDeals.reduce(
    (sum, d) => sum + Number(d.value || 0),
    0
  );
  const wonRevenue = wonDeals.reduce(
    (sum, d) => sum + Number(d.value || 0),
    0
  );
  const winRate =
    wonDeals.length + lostDeals.length > 0
      ? Math.round(
          (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100
        )
      : 0;

  const items = [
    {
      label: t("openOpportunities"),
      value: String(openDeals.length),
    },
    {
      label: t("pipelineValue"),
      value: formatCurrency(pipelineValue),
    },
    {
      label: t("wonRevenue"),
      value: formatCurrency(wonRevenue),
    },
    {
      label: t("winRate"),
      value: `${winRate}%`,
    },
  ];

  return (
    <div
      className="
        flex
        items-center
        gap-1

        border-b
        border-white/[0.06]

        pb-3
      "
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className="flex items-center"
        >
          {i > 0 && (
            <span
              className="
                mx-3

                text-white/20
              "
              aria-hidden
            >
              ·
            </span>
          )}

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <span
              className="
                text-xs
                text-zinc-500
              "
            >
              {item.label}
            </span>

            <span
              className="
                text-xs
                font-semibold
                text-white
              "
            >
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
