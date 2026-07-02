"use client";

import { useMemo } from "react";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import type { AnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";

export type DashboardActivityItem = {
  id: string;
  type?: string | null;
  title?: string | null;
  description?: string | null;
  created_at: string;
  company_id?: string | null;
  deal_id?: string | null;
  contact_id?: string | null;
};

type Props = {
  displayName: string;
  analytics: AnalyticsOverview;
  activities: DashboardActivityItem[];
  onOpenAI: () => void;
};

function formatEventLabel(type?: string | null, title?: string | null): string | null {
  if (title) return title;
  if (type) return type.replaceAll("_", " ");
  return null;
}

function getActivityHref(item: DashboardActivityItem): string | null {
  if (item.deal_id) return `/dashboard/deals/${item.deal_id}`;
  if (item.company_id) return `/dashboard/companies/${item.company_id}`;
  if (item.contact_id) return `/dashboard/contacts/${item.contact_id}`;
  return null;
}

export default function MorningSummaryWidget({
  displayName,
  analytics,
  activities,
  onOpenAI,
}: Props) {
  const t = useTranslations("dashboard");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("goodMorning") : hour < 18 ? t("goodAfternoon") : t("goodEvening");

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const recentActivities = useMemo(() => {
    const cutoff = new Date().getTime() - 24 * 60 * 60 * 1000;
    return activities.filter((a) => new Date(a.created_at).getTime() > cutoff);
  }, [activities]);

  const pulseStats = [
    { label: t("statsCompanies"), value: analytics.companies },
    { label: t("statsDeals"), value: analytics.deals },
    { label: t("statsMembers"), value: analytics.members },
  ];

  return (
    <OrbitCard className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t("commandCenter")}
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">
            {greeting}, {displayName}
          </h2>
          <p className="mt-1 text-xs text-white/35">{today}</p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <button
            onClick={onOpenAI}
            className="inline-flex items-center gap-2.5 rounded-2xl border border-violet-500/30 bg-violet-500/15 px-5 py-3 text-base font-semibold text-violet-200 shadow-lg shadow-violet-900/20 transition-all hover:border-violet-500/50 hover:bg-violet-500/25 hover:shadow-violet-900/40"
          >
            <Sparkles size={16} />
            {t("openOrbit")}
          </button>
          <p className="text-[11px] text-white/30 sm:text-right">{t("tagline")}</p>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <p className="text-[11px] text-emerald-300/70">{t("workspaceOperational")}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-white/[0.05] pt-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {pulseStats.map((stat) => (
            <div key={stat.label}>
              <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                {stat.label}
              </p>
              <p className="mt-1.5 text-3xl font-semibold tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {recentActivities.length > 0 && (
        <div className="mt-5 border-t border-white/[0.05] pt-4">
          <p className="mb-2.5 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            {t("workspaceChanges")}
          </p>
          <div className="flex flex-wrap gap-2">
            {recentActivities.slice(0, 8).map((item) => {
              const label = formatEventLabel(item.type, item.title);
              if (!label) return null;
              const href = getActivityHref(item);
              const className =
                "inline-flex rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-[11px] text-white/50";
              if (href) {
                return (
                  <Link
                    key={item.id}
                    href={href}
                    className={`${className} transition-colors hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white/75`}
                  >
                    {label}
                  </Link>
                );
              }
              return (
                <span key={item.id} className={className}>
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </OrbitCard>
  );
}
