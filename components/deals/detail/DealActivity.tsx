"use client";

import {
  Clock3,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitEmptyState
from "@/components/ui/OrbitEmptyState";

type Props = {
  activities: any[];
};

export default function DealActivity({
  activities,
}: Props) {
  const t =
    useTranslations(
      "deals"
    );

  return (
    <OrbitCard
      className="
        p-6
      "
    >
      <OrbitHeading
        title={t(
          "activity"
        )}
      />

      {activities.length ===
        0 && (
        <div
          className="
            mt-6
          "
        >
          <OrbitEmptyState
            title={t(
              "noActivity"
            )}
            description={t(
              "noActivityDescription"
            )}
            icon={Clock3}
          />
        </div>
      )}

      {activities.length >
        0 && (
        <div
          className="
            mt-6
            space-y-4
          "
        >
          {activities.map(
            (
              activity
            ) => (
              <div
                key={
                  activity.id
                }
                className="
                  relative

                  rounded-xl

                  border
                  border-white/[0.08]

                  bg-white/[0.02]

                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-start
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
                      {
                        activity.title
                      }
                    </h3>

                    {activity.description && (
                      <p
                        className="
                          mt-2

                          text-sm
                          text-white/60
                        "
                      >
                        {
                          activity.description
                        }
                      </p>
                    )}

                    {activity.user
                      ?.full_name && (
                      <p
                        className="
                          mt-3

                          text-xs
                          text-white/40
                        "
                      >
                        {
                          activity
                            .user
                            .full_name
                        }
                      </p>
                    )}
                  </div>

                  <div
                    className="
                      text-right
                    "
                  >
                    <p
                      className="
                        text-xs
                        text-white/40
                      "
                    >
                      {new Date(
                        activity.created_at
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </OrbitCard>
  );
}