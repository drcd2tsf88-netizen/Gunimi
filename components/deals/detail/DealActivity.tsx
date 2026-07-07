"use client";

import {
  Clock3,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import GunimiCard
from "@/components/ui/GunimiCard";

import GunimiHeading
from "@/components/ui/GunimiHeading";

import GunimiEmptyState
from "@/components/ui/GunimiEmptyState";

import { WorkspaceActivity } from "@/types/activity";

type Props = {
  activities: WorkspaceActivity[];
};

export default function DealActivity({
  activities,
}: Props) {
  const t =
    useTranslations(
      "deals"
    );

  return (
    <GunimiCard
      className="
        p-6
      "
    >
      <GunimiHeading
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
          <GunimiEmptyState
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
    </GunimiCard>
  );
}