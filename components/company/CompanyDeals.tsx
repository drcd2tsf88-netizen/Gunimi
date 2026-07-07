"use client";

import Link from "next/link";

import { motion }
from "framer-motion";

import {
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";
import GunimiSection
from "@/components/layout/GunimiSection";

import GunimiHeading
from "@/components/ui/GunimiHeading";

import GunimiCard
from "@/components/ui/GunimiCard";

import GunimiEmptyState
from "@/components/ui/GunimiEmptyState";

import { Deal } from "@/types/deal";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type Props = {
  deals: Deal[];
};

function getStageStyles(
  stage: string
) {
  switch (stage) {
    case "won":
      return `
        border-emerald-500/20
        bg-emerald-500/10
        text-emerald-300
      `;

    case "lost":
      return `
        border-rose-500/20
        bg-rose-500/10
        text-rose-300
      `;

    case "negotiation":
      return `
        border-orange-500/20
        bg-orange-500/10
        text-orange-300
      `;

    case "proposal":
      return `
        border-yellow-500/20
        bg-yellow-500/10
        text-yellow-300
      `;

    case "qualified":
      return `
        border-cyan-500/20
        bg-cyan-500/10
        text-cyan-300
      `;

    default:
      return `
        border-violet-500/20
        bg-violet-500/10
        text-violet-300
      `;
  }
}
export default function CompanyDeals({
  deals,
}: Props) {
  const t = useTranslations();

  return (
  
    <GunimiSection>
      <GunimiHeading
        badge={t(
  "deals.commercialPipeline"
)}
        title={t(
  "deals.commercialOpportunities"
)}
        subtitle={t(
  "deals.commercialPipelineSubtitle"
)}
      />

      {deals.length === 0 && (
        <GunimiEmptyState
          title={t("deals.noDeals")}
          description={t("deals.noDealsDescription")}
          icon={Briefcase}
        />
      )}

      {deals.length > 0 && (
        <div
          className="
            mt-6

            grid
            gap-4

            xl:grid-cols-2
          "
        >
          {deals.map(
            (
              deal,
              index
            ) => (
              <motion.div
                key={deal.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.05,
                }}
              >
                <Link
                  href={`/dashboard/deals/${deal.id}`}
                  className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                >
                <GunimiCard
                  className="
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-lg
                          font-semibold
                        "
                      >
                        {deal.title}
                      </h3>

                      {deal.description && (
                        <p
                          className="
                            mt-3

                            text-sm
                            text-white/60
                          "
                        >
                          {
                            deal.description
                          }
                        </p>
                      )}
                    </div>

                    <TrendingUp
                      className="
                        text-violet-300
                      "
                      size={18}
                    />
                  </div>

                  <div
                    className="
                      mt-5

                      flex
                      flex-wrap
                      gap-2
                    "
                  >
                    <div
                      className={`
                        rounded-full
                        border

                        px-3
                        py-1

                        text-xs

                        ${getStageStyles(
                          deal.stage
                        )}
                      `}
                    >
                      {
  t(
    `deals.${deal.stage}`
  )
}
                    </div>

                    <div
                      className="
                        rounded-full

                        border
                        border-white/10

                        bg-white/[0.03]

                        px-3
                        py-1

                        text-xs
                      "
                    >
                      {deal.probability}%
                    </div>
                  </div>

                  <div
                    className="
                      mt-5

                      grid
                      gap-4

                      md:grid-cols-3
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
                          mt-1
                          text-sm
                        "
                      >
                        {formatCurrency(Number(deal.value || 0))}
                      </p>
                    </div>

                    <div>
                      <p
                        className="
                          text-xs
                          text-white/40
                        "
                      >
                        {t("deals.owner")}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                        "
                      >
                        {
                          deal.owner
                            ?.full_name ||
                          t("deals.unassigned")
                        }
                      </p>
                    </div>

                    <div>
                      <p
                        className="
                          text-xs
                          text-white/40
                        "
                      >
                        {t("deals.expectedClose")}
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                        "
                      >
                        {deal.expected_close_date
                          ? new Date(
                              deal.expected_close_date
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                </GunimiCard>
                </Link>
              </motion.div>
            )
          )}
        </div>
      )}
    </GunimiSection>
  );
}