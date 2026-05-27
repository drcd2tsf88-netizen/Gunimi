"use client";

import { motion }
from "framer-motion";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitCard
from "@/components/ui/OrbitCard";

import {
  Brain,
  Sparkles,
} from "lucide-react";

import { useAIStateStore }
from "@/lib/store/ai-state-store";

export default function DashboardAIThinking() {
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

  if (!thinking) {
    return null;
  }

  return (
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <OrbitCard
          className="
            relative
            overflow-hidden
            border
            border-cyan-500/10
            p-4
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

              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-2xl

                bg-violet-500/10

                text-violet-300
              "
            >
              <Brain
                className="
                  animate-pulse
                "
                size={18}
              />
            </div>

            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Sparkles
                  size={14}
                  className="
                    text-cyan-300
                  "
                />

                <p
                  className="
                    text-xs
                    uppercase

                    tracking-[0.2em]

                    text-cyan-300
                  "
                >
                  Orbit AI Active
                </p>
              </div>

              <h3
                className="
                  mt-2

                  text-sm md:text-base
                  font-semibold
                  line-clamp-1
                "
              >
                {currentThought}
              </h3>
            </div>
          </div>
        </OrbitCard>
      </motion.div>
  );
}