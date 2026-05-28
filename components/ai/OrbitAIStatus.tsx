"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

import { supabase }
from "@/lib/supabase";

type AIState = {
  context: string;
};

export default function OrbitAIStatus() {
  const [
    aiState,

    setAIState,
  ] =
    useState<AIState | null>(
      null
    );

  async function loadAIState() {
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "workspace_ai_state"
        )
        .select("*")
        .limit(1)
        .maybeSingle();

    if (error) {
      console.error(
        error
      );

      return;
    }

    setAIState(data);
  }

  useEffect(() => {
    // INITIAL

    loadAIState();

    // REALTIME

    const channel =
      supabase
        .channel(
          "workspace-ai-state-topbar"
        )
        .on(
          "postgres_changes",
          {
            event: "*",

            schema:
              "public",

            table:
              "workspace_ai_state",
          },

          () => {
            loadAIState();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className="
        hidden
        items-center
        gap-3

        rounded-full

        border
        border-cyan-500/20

        bg-cyan-500/10

        px-4
        py-2.5

        lg:flex
      "
    >
      {/* SIGNAL */}

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

      {/* TEXT */}

      <div>
        <p
          className="
            text-xs
            font-medium

            text-cyan-200
          "
        >
          Orbit AI Consciousness
        </p>

        <p
          className="
            max-w-[240px]

            truncate

            text-[11px]
            text-cyan-100/70
          "
        >
          {aiState?.context ||
            "Orbit AI monitoring workspace systems."}
        </p>
      </div>
    </motion.div>
  );
}