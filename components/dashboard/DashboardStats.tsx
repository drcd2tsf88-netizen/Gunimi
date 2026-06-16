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

import OrbitStatCard
from "@/components/ui/OrbitStatCard";

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

  return (
    <OrbitSection>
      <div
        className="
          grid
          gap-3

          md:grid-cols-2
          lg:grid-cols-4
        "
      >
        {loading ? (
          <>
            <OrbitSkeleton />
            <OrbitSkeleton />
            <OrbitSkeleton />
            <OrbitSkeleton />
          </>
        ) : (
          <>
            <OrbitStatCard
  title={t("openTasks")}
  value={String(
    stats.tasks -
    stats.completedTasks
  )}
  icon={CheckSquare}
/>

<OrbitStatCard
  title={t("completed")}
  value={String(
    stats.completedTasks
  )}
  icon={CheckSquare}
/>

<OrbitStatCard
  title={t("contacts")}
  value={String(
    stats.contacts
  )}
  icon={Users}
/>

<OrbitStatCard
  title={t("activityLabel")}
  value={String(
    stats.activity
  )}
  icon={Activity}
/>
          </>
        )}
      </div>
    </OrbitSection>
  );
}