"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp, Trophy, XCircle, Briefcase } from "lucide-react";
import Link from "next/link";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiStatCard from "@/components/ui/GunimiStatCard";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { Deal } from "@/types/deal";
import type { WorkspaceDealStage } from "@/types/dealStage";

type FunnelRow = {
  stage: WorkspaceDealStage;
  count: number;
  value: number;
  avgValue: number;
  widthPct: number;
};

type Props = {
  deals: Deal[];
  stages: WorkspaceDealStage[];
};

export default function DealsPipelineAnalytics({ deals, stages }: Props) {
  const t = useTranslations("deals");

  const openDeals  = useMemo(() => deals.filter((d) => d.stage !== "won" && d.stage !== "lost"), [deals]);
  const wonDeals   = useMemo(() => deals.filter((d) => d.stage === "won"), [deals]);
  const lostDeals  = useMemo(() => deals.filter((d) => d.stage === "lost"), [deals]);
  const closedCount = wonDeals.length + lostDeals.length;

  const winRate = closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : null;
  const pipelineValue = useMemo(() => openDeals.reduce((s, d) => s + Number(d.value || 0), 0), [openDeals]);
  const avgDealValue  = openDeals.length > 0 ? pipelineValue / openDeals.length : null;
  const wonValue      = useMemo(() => wonDeals.reduce((s, d) => s + Number(d.value || 0), 0), [wonDeals]);

  const funnelStages = useMemo(() => stages.filter((s) => !s.is_won && !s.is_lost), [stages]);

  const funnelRows: FunnelRow[] = useMemo(() => {
    const rows = funnelStages.map((stage) => {
      const sd = deals.filter((d) => d.stage === stage.slug);
      const value = sd.reduce((s, d) => s + Number(d.value || 0), 0);
      return { stage, count: sd.length, value, avgValue: sd.length > 0 ? value / sd.length : 0, widthPct: 0 };
    });
    const maxCount = Math.max(...rows.map((r) => r.count), 1);
    return rows.map((r) => ({ ...r, widthPct: Math.max((r.count / maxCount) * 100, r.count > 0 ? 6 : 0) }));
  }, [deals, funnelStages]);

  const KNOWN_SLUGS = new Set(["lead", "qualified", "proposal", "negotiation", "won", "lost"]);
  function stageName(stage: WorkspaceDealStage) {
    return KNOWN_SLUGS.has(stage.slug)
      ? t(stage.slug as "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost")
      : stage.name;
  }

  return (
    <div className="space-y-6">
      {/* SUMMARY METRICS */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <GunimiStatCard
          title={t("analyticsOpenDeals")}
          value={openDeals.length}
          icon={Briefcase}
          animated
        />
        <GunimiStatCard
          title={t("analyticsPipelineValue")}
          value={formatCurrency(pipelineValue)}
          icon={TrendingUp}
        />
        <GunimiStatCard
          title={t("analyticsWinRate")}
          value={winRate !== null ? `${winRate}%` : "—"}
          icon={Trophy}
          animated={winRate !== null}
        />
        <GunimiStatCard
          title={t("analyticsAvgDeal")}
          value={avgDealValue !== null ? formatCurrency(avgDealValue) : "—"}
          icon={TrendingUp}
        />
      </div>

      {/* FUNNEL */}
      <GunimiCard className="p-6">
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          {t("analyticsFunnel")}
        </p>

        {funnelRows.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-600">{t("analyticsNoData")}</p>
        ) : (
          <div className="space-y-3">
            {funnelRows.map((row, idx) => (
              <div key={row.stage.id} className="group flex items-center gap-4">
                {/* Stage index */}
                <span className="w-4 shrink-0 text-right text-[10px] text-zinc-600">
                  {idx + 1}
                </span>

                {/* Stage name */}
                <span className="w-28 shrink-0 truncate text-xs font-medium text-white/70">
                  {stageName(row.stage)}
                </span>

                {/* Bar */}
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-white/[0.03]">
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-violet-600/60 to-violet-500/40 transition-all duration-500"
                      style={{ width: `${row.widthPct}%` }}
                    />
                    {row.count > 0 && (
                      <span className="absolute inset-y-0 left-3 flex items-center text-[10px] font-semibold text-white/80">
                        {row.count}
                      </span>
                    )}
                  </div>

                  {/* Value */}
                  <span className="w-24 shrink-0 text-right text-xs text-white/50">
                    {row.count > 0 ? formatCurrency(row.value) : "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GunimiCard>

      {/* OUTCOMES */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* WON */}
        <GunimiCard className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <Trophy size={13} className="text-emerald-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
              {t("analyticsWon")}
            </span>
          </div>

          {wonDeals.length === 0 ? (
            <p className="py-4 text-center text-xs text-zinc-600">{t("analyticsNoWon")}</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold text-emerald-400">{wonDeals.length}</span>
                <span className="text-sm font-medium text-emerald-400/70">{formatCurrency(wonValue)}</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {wonDeals.slice(0, 5).map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/dashboard/deals/${deal.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-emerald-500/[0.06]"
                  >
                    <span className="truncate text-xs text-white/70">{deal.title}</span>
                    <span className="ml-3 shrink-0 text-xs text-emerald-400/60">
                      {formatCurrency(Number(deal.value || 0))}
                    </span>
                  </Link>
                ))}
                {wonDeals.length > 5 && (
                  <p className="pt-1 text-center text-[10px] text-zinc-600">
                    +{wonDeals.length - 5} {t("analyticsMore")}
                  </p>
                )}
              </div>
            </div>
          )}
        </GunimiCard>

        {/* LOST */}
        <GunimiCard className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <XCircle size={13} className="text-zinc-500" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {t("analyticsLost")}
            </span>
          </div>

          {lostDeals.length === 0 ? (
            <p className="py-4 text-center text-xs text-zinc-600">{t("analyticsNoLost")}</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold text-zinc-400">{lostDeals.length}</span>
                <span className="text-sm font-medium text-zinc-500">
                  {formatCurrency(lostDeals.reduce((s, d) => s + Number(d.value || 0), 0))}
                </span>
              </div>
              <div className="mt-3 space-y-1.5">
                {lostDeals.slice(0, 5).map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/dashboard/deals/${deal.id}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0">
                      <span className="block truncate text-xs text-white/40">{deal.title}</span>
                      {deal.lost_reason && (
                        <span className="block truncate text-[10px] text-zinc-600">{deal.lost_reason}</span>
                      )}
                    </div>
                    <span className="ml-3 shrink-0 text-xs text-zinc-500">
                      {formatCurrency(Number(deal.value || 0))}
                    </span>
                  </Link>
                ))}
                {lostDeals.length > 5 && (
                  <p className="pt-1 text-center text-[10px] text-zinc-600">
                    +{lostDeals.length - 5} {t("analyticsMore")}
                  </p>
                )}
              </div>
            </div>
          )}
        </GunimiCard>
      </div>
    </div>
  );
}
