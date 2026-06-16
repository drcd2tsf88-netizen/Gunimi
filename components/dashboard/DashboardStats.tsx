"use client";

import {
  Activity,
  CheckSquare,
  Users,
} from "lucide-react";

import { useTranslations }
from "next-intl";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitSkeleton
from "@/components/ui/OrbitSkeleton";

import OrbitMetricGrid
from "@/components/ui/OrbitMetricGrid";

type DashboardStatsProps = {
  loading: boolean;

  stats: {
    tasks: number;
    completedTasks: number;
    contacts: number;
    activity: number;
  };
};

export default function DashboardStats({
  loading,
  stats,
}: DashboardStatsProps) {
  const t = useTranslations("dashboard");

  if (loading) {
    return (
      <OrbitSection>
        <div
          className="
            grid
            gap-4

            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          <OrbitSkeleton />
          <OrbitSkeleton />
          <OrbitSkeleton />
          <OrbitSkeleton />
        </div>
      </OrbitSection>
    );
  }

  return (
    <OrbitMetricGrid
      items={[
        {
          label: t("openTasks"),
          value: String(stats.tasks - stats.completedTasks),
          icon: CheckSquare,
        },
        {
          label: t("completed"),
          value: String(stats.completedTasks),
          icon: CheckSquare,
        },
        {
          label: t("contacts"),
          value: String(stats.contacts),
          icon: Users,
        },
        {
          label: t("activityLabel"),
          value: String(stats.activity),
          icon: Activity,
        },
      ]}
      breakpoint="lg"
    />
  );
}
