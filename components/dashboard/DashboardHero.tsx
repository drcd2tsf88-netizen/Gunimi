"use client";

import { motion }
from "framer-motion";

import OrbitSection
from "@/components/layout/OrbitSection";

import OrbitHeading
from "@/components/ui/OrbitHeading";

import OrbitCard
from "@/components/ui/OrbitCard";
import DashboardWorkspaceStrip
from "@/components/dashboard/DashboardWorkspaceStrip";

type DashboardHeroProps = {
  onOpenAssistant: () => void;
};

export default function DashboardHero({
  onOpenAssistant,
}: DashboardHeroProps) {
  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <OrbitSection>
      <OrbitHeading
        badge="Orbit Workspace"
        title={`${greeting}, Michal 👋`}
        subtitle="
          Workspace AI systems operational and monitoring live execution activity.
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.1,
        }}
      >
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
              right-[-80px]
              top-[-80px]

              h-[140px]
              w-[140px]

              rounded-full

              bg-violet-500/10

              blur-3xl
            "
          />

          <div
            className="
              relative
              z-10
            "
          >
            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Orbit AI Workspace
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-relaxed
                text-white/60
              "
            >
              Live AI operating
              system with realtime
              workflows, autonomous
              execution and
              workspace intelligence.
            </p>

            <button
              onClick={
                onOpenAssistant
              }
              className="
                mt-6

                rounded-2xl

                bg-violet-500/20

                h-10
                px-4

                text-sm
                font-medium

                text-violet-200

                transition-all

                hover:bg-violet-500/30
              "
            >
              AI cognition systems operational
            </button>
          </div>
        </OrbitCard>
      </motion.div>
       <DashboardWorkspaceStrip
   />
    </OrbitSection>
 
  );
}