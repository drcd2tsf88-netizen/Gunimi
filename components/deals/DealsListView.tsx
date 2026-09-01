"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { ArrowRight, Briefcase, ChevronUp, ChevronDown, Pencil } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import { Deal } from "@/types/deal";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { computeDealHealth } from "@/lib/deals/dealHealth";

type Props = {
  deals: Deal[];
  stage: string;
  onEdit: (deal: Deal) => void;
};

type SortField = "title" | "value" | "close_date";
type SortDir = "asc" | "desc";

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field) return <ChevronUp size={10} className="opacity-20" />;
  return sortDir === "asc"
    ? <ChevronUp size={10} className="text-violet-400" />
    : <ChevronDown size={10} className="text-violet-400" />;
}

export default function DealsListView({ deals, onEdit }: Props) {
  const router = useRouter();
  const t = useTranslations("deals");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const sortedDeals = [...deals].sort((a, b) => {
    let cmp = 0;
    if (sortField === "title") {
      cmp = (a.title ?? "").localeCompare(b.title ?? "");
    } else if (sortField === "value") {
      cmp = Number(a.value ?? 0) - Number(b.value ?? 0);
    } else if (sortField === "close_date") {
      cmp = new Date(a.expected_close_date ?? "").getTime() - new Date(b.expected_close_date ?? "").getTime();
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

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
        <GunimiEmptyState
          title={t("noDeals")}
          description={t("noDealsDescription")}
          icon={Briefcase}
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
    <div className="flex min-w-[600px] flex-col">
      {/* TABLE HEADER */}

      <div
        className="
          grid
          grid-cols-[1fr_180px_110px_110px_64px]
          items-center
          gap-4

          border-b
          border-white/[0.06]

          px-5
          py-2.5
        "
      >
        <button
          onClick={() => handleSort("title")}
          className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          {t("opportunityName")}
          <SortIcon field="title" sortField={sortField} sortDir={sortDir} />
        </button>

        <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          {t("company")}
        </span>

        <button
          onClick={() => handleSort("value")}
          className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          {t("value")}
          <SortIcon field="value" sortField={sortField} sortDir={sortDir} />
        </button>

        <button
          onClick={() => handleSort("close_date")}
          className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          {t("closeDate")}
          <SortIcon field="close_date" sortField={sortField} sortDir={sortDir} />
        </button>

        <span />
      </div>

      {/* ROWS */}

      {sortedDeals.map((deal) => {
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
              grid-cols-[1fr_180px_110px_110px_64px]
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
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${computeDealHealth(deal.probability, deal.updated_at, deal.expected_close_date, deal.stage).dotClass}`}
                aria-hidden
              />
              <p className="truncate text-sm font-medium text-white">
                {deal.title}
              </p>
            </div>

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

            <div>
              <p className="text-sm font-medium text-white">
                {formatCurrency(Number(deal.value || 0), deal.currency)}
              </p>
              {(deal.paid_amount ?? 0) > 0 && (
                <p className="text-[11px] text-emerald-400/70">
                  {t("paid")}: {formatCurrency(Number(deal.paid_amount), deal.currency)}
                </p>
              )}
            </div>

            <p
              className="
                text-sm
                text-white/45
              "
            >
              {closeLabel}
            </p>

            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(deal);
                }}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center

                  rounded-md

                  text-white/20

                  opacity-100

                  transition-all

                  hover:bg-white/[0.06]
                  hover:text-white/60

                  sm:opacity-0
                  sm:group-hover:opacity-100
                "
              >
                <Pencil size={11} />
              </button>

              <ArrowRight
                size={13}
                className="
                  text-white/20

                  transition-colors

                  group-hover:text-white/50
                "
              />
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}
