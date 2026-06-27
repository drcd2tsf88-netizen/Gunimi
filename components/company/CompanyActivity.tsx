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

import { useTranslations }
from "next-intl";

import { WorkspaceActivity } from "@/types/activity";

type Props = {
  activity: WorkspaceActivity[];
};

export default function CompanyActivity({
  activity,
}: Props) {
  const t = useTranslations("companies");

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t("operationsTimeline")}
        title={t("relationshipActivity")}
        subtitle={t("activitySubtitle")}
      />

      {activity.length === 0 && (
        <OrbitEmptyState
          title={t("noActivity")}
          description={t("noActivityDescription")}
          icon={Activity}
        />
      )}

      {activity.length > 0 && (
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
      )}
    </OrbitSection>
  );
}