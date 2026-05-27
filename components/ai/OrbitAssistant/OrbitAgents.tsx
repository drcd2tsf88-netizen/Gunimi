"use client";

import { motion }
from "framer-motion";

import {
  Bot,
  Brain,
  Cpu,
} from "lucide-react";

const agents = [
  {
    name:
      "Orbit Core",

    description:
      "Primary workspace cognition system.",

    icon: Brain,
  },

  {
    name:
      "Workflow Agent",

    description:
      "Autonomous execution orchestration.",

    icon: Cpu,
  },

  {
    name:
      "CRM Agent",

    description:
      "Realtime CRM intelligence analysis.",

    icon: Bot,
  },
];

export default function OrbitAgents() {
  return (
    <div>
      <p
        className="
          mb-3

          text-[10px]
          uppercase

          tracking-[0.2em]

          text-zinc-500
        "
      >
        Active AI Systems
      </p>

      <div
        className="
          space-y-2
        "
      >
        {agents.map(
          (
            agent
          ) => {
            const Icon =
              agent.icon;

            return (
              <motion.div
                key={
                  agent.name
                }
                whileHover={{
                  y: -1,
                }}
                className="
                  flex
                  items-center
                  gap-3

                  rounded-2xl

                  border
                  border-white/10

                  bg-white/[0.03]

                  px-4
                  py-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9

                    items-center
                    justify-center

                    rounded-xl

                    bg-violet-500/10

                    text-violet-300
                  "
                >
                  <Icon
                    size={16}
                  />
                </div>

                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <div
                      className="
                        h-2
                        w-2

                        animate-pulse

                        rounded-full

                        bg-emerald-400
                      "
                    />

                    <h3
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      {
                        agent.name
                      }
                    </h3>
                  </div>

                  <p
                    className="
                      mt-1

                      text-xs
                      text-zinc-500
                    "
                  >
                    {
                      agent.description
                    }
                  </p>
                </div>
              </motion.div>
            );
          }
        )}
      </div>
    </div>
  );
}