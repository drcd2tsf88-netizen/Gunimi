"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import type { PipelineBreakdown } from "@/server/actions/dashboard/getPipelineBreakdown";
import type { DashboardTask } from "./TodaysPrioritiesWidget";

type Props = {
  tasks: DashboardTask[];
  pipeline: PipelineBreakdown;
};

const STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
};

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

export default function BusinessHealthWidget({ tasks, pipeline }: Props) {
  const t = useTranslations("dashboard");

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const maxCount = Math.max(...pipeline.stages.map((s) => s.count), 1);

  return (
    <OrbitCard className="flex flex-col p-5">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t("businessHealthBadge")}
          </p>
          <p className="mt-0.5 text-base font-semibold">{t("businessHealth")}</p>
        </div>
        <Link
          href="/dashboard/deals"
          className="text-[10px] uppercase tracking-[0.14em] text-violet-400/70 transition-colors hover:text-violet-300"
        >
          {t("viewAll")}
        </Link>
      </div>

      {/* Pipeline funnel */}
      <div className="mt-4 flex-1">
        <p className="mb-3 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          {t("pipelineBreakdown")}
        </p>

        {pipeline.stages.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center">
            <TrendingUp className="h-6 w-6 text-white/15" />
            <p className="mt-3 text-sm text-white/40">{t("noPipelineDeals")}</p>
            <Link
              href="/dashboard/deals"
              className="mt-2 text-xs text-violet-400/60 hover:text-violet-300"
            >
              {t("noPipelineDealsDesc")}
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pipeline.stages.map((stage) => {
              const widthPct = Math.round((stage.count / maxCount) * 100);
              return (
                <Link
                  key={stage.stage}
                  href={`/dashboard/deals?stage=${stage.stage}`}
                  className="group flex items-center gap-3 rounded-lg px-1 py-0.5 transition-colors hover:bg-white/[0.03]"
                >
                  <p className="w-24 shrink-0 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                    {STAGE_LABELS[stage.stage] ?? stage.stage}
                  </p>
                  <div className="flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-500"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <p className="w-6 shrink-0 text-right text-xs tabular-nums text-white/50 group-hover:text-white/70 transition-colors">
                    {stage.count}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-5 border-t border-white/[0.05] pt-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/analytics"
            className="group rounded-lg p-1 transition-colors hover:bg-white/[0.03]"
          >
            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
              {t("pipelineValueLabel")}
            </p>
            <p className="mt-1.5 text-lg font-semibold tabular-nums group-hover:text-violet-300 transition-colors">
              {formatCurrency(pipeline.totalActiveValue)}
            </p>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="group rounded-lg p-1 transition-colors hover:bg-white/[0.03]"
          >
            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
              {t("wonRevenueLabel")}
            </p>
            <p className="mt-1.5 text-lg font-semibold tabular-nums text-emerald-300 group-hover:text-emerald-200 transition-colors">
              {formatCurrency(pipeline.wonRevenue)}
            </p>
          </Link>
          <Link
            href="/dashboard/tasks"
            className="group rounded-lg p-1 transition-colors hover:bg-white/[0.03]"
          >
            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
              {t("taskVelocity")}
            </p>
            <p className="mt-1.5 text-lg font-semibold tabular-nums group-hover:text-violet-300 transition-colors">
              {completionPct}
              <span className="text-xs font-normal text-white/30">%</span>
            </p>
          </Link>
        </div>
      </div>
    </OrbitCard>
  );
}
