"use client";

import {
  Activity,
  Bot,
  Brain,
  Cpu,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";

import { supabase }
from "@/lib/supabase";

import { getWorkspaceMemory }
from "@/server/actions/memory/getWorkspaceMemory";

import { getWorkspaceAIState }
from "@/server/actions/ai/getWorkspaceAIState";

const systems = [
  {
    title:
      "Orbit AI Core",

    status:
      "Operational",

    icon: Brain,
  },

  {
    title:
      "Workflow Engine",

    status:
      "Realtime Active",

    icon: Cpu,
  },

  {
    title:
      "Agent System",

    status:
      "4 Agents Online",

    icon: Bot,
  },

  {
    title:
      "Workspace Stream",

    status:
      "Live Sync",

    icon: Activity,
  },
];

export default function DashboardObservatory() {

  const [memory, setMemory] =
    useState<any[]>([]);

  const [aiState, setAIState] =
    useState<any>(null);

  async function loadObservatory() {
    const memoryData =
      await getWorkspaceMemory();

    const aiData =
      await getWorkspaceAIState();

    setMemory(memoryData);

    setAIState(aiData);
  }

  useEffect(() => {
    // INITIAL

    loadObservatory();

    // MEMORY REALTIME

    const memoryChannel =
      supabase
        .channel(
          "workspace-memory"
        )
        .on(
          "postgres_changes",
          {
            event: "*",

            schema: "public",

            table:
              "workspace_memory",
          },
          () => {
            loadObservatory();
          }
        )
        .subscribe();

    // AI STATE REALTIME

    const aiChannel =
      supabase
        .channel(
          "workspace-ai-state"
        )
        .on(
          "postgres_changes",
          {
            event: "*",

            schema: "public",

            table:
              "workspace_ai_state",
          },
          () => {
            loadObservatory();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        memoryChannel
      );

      supabase.removeChannel(
        aiChannel
      );
    };
  }, []);
 return (
  <div
    className="
      relative

      overflow-hidden

      rounded-[32px]

      border
      border-white/10

      bg-white/[0.03]

      p-7
    "
  >
    {/* AMBIENT GLOW */}

    <div
      className="
        pointer-events-none

        absolute
        inset-0

        bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_60%)]
      "
    />

    {/* HEADER */}

    <div
      className="
        relative

        flex
        items-center
        justify-between
      "
    >
      <div>
        <p
          className="
            text-xs
            uppercase
            tracking-[0.3em]

            text-cyan-300/60
          "
        >
          Orbit Consciousness
        </p>

        <h2
          className="
            mt-3

            text-2xl
            font-semibold
          "
        >
          Live AI Observatory
        </h2>
      </div>

      {/* AI STATUS */}

      <div
        className="
          flex
          items-center
          gap-3

          rounded-full

          border
          border-cyan-500/20

          bg-cyan-500/10

          px-4
          py-2
        "
      >
        <div
          className="
            relative
          "
        >
          <div
            className="
              h-2
              w-2

              rounded-full

              bg-cyan-400
            "
          />

          <div
            className="
              absolute
              inset-0

              animate-ping

              rounded-full

              bg-cyan-400/40
            "
          />
        </div>

        <p
          className="
            text-xs
            text-cyan-200
          "
        >
          {
            aiState?.state ||
            "workspace_stable"
          }
        </p>
      </div>
    </div>

    {/* CURRENT AI THOUGHT */}

    <div
      className="
        relative

        mt-8

        rounded-3xl

        border
        border-cyan-500/10

        bg-cyan-500/[0.04]

        p-6
      "
    >
      <p
        className="
          text-xs
          uppercase
          tracking-[0.3em]

          text-cyan-300/50
        "
      >
        Current Consciousness
      </p>

      <p
        className="
          mt-4

          text-lg
          leading-relaxed

          text-white/90
        "
      >
        {
          aiState?.context ||
          "Orbit AI monitoring workspace systems."
        }
      </p>
    </div>

    {/* MEMORY STREAM */}

    <div
      className="
        relative

        mt-8
        space-y-4
      "
    >
      {memory.map(
        (item, index) => (
          <div
            key={item.id}
            className="
              flex
              items-start
              gap-4

              rounded-2xl

              border
              border-white/5

              bg-white/[0.02]

              p-5
            "
          >
            {/* SIGNAL */}

            <div
              className="
                mt-1

                h-2
                w-2

                shrink-0

                rounded-full

                bg-cyan-400
              "
            />

            {/* CONTENT */}

            <div>
              <p
                className="
                  text-sm
                  font-medium

                  text-white/90
                "
              >
                {item.type}
              </p>

              <p
                className="
                  mt-2

                  text-sm
                  leading-relaxed

                  text-white/50
                "
              >
                {item.content}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  </div>
);
}