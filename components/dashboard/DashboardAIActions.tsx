"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import {
  ArrowRight,
  Brain,
} from "lucide-react";

import { useRouter }
from "next/navigation";

import { supabase }
from "@/lib/supabase";

import { getWorkspaceAIActions }
from "@/server/actions/ai/getWorkspaceAIActions";

export default function DashboardAIActions() {
  const router =
    useRouter();

  const [actions, setActions] =
    useState<any[]>([]);

  async function loadActions() {
    const data =
      await getWorkspaceAIActions();

    setActions(data);
  }

  useEffect(() => {
    // INITIAL

    loadActions();

    // REALTIME

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
          () => {
            loadActions();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  // EMPTY STATE

  if (
    actions.length === 0
  ) {
    return null;
  }

  return (
    <div
      className="
        space-y-5
      "
    >
      {actions.map(
        (action) => (
          <motion.div
            key={action.id}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`
              relative

              overflow-hidden

              rounded-2xl

              border

              p-5

              ${
                action.priority ===
                "high"
                  ? `
                    border-rose-500/20
                    bg-rose-500/[0.06]
                  `
                  : `
                    border-cyan-500/20
                    bg-cyan-500/[0.05]
                  `
              }
            `}
          >
            {/* GLOW */}

            <div
              className={`
                absolute
                inset-0

                ${
                  action.priority ===
                  "high"
                    ? `
                      bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.18),transparent_60%)]
                    `
                    : `
                      bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_60%)]
                    `
                }
              `}
            />

            <div
              className="
                relative
              "
            >
              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  gap-4
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

                    bg-white/10
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
                      tracking-[0.3em]

                      text-white/40
                    "
                  >
                    Orbit AI
                  </p>

                  <h2
                    className="
                      mt-2

                      text-lg
                      font-semibold
                    "
                  >
                    {action.title}
                  </h2>
                </div>
              </div>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  text-white/70
                  text-sm
                  leading-relaxed
                  line-clamp-2
                "
                

                  
              >
                {
                  action.description
                }
              </p>

              {/* ACTION */}

              <button
                onClick={() =>
                  router.push(
                    action.action_route
                  )
                }
                className="
                  mt-6

                  flex
                  items-center
                  gap-2

                  rounded-2xl

                  bg-white/10

                  px-4
                  h-10

                  text-sm
                  font-medium

                  text-white

                  transition-all

                  hover:bg-white/15
                "
              >
                {
                  action.action_label
                }

                <ArrowRight
                  size={16}
                />
              </button>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}