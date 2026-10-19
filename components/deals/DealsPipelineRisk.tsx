"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { AlertTriangle, ShieldCheck, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import { computeDealHealth } from "@/lib/deals/dealHealth";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { Deal } from "@/types/deal";

const MS_PER_DAY = 86_400_000;

type RiskReasonKey =
  | "riskHealthy"
  | "riskNoActivity"
  | "riskPastCloseDate"
  | "riskClosingSoon"
  | "riskNoCloseDate";

type DealWithRisk = {
  deal: Deal;
  score: number;
  tier: "healthy" | "warning" | "at_risk";
  dotClass: string;
  textClass: string;
  badgeClass: string;
  barClass: string;
  reasonKey: RiskReasonKey;
  reasonDays: number | null;
};

function getRiskReason(deal: Deal): { key: RiskReasonKey; days: number | null } {
  const daysSinceActivity = deal.updated_at
    ? Math.floor((Date.now() - new Date(deal.updated_at).getTime()) / MS_PER_DAY)
    : 30;

  if (!deal.expected_close_date) {
    return { key: "riskNoCloseDate", days: null };
  }

  const daysUntilClose = Math.floor(
    (new Date(deal.expected_close_date).getTime() - Date.now()) / MS_PER_DAY,
  );

  if (daysUntilClose < 0) return { key: "riskPastCloseDate", days: Math.abs(daysUntilClose) };
  if (daysUntilClose <= 7) return { key: "riskClosingSoon", days: daysUntilClose };
  if (daysSinceActivity >= 14) return { key: "riskNoActivity", days: daysSinceActivity };

  return { key: "riskHealthy", days: null };
}

type Props = {
  deals: Deal[];
};

export default function DealsPipelineRisk({ deals }: Props) {
  const t = useTranslations("deals");
  const router = useRouter();

  const openDeals = useMemo(
    () => deals.filter((d) => d.stage !== "won" && d.stage !== "lost"),
    [deals],
  );

  const rankedDeals = useMemo<DealWithRisk[]>(() => {
    return openDeals
      .map((deal) => {
        const health = computeDealHealth(
          deal.probability,
          deal.updated_at,
          deal.expected_close_date,
          deal.stage,
        );
        const { key, days } = getRiskReason(deal);
        return {
          deal,
          score: health.score,
          tier: health.tier,
          dotClass: health.dotClass,
          textClass: health.textClass,
          badgeClass: health.badgeClass,
          barClass: health.barClass,
          reasonKey: key,
          reasonDays: days,
        };
      })
      .sort((a, b) => a.score - b.score);
  }, [openDeals]);

  const atRisk   = rankedDeals.filter((d) => d.tier === "at_risk");
  const warning  = rankedDeals.filter((d) => d.tier === "warning");
  const healthy  = rankedDeals.filter((d) => d.tier === "healthy");

  const atRiskValue  = atRisk.reduce((s, d) => s + Number(d.deal.value ?? 0), 0);
  const warningValue = warning.reduce((s, d) => s + Number(d.deal.value ?? 0), 0);
  const healthyValue = healthy.reduce((s, d) => s + Number(d.deal.value ?? 0), 0);

  if (openDeals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShieldCheck size={36} className="mb-4 text-emerald-400/60" />
        <p className="text-[14px] text-zinc-500">{t("riskNoDeals")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          count={atRisk.length}
          value={atRiskValue}
          label={t("riskAtRiskCount", { count: atRisk.length })}
          icon={ShieldX}
          colorClass="text-red-400"
          bgClass="bg-red-500/[0.06] border-red-500/[0.12]"
          barClass="bg-red-400"
        />
        <SummaryCard
          count={warning.length}
          value={warningValue}
          label={t("riskWarningCount", { count: warning.length })}
          icon={AlertTriangle}
          colorClass="text-amber-400"
          bgClass="bg-amber-500/[0.06] border-amber-500/[0.12]"
          barClass="bg-amber-400"
        />
        <SummaryCard
          count={healthy.length}
          value={healthyValue}
          label={t("riskHealthyCount", { count: healthy.length })}
          icon={ShieldCheck}
          colorClass="text-emerald-400"
          bgClass="bg-emerald-500/[0.06] border-emerald-500/[0.12]"
          barClass="bg-emerald-400"
        />
      </div>

      {/* Ranked deal list */}
      <div className="overflow-hidden rounded-[16px] border border-white/[0.06] bg-[#0A0E17]">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/[0.04] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-500 sm:grid-cols-[2fr_1fr_auto_auto]">
          <span>{t("opportunity")}</span>
          <span className="hidden sm:block">{t("stage")}</span>
          <span className="hidden sm:block">{t("value")}</span>
          <span>{t("dealHealth")}</span>
        </div>

        {rankedDeals.map((item) => {
          const { deal } = item;
          const reasonText = item.reasonDays !== null
            ? t(item.reasonKey, { days: item.reasonDays })
            : t(item.reasonKey);

          return (
            <button
              key={deal.id}
              type="button"
              onClick={() => router.push(`/dashboard/deals/${deal.id}`)}
              className="grid w-full grid-cols-[1fr_auto] gap-4 border-b border-white/[0.03] px-5 py-4 last:border-0 text-left transition-colors hover:bg-white/[0.02] sm:grid-cols-[2fr_1fr_auto_auto]"
            >
              {/* Name + reason */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", item.dotClass)} />
                  <p className="truncate text-[13px] font-medium text-white">{deal.title}</p>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                  {deal.company?.name ?? deal.contact?.name ?? "—"}
                  {" · "}
                  <span className={cn(
                    item.reasonKey === "riskHealthy" ? "text-zinc-500" : item.textClass,
                  )}>
                    {reasonText}
                  </span>
                </p>
              </div>

              {/* Stage */}
              <p className="hidden self-center text-[12px] capitalize text-zinc-400 sm:block">
                {deal.stage}
              </p>

              {/* Value */}
              <p className="hidden self-center text-[13px] font-semibold text-white sm:block">
                {deal.value != null ? formatCurrency(Number(deal.value)) : "—"}
              </p>

              {/* Score bar + badge */}
              <div className="flex flex-col items-end justify-center gap-1.5">
                <span className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                  item.badgeClass,
                )}>
                  {item.score}
                </span>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className={cn("h-full rounded-full transition-all", item.barClass)}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({
  count, value, label, icon: Icon, colorClass, bgClass, barClass,
}: {
  count: number;
  value: number;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  barClass: string;
}) {
  return (
    <div className={cn("rounded-[14px] border p-4", bgClass)}>
      <div className="flex items-center justify-between">
        <Icon size={16} className={colorClass} />
        <span className={cn("text-[22px] font-bold tabular-nums", colorClass)}>{count}</span>
      </div>
      <p className="mt-2 text-[11px] font-semibold text-zinc-400">{label}</p>
      {value > 0 && (
        <p className={cn("mt-0.5 text-[11px] tabular-nums", colorClass)}>
          {formatCurrency(value)}
        </p>
      )}
      {count > 0 && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.04]">
          <div className={cn("h-full rounded-full", barClass)} style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
