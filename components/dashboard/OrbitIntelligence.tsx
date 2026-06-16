"use client";

import {
  useEffect,
  useState,
} from "react";

import { motion }
from "framer-motion";

import {
  ArrowRight,
  Brain,
  Sparkles,
} from "lucide-react";

import { useRouter }
from "next/navigation";

import { useTranslations }
from "next-intl";

import { supabase }
from "@/lib/supabase";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

import { useAIStateStore }
from "@/lib/store/ai-state-store";

import { getWorkspaceAIActions }
from "@/server/actions/ai/getWorkspaceAIActions";

export default function OrbitIntelligence() {
  const t =
    useTranslations();

  const router =
    useRouter();

  const [actions, setActions] =
    useState<any[]>([]);

  const thinking =
    useAIStateStore(
      (state) =>
        state.thinking
    );

  const currentThought =
    useAIStateStore(
      (state) =>
        state.currentThought
    );

  async function loadActions() {
    const data =
      await getWorkspaceAIActions();

    setActions(
      data ?? []
    );
  }

  useEffect(() => {
    loadActions();

    const channel =
      supabase
        .channel(
          "workspace-ai-actions-stream"
        )
        .on(
          "postgres_changes",
          {
            event: "*",

            schema: "public",

            table:
              "workspace_ai_actions",
          },
          loadActions
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  const insight =
    thinking &&
    currentThought
      ? currentThought
      : t(
          "dashboard.workspaceOperational"
        );

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t(
          "dashboard.workspaceIntelligence"
        )}
        title={t(
          "dashboard.orbitIntelligence"
        )}
        subtitle={t(
          "dashboard.orbitIntelligenceSubtitle"
        )}
      />

      {/* INSIGHT */}

      <OrbitCard
        className="
          relative
          overflow-hidden
          p-5
        "
      >
        <div
          className="
            absolute
            inset-0

            bg-gradient-to-r
            from-violet-500/5
            to-cyan-500/5
          "
        />

        <div
          className="
            relative
            z-10
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-11
                w-11

                items-center
                justify-center

                rounded-2xl

                bg-violet-500/10

                text-violet-300
              "
            >
              <Brain
                size={18}
              />
            </div>

            <div>
              <p
                className="
                  text-xs
                  uppercase

                  tracking-[0.2em]

                  text-cyan-300
                "
              >
                {t(
                  "dashboard.workspaceInsight"
                )}
              </p>

              <h3
                className="
                  mt-2

                  text-base
                  font-semibold
                "
              >
                {insight}
              </h3>
            </div>
          </div>
        </div>
      </OrbitCard>

      {/* ACTIONS */}

      <div
        className="
          mt-6
        "
      >
        <h3
          className="
            mb-4

            text-sm
            font-medium

            text-white/60
          "
        >
          {t(
            "dashboard.recommendedActions"
          )}
        </h3>

        {actions.length ===
        0 ? (
          <OrbitCard
            className="
              p-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Sparkles
                size={18}
                className="
                  text-cyan-300
                "
              />

              <p
                className="
                  text-sm
                  text-white/60
                "
              >
                {t(
                  "dashboard.noRecommendedActions"
                )}
              </p>
            </div>
          </OrbitCard>
        ) : (
          <div
            className="
              space-y-4
            "
          >
            {actions.map(
              (
                action,
                index
              ) => (
                <motion.div
                  key={
                    action.id
                  }
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
                      index *
                      0.05,
                  }}
                >
                  <OrbitCard
                    className={`
                      p-5

                      ${
                        action.priority ===
                        "high"
                          ? `
                            border-amber-500/20
                            bg-amber-500/[0.04]
                          `
                          : `
                            border-cyan-500/20
                            bg-cyan-500/[0.03]
                          `
                      }
                    `}
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
                        <h4
                          className="
                            text-base
                            font-semibold
                          "
                        >
                          {
                            action.title
                          }
                        </h4>

                        <p
                          className="
                            mt-2

                            text-sm
                            leading-relaxed

                            text-white/60
                          "
                        >
                          {
                            action.description
                          }
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          router.push(
                            action.action_route
                          )
                        }
                        className="
                          inline-flex
                          items-center
                          gap-2

                          rounded-xl

                          bg-white/10

                          px-4
                          py-2

                          text-sm

                          transition-all

                          hover:bg-white/15
                        "
                      >
                        {
                          action.action_label
                        }

                        <ArrowRight
                          size={14}
                        />
                      </button>
                    </div>
                  </OrbitCard>
                </motion.div>
              )
            )}
          </div>
        )}
      </div>
    </OrbitSection>
  );
}