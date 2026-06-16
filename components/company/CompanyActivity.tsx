"use client";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitEmptyState
from "@/components/ui/OrbitEmptyState";

import { Activity }
from "lucide-react";

import { WorkspaceActivity } from "@/types/activity";

type Props = {
  activity: WorkspaceActivity[];
};

export default function CompanyActivity({
  activity,
}: Props) {
  return (
    <OrbitSection>
      <OrbitHeading
        badge="Operations Timeline"
        title="Relationship Activity"
        subtitle="
          Historical relationship
          interactions and operational events.
        "
      />

      {activity.length === 0 && (
        <OrbitEmptyState
          title="No activity"
          description="
            Relationship activity
            will appear here.
          "
          icon={Activity}
        />
      )}

      <div
        className="
          mt-6
          space-y-3
        "
      >
        {activity.map(
          (item) => (
            <OrbitCard
              key={item.id}
              className="
                p-4
              "
            >
              <div
                className="
                  flex
                  justify-between
                  gap-4
                "
              >
                <div>
                  <h3
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-2

                      text-sm
                      text-white/60
                    "
                  >
                    {
                      item.description ||
                      item.message
                    }
                  </p>
                </div>

                <p
                  className="
                    whitespace-nowrap

                    text-xs
                    text-white/40
                  "
                >
                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}
                </p>
              </div>
            </OrbitCard>
          )
        )}
      </div>
    </OrbitSection>
  );
}