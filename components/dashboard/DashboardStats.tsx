"use client";

import {
  Activity,
  CheckSquare,
  Users,
} from "lucide-react";

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
  title="Open Tasks"
  value={String(
    stats.tasks -
    stats.completedTasks
  )}
  icon={CheckSquare}
/>

<OrbitStatCard
  title="Completed"
  value={String(
    stats.completedTasks
  )}
  icon={CheckSquare}
/>

<OrbitStatCard
  title="Contacts"
  value={String(
    stats.contacts
  )}
  icon={Users}
/>

<OrbitStatCard
  title="Activity"
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