"use client";

import {
  useEffect,
  useState,
} from "react";

import { useTranslations } from "next-intl";

import { motion }
from "framer-motion";

import CountUp
from "react-countup";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

import { supabase }
from "@/lib/supabase";

type ActivityItem = {
  id: string;

  type: string;

  title?: string;

  description?: string;

  message?: string;

  created_at: string;
};

export default function ActivityPage() {
  const t = useTranslations("activity");

  const [activity, setActivity] =
    useState<ActivityItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  function formatText(
    text?: string
  ) {
    if (!text) {
      return t("workspaceEvent");
    }

    return text
      .replaceAll("_", " ")
      .replaceAll("-", " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // LOAD ACTIVITY

  useEffect(() => {
    loadActivity();

    const channel =
      supabase
        .channel(
          "workspace-activity-live"
        )
        .on(
          "postgres_changes",
          {
            event: "*",

            schema: "public",

            table:
              "workspace_activity",
          },

          async () => {
            await loadActivity();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  async function loadActivity() {
    try {
      setLoading(true);

      const { data, error } =
        await supabase
          .from(
            "workspace_activity"
          )
          .select("*")
          .order(
            "created_at",
            {
              ascending: false,
            }
          )
          .limit(20);

      if (error) {
        console.error(error);

        return;
      }

      setActivity(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* HERO */}

      <OrbitSection>
        <OrbitHeading
          badge={t("badge")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
      </OrbitSection>

      {/* STATS */}

      <OrbitSection>
        <div
          className="
            grid
            gap-5

            md:grid-cols-3
          "
        >
          <OrbitCard
            className="p-6"
          >
            <p
              className="
                text-sm
                text-white/50
              "
            >
              {t("totalEvents")}
            </p>

            <h2
              className="
                mt-4

                text-4xl
                font-semibold
              "
            >
              <CountUp
                end={
                  activity.length
                }
              />
            </h2>
          </OrbitCard>

          <OrbitCard
            className="p-6"
          >
            <p
              className="
                text-sm
                text-white/50
              "
            >
              {t("aiExecutions")}
            </p>

            <h2
              className="
                mt-4

                text-4xl
                font-semibold
              "
            >
              <CountUp
                end={
                  activity.filter(
                    (
                      item
                    ) =>
                      item.type?.includes(
                        "ai"
                      )
                  ).length
                }
              />
            </h2>
          </OrbitCard>

          <OrbitCard
            className="p-6"
          >
            <p
              className="
                text-sm
                text-white/50
              "
            >
              {t("taskEvents")}
            </p>

            <h2
              className="
                mt-4

                text-4xl
                font-semibold
              "
            >
              <CountUp
                end={
                  activity.filter(
                    (
                      item
                    ) =>
                      item.type?.includes(
                        "task"
                      )
                  ).length
                }
              />
            </h2>
          </OrbitCard>
        </div>
      </OrbitSection>

      {/* TIMELINE */}

      <OrbitSection>
        <div className="space-y-5">
          {loading &&
            [1, 2, 3].map(
              (item) => (
                <OrbitCard
                  key={item}
                  className="p-6"
                >
                  <div
                    className="
                      animate-pulse
                    "
                  >
                    <div
                      className="
                        h-4
                        w-40

                        rounded-full

                        bg-white/10
                      "
                    />

                    <div
                      className="
                        mt-5

                        h-5
                        w-full

                        rounded-full

                        bg-white/10
                      "
                    />
                  </div>
                </OrbitCard>
              )
            )}

          {!loading &&
            activity.length ===
              0 && (
              <OrbitCard
                className="
                  p-10

                  text-center
                "
              >
                <h2
                  className="
                    text-xl
                    font-semibold
                  "
                >
                  {t("noActivity")}
                </h2>

                <p
                  className="
                    mt-3

                    text-sm
                    text-white/50
                  "
                >
                  {t("noActivityDescription")}
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
                  <OrbitCard
                    className="p-6"
                  >
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-6
                      "
                    >
                      <div>
                        <div
                          className="
                            flex
                            items-center
                            gap-3
                          "
                        >
                          <div
                            className="
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
                            {formatText(
                              item.type
                            )}
                          </div>
                        </div>

                        <h2
                          className="
                            mt-4

                            text-lg
                            font-semibold
                            text-white
                          "
                        >
                          {formatText(
                            item.title ||
                              item.message
                          )}
                        </h2>

                        <p
                          className="
                            mt-3

                            text-sm
                            leading-relaxed
                            text-white/60
                          "
                        >
                          {formatText(
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
                        ).toLocaleString()}
                      </div>
                    </div>
                  </OrbitCard>
                </motion.div>
              )
            )}
        </div>
      </OrbitSection>
    </div>
  );
}
