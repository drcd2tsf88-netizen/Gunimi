"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { ArrowRight, Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";

import OrbitEmptyState from "@/components/ui/OrbitEmptyState";
import { Deal } from "@/types/deal";

type DealStage =
  | "lead"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

type Props = {
  deals: Deal[];
  stage: DealStage;
};

export default function DealsListView({ deals, stage }: Props) {
  const router = useRouter();
  const t = useTranslations("deals");

  if (deals.length === 0) {
    return (
      <div
        className="
          flex
          flex-1
          items-center
          justify-center

          py-16
        "
      >
        <OrbitEmptyState
          title={t("noDeals")}
          description={t("noDealsDescription")}
          icon={Briefcase}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* TABLE HEADER */}

      <div
        className="
          grid
          grid-cols-[1fr_180px_110px_110px_32px]
          items-center
          gap-4

          border-b
          border-white/[0.06]

          px-5
          py-2.5
        "
      >
        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.14em]

            text-zinc-600
          "
        >
          {t("opportunityName")}
        </span>

        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.14em]

            text-zinc-600
          "
        >
          {t("company")}
        </span>

        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.14em]

            text-zinc-600
          "
        >
          {t("value")}
        </span>

        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.14em]

            text-zinc-600
          "
        >
          {t("closeDate")}
        </span>

        <span />
      </div>

      {/* ROWS */}

      {deals.map((deal) => {
        const closeLabel = deal.expected_close_date
          ? new Date(
              deal.expected_close_date
            ).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
          : "—";

        return (
          <div
            key={deal.id}
            role="button"
            tabIndex={0}
            onClick={() =>
              router.push(`/dashboard/deals/${deal.id}`)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/dashboard/deals/${deal.id}`);
            }}
            className="
              group

              grid
              grid-cols-[1fr_180px_110px_110px_32px]
              items-center
              gap-4

              border-b
              border-white/[0.04]

              px-5
              py-3.5

              text-left

              transition-all
              cursor-pointer

              hover:bg-white/[0.025]
              focus-visible:outline-none
              focus-visible:bg-white/[0.025]
            "
          >
            <p
              className="
                truncate
                text-sm
                font-medium
                text-white
              "
            >
              {deal.title}
            </p>

            {deal.company?.id ? (
              <Link
                href={`/dashboard/companies/${deal.company.id}`}
                onClick={(e) => e.stopPropagation()}
                className="
                  truncate
                  text-sm
                  text-white/45
                  transition-colors
                  hover:text-violet-300
                  focus-visible:outline-none
                  focus-visible:underline
                "
              >
                {deal.company.name}
              </Link>
            ) : (
              <p className="truncate text-sm text-white/45">—</p>
            )}

            <p
              className="
                text-sm
                font-medium
                text-white
              "
            >
              €{Number(deal.value || 0).toLocaleString()}
            </p>

            <p
              className="
                text-sm
                text-white/45
              "
            >
              {closeLabel}
            </p>

            <ArrowRight
              size={13}
              className="
                text-white/20

                transition-colors

                group-hover:text-white/50
              "
            />
          </div>
        );
      })}
    </div>
  );
}
