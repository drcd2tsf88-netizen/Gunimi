"use client";

import { motion }
from "framer-motion";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

import OrbitSkeleton
from "@/components/ui/OrbitSkeleton";

type ActivityItem = {
  id: string;

  type: string;

  title: string;

  description: string;

  created_at: string;
};

type DashboardActivityProps = {
  loading: boolean;

  activity: ActivityItem[];
};

export default function DashboardActivity({
  loading,

  activity,
}: DashboardActivityProps) {
  function cleanText(
    text?: string
  ) {
    if (!text) {
      return "Workspace event";
    }

    return text
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  return (
    <OrbitSection>
      <OrbitHeading
        badge="Workspace Feed"
        title="AI Activity Stream"
        subtitle="
          Realtime AI workspace activity,
          automation events and
          productivity insights.
        "
      />

      <div
        className="
          mt-6
          space-y-3
        "
      >
        {loading &&
          [1, 2, 3].map(
            (item) => (
              <OrbitSkeleton
                key={item}
              />
            )
          )}

        {!loading &&
          activity.length ===
            0 && (
            <OrbitCard className="p-8">
              <h3
                className="
                  text-lg
                  font-medium
                "
              >
                No activity yet
              </h3>

              <p
                className="
                  mt-2

                  text-sm
                  text-white/50
                "
              >
                Orbit AI events
                will appear here
                live.
              </p>
            </OrbitCard>
          )}

        {!loading &&
          activity.map(
            (
              item,
              index
            ) => (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    index * 0.05,
                }}
              >
                <OrbitCard className="p-4">
                  <div
                    className="
                     flex flex-col gap-4 md:flex-row md:items-start md:justify-between
                    "
                  >
                    <div>
                      <div
                        className="
                          inline-flex

                          rounded-full

                          border
                          border-violet-500/20

                          bg-violet-500/10

                          px-3
                          py-1

                          text-xs
                          uppercase

                          tracking-wide

                          text-violet-300
                        "
                      >
                        {cleanText(
                          item.type
                        )}
                      </div>

                      <h3
                        className="
                          mt-3

                          text-base
                          font-semibold
                          line-clamp-2
                        "
                      >
                        {cleanText(
                          item.title
                        )}
                      </h3>

                      <p
                        className="
                          mt-3

                          text-sm
                          leading-relaxed
                          text-white/60
                        "
                      >
                        {cleanText(
                          item.description
                        )}
                      </p>
                    </div>

                    <div
                      className="
                        whitespace-nowrap

                        text-sm
                        text-white/40
                      "
                    >
                      {new Date(
                        item.created_at
                      ).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </OrbitCard>
              </motion.div>
            )
          )}
      </div>
    </OrbitSection>
  );
}