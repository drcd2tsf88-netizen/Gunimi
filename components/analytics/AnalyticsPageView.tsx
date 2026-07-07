"use client";

import { useTranslations } from "next-intl";

import {
  Building2,
  TrendingUp,
  CheckSquare2,
  Users,
  CalendarDays,
  Mail,
} from "lucide-react";

import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiSection from "@/components/layout/GunimiSection";
import GunimiStatCard from "@/components/ui/GunimiStatCard";
import GunimiCard from "@/components/ui/GunimiCard";

import { AnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import { AnalyticsCharts } from "@/server/actions/analytics/getAnalyticsCharts";

type Props = {
  stats: AnalyticsOverview;
  charts: AnalyticsCharts;
};

// ─── Pipeline Funnel Chart ────────────────────────────────────────────────────

function PipelineFunnelChart({
  dealsByStage,
  t,
}: {
  dealsByStage: AnalyticsCharts["dealsByStage"];
  t: ReturnType<typeof useTranslations<"analytics">>;
}) {
  const td = useTranslations("deals");
  const maxCount = Math.max(...dealsByStage.map((s) => s.count), 1);
  const total = dealsByStage.reduce((sum, s) => sum + s.count, 0);

  const STAGE_COLORS: Record<string, string> = {
    lead: "bg-zinc-500/60",
    qualified: "bg-blue-500/60",
    proposal: "bg-violet-500/60",
    negotiation: "bg-amber-500/60",
    won: "bg-emerald-500/70",
  };

  const stageLabel = (stage: string): string => {
    const map: Record<string, string> = {
      lead: td("lead"),
      qualified: td("qualified"),
      proposal: td("proposal"),
      negotiation: td("negotiation"),
      won: td("won"),
    };
    return map[stage] ?? stage;
  };

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-white/30">{t("noDealsData")}</p>
        <p className="mt-1 text-xs text-white/20">{t("noDealsDataDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      {dealsByStage.map((s) => {
        const pct = maxCount > 0 ? Math.round((s.count / maxCount) * 100) : 0;
        const color = STAGE_COLORS[s.stage] ?? "bg-violet-500/60";
        return (
          <div key={s.stage}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs capitalize text-white/60">{stageLabel(s.stage)}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs tabular-nums text-white/40">{s.count}</span>
                {s.value > 0 && (
                  <span className="text-[10px] tabular-nums text-white/25">
                    ${s.value.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-right text-[11px] text-white/25">
        {total} {t("totalDeals")}
      </p>
    </div>
  );
}

// ─── Monthly Bar Chart ────────────────────────────────────────────────────────

function MonthlyDealsChart({
  monthlyDeals,
  t,
}: {
  monthlyDeals: AnalyticsCharts["monthlyDeals"];
  t: ReturnType<typeof useTranslations<"analytics">>;
}) {
  const maxCount = Math.max(...monthlyDeals.map((m) => m.count), 1);
  const total = monthlyDeals.reduce((sum, m) => sum + m.count, 0);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-white/30">{t("noDealsData")}</p>
        <p className="mt-1 text-xs text-white/20">{t("noDealsDataDesc")}</p>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="flex h-28 items-end gap-2">
        {monthlyDeals.map((m) => {
          const heightPct = maxCount > 0 ? Math.round((m.count / maxCount) * 100) : 0;
          return (
            <div key={m.month} className="group flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] tabular-nums text-white/0 transition-all group-hover:text-white/40">
                {m.count > 0 ? m.count : ""}
              </span>
              <div className="relative h-24 w-full overflow-hidden rounded-t-sm bg-white/[0.04]">
                <div
                  className="absolute bottom-0 left-0 right-0 rounded-t-sm bg-violet-500/50 transition-all duration-700 group-hover:bg-violet-500/70"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        {monthlyDeals.map((m) => (
          <div key={m.month} className="flex-1 text-center">
            <span className="text-[9px] text-white/25">{m.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-right text-[11px] text-white/25">
        {total} {t("totalDeals")} {t("lastSixMonths")}
      </p>
    </div>
  );
}

// ─── Win Rate Chart ───────────────────────────────────────────────────────────

function WinRateChart({
  wonVsLost,
  t,
}: {
  wonVsLost: AnalyticsCharts["wonVsLost"];
  t: ReturnType<typeof useTranslations<"analytics">>;
}) {
  const { won, lost, wonValue } = wonVsLost;
  const total = won + lost;
  const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-white/30">{t("noClosedDeals")}</p>
        <p className="mt-1 text-xs text-white/20">{t("noClosedDealsDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pt-2">
      {/* Big win rate number */}
      <div className="flex items-end gap-3">
        <span className="text-5xl font-semibold tabular-nums text-white/90">{winRate}%</span>
        <span className="mb-1.5 text-sm text-white/40">{t("winRateLabel")}</span>
      </div>

      {/* Split bar */}
      <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="flex h-full">
          <div
            className="h-full rounded-l-full bg-emerald-500/60 transition-all duration-700"
            style={{ width: `${winRate}%` }}
          />
          <div
            className="h-full rounded-r-full bg-red-500/40 transition-all duration-700"
            style={{ width: `${100 - winRate}%` }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500/60" />
            <span className="text-xs text-white/50">{t("wonLabel")}</span>
          </div>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{won}</p>
          {wonValue > 0 && (
            <p className="mt-0.5 text-xs text-white/30">${wonValue.toLocaleString()}</p>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500/40" />
            <span className="text-xs text-white/50">{t("lostLabel")}</span>
          </div>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{lost}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Chart Card Shell ─────────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <GunimiCard className="p-6">
      <div className="mb-4 border-b border-white/[0.05] pb-4">
        <p className="text-sm font-semibold text-white/90">{title}</p>
        <p className="mt-0.5 text-xs text-white/35">{subtitle}</p>
      </div>
      {children}
    </GunimiCard>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function AnalyticsPageView({ stats, charts }: Props) {
  const t = useTranslations("analytics");

  return (
    <div className="space-y-8">
      {/* HEADER + STAT CARDS */}
      <GunimiSection>
        <GunimiHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <GunimiStatCard
            title={t("statCompanies")}
            value={stats.companies}
            icon={Building2}
            animated
          />
          <GunimiStatCard
            title={t("statDeals")}
            value={stats.deals}
            icon={TrendingUp}
            animated
          />
          <GunimiStatCard
            title={t("statOpenTasks")}
            value={stats.openTasks}
            icon={CheckSquare2}
            animated
          />
          <GunimiStatCard
            title={t("statMembers")}
            value={stats.members}
            icon={Users}
            animated
          />
          <GunimiStatCard
            title={t("statUpcomingMeetings")}
            value={stats.upcomingMeetings}
            icon={CalendarDays}
            animated
          />
          <GunimiStatCard
            title={t("statEmailThreads")}
            value={stats.emailThreads}
            icon={Mail}
            animated
          />
        </div>
      </GunimiSection>

      {/* CHARTS ROW 1 */}
      <GunimiSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={t("pipelineFunnelTitle")}
            subtitle={t("pipelineFunnelSubtitle")}
          >
            <PipelineFunnelChart dealsByStage={charts.dealsByStage} t={t} />
          </ChartCard>

          <ChartCard
            title={t("monthlyDealsTitle")}
            subtitle={t("monthlyDealsSubtitle")}
          >
            <MonthlyDealsChart monthlyDeals={charts.monthlyDeals} t={t} />
          </ChartCard>
        </div>
      </GunimiSection>

      {/* CHARTS ROW 2 */}
      <GunimiSection>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title={t("winRateTitle")}
            subtitle={t("winRateSubtitle")}
          >
            <WinRateChart wonVsLost={charts.wonVsLost} t={t} />
          </ChartCard>

          <ChartCard
            title={t("revenueTitle")}
            subtitle={t("revenueSubtitle")}
          >
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-xs text-white/40">{t("pipelineValue")}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums">
                  ${charts.dealsByStage
                    .filter((s) => s.stage !== "won")
                    .reduce((sum, s) => sum + s.value, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="h-px bg-white/[0.05]" />
              <div>
                <p className="text-xs text-white/40">{t("wonRevenue")}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums text-emerald-300/80">
                  ${charts.wonVsLost.wonValue.toLocaleString()}
                </p>
              </div>
              <div className="h-px bg-white/[0.05]" />
              <div>
                <p className="text-xs text-white/40">{t("totalPipeline")}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums text-violet-300/80">
                  ${(
                    charts.dealsByStage.reduce((sum, s) => sum + s.value, 0) +
                    charts.wonVsLost.wonValue
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </ChartCard>
        </div>
      </GunimiSection>
    </div>
  );
}
