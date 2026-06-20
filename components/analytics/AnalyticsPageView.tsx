"use client";

import { useTranslations } from "next-intl";

import {
  Building2,
  TrendingUp,
  CheckSquare2,
  Users,
  BarChart2,
  GitMerge,
  Sparkles,
  UserCheck,
} from "lucide-react";

import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitSection from "@/components/layout/OrbitSection";
import OrbitStatCard from "@/components/ui/OrbitStatCard";
import OrbitCard from "@/components/ui/OrbitCard";

import { AnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";

type Props = {
  stats: AnalyticsOverview;
};

const COMING_SOON_MODULES = [
  { key: "revenue", icon: BarChart2 },
  { key: "pipeline", icon: GitMerge },
  { key: "team", icon: UserCheck },
  { key: "ai", icon: Sparkles },
] as const;

export default function AnalyticsPageView({ stats }: Props) {
  const t = useTranslations("analytics");

  return (
    <div className="space-y-10">
      <OrbitSection>
        <OrbitHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OrbitStatCard
            title={t("statCompanies")}
            value={stats.companies}
            icon={Building2}
            animated
          />
          <OrbitStatCard
            title={t("statDeals")}
            value={stats.deals}
            icon={TrendingUp}
            animated
          />
          <OrbitStatCard
            title={t("statOpenTasks")}
            value={stats.openTasks}
            icon={CheckSquare2}
            animated
          />
          <OrbitStatCard
            title={t("statMembers")}
            value={stats.members}
            icon={Users}
            animated
          />
        </div>
      </OrbitSection>

      <OrbitSection>
        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {t("modulesLabel")}
          </p>
          <h2 className="mt-1.5 text-xl font-semibold">{t("modulesTitle")}</h2>
          <p className="mt-1 text-sm text-white/40">{t("modulesSubtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {COMING_SOON_MODULES.map(({ key, icon: Icon }) => (
            <OrbitCard key={key} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <Icon className="h-4 w-4 text-violet-300" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">
                      {t(`${key}Title` as Parameters<typeof t>[0])}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/40">
                      {t(`${key}Desc` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-300">
                  {t("comingSoonBadge")}
                </span>
              </div>
            </OrbitCard>
          ))}
        </div>
      </OrbitSection>
    </div>
  );
}
