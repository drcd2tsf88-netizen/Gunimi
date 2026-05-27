"use client";

import {
  Activity,
  CheckSquare,
  FileText,
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

    contacts: number;

    notes: number;

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
              title="Tasks"
              value={String(
                stats.tasks
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
              title="Notes"
              value={String(
                stats.notes
              )}
              icon={FileText}
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