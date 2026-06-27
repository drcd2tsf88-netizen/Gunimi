"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Mail,
  TrendingUp,
  TriangleAlert,
  Users,
} from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";
import type { AnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import type { OnboardingStatus } from "@/server/actions/onboarding/getOnboardingStatus";
import type { PipelineBreakdown } from "@/server/actions/dashboard/getPipelineBreakdown";
import type { DashboardTask } from "./TodaysPrioritiesWidget";

type Priority = "critical" | "high" | "medium";

type Recommendation = {
  id: string;
  priority: Priority;
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
};

type Props = {
  tasks: DashboardTask[];
  analytics: AnalyticsOverview;
  onboardingStatus: OnboardingStatus;
  pipeline: PipelineBreakdown;
};

const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
};

const PRIORITY_STYLE: Record<Priority, string> = {
  critical: "border-red-500/20 bg-red-500/5",
  high: "border-amber-500/20 bg-amber-500/5",
  medium: "border-white/[0.06] bg-white/[0.02]",
};

const ICON_STYLE: Record<Priority, string> = {
  critical: "text-red-400",
  high: "text-amber-400",
  medium: "text-violet-400/70",
};

function buildTodayStr(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function OrbitRecommendationsWidget({
  tasks,
  analytics,
  onboardingStatus,
  pipeline,
}: Props) {
  const t = useTranslations("dashboard");
  const todayStr = buildTodayStr();

  const overdueCount = tasks.filter(
    (task) =>
      task.status !== "done" &&
      task.due_date &&
      task.due_date.split("T")[0] < todayStr
  ).length;

  const recommendations: Recommendation[] = [];

  if (overdueCount > 0) {
    recommendations.push({
      id: "overdue-tasks",
      priority: "critical",
      icon: AlertCircle,
      title: t("recOverdueTasks", { count: overdueCount }),
      description: t("recOverdueTasksDesc"),
      href: "/dashboard/tasks",
      actionLabel: t("recActNow"),
    });
  }

  if (pipeline.staleDealsCount > 0) {
    recommendations.push({
      id: "stale-deals",
      priority: "high",
      icon: TriangleAlert,
      title: t("recStaleDeals", { count: pipeline.staleDealsCount }),
      description: t("recStaleDealsDesc"),
      href: "/dashboard/deals",
      actionLabel: t("recReview"),
    });
  }

  if (!onboardingStatus.emailConnected) {
    recommendations.push({
      id: "connect-email",
      priority: "medium",
      icon: Mail,
      title: t("recConnectEmail"),
      description: t("recConnectEmailDesc"),
      href: "/dashboard/email",
      actionLabel: t("recConnect"),
    });
  }

  if (!onboardingStatus.calendarConnected) {
    recommendations.push({
      id: "connect-calendar",
      priority: "medium",
      icon: CalendarDays,
      title: t("recConnectCalendar"),
      description: t("recConnectCalendarDesc"),
      href: "/dashboard/calendar",
      actionLabel: t("recConnect"),
    });
  }

  if (onboardingStatus.contactsCount === 0) {
    recommendations.push({
      id: "first-contact",
      priority: "medium",
      icon: Users,
      title: t("recFirstContact"),
      description: t("recFirstContactDesc"),
      href: "/dashboard/crm",
      actionLabel: t("recStart"),
    });
  }

  if (analytics.deals === 0 && onboardingStatus.companiesCount > 0) {
    recommendations.push({
      id: "first-deal",
      priority: "medium",
      icon: TrendingUp,
      title: t("recFirstDeal"),
      description: t("recFirstDealDesc"),
      href: "/dashboard/deals",
      actionLabel: t("recStart"),
    });
  }

  const sorted = [...recommendations]
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    .slice(0, 5);

  return (
    <OrbitCard className="flex flex-col p-5">
      <div className="pb-4 border-b border-white/[0.06]">
        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {t("recommendationsBadge")}
        </p>
        <p className="mt-0.5 text-base font-semibold">{t("recommendations")}</p>
      </div>

      <div className="mt-4 flex-1 space-y-2.5">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="h-7 w-7 text-emerald-400/60" />
            <p className="mt-3 text-sm font-medium text-white/70">{t("noRecommendations")}</p>
            <p className="mt-1 text-xs text-white/30">{t("noRecommendationsDesc")}</p>
          </div>
        ) : (
          sorted.map((rec) => {
            const Icon = rec.icon;
            return (
              <Link key={rec.id} href={rec.href}>
                <div
                  className={`flex items-start gap-3 rounded-xl border px-3 py-3 transition-colors hover:brightness-110 ${PRIORITY_STYLE[rec.priority]}`}
                >
                  <Icon
                    size={14}
                    className={`mt-0.5 shrink-0 ${ICON_STYLE[rec.priority]}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/85">{rec.title}</p>
                    <p className="mt-0.5 text-xs text-white/40">{rec.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wide text-violet-400/60">
                      {rec.actionLabel}
                    </span>
                    <ArrowRight size={10} className="text-white/25" />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </OrbitCard>
  );
}
