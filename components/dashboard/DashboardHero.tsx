"use client";

import { useTranslations } from "next-intl";

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
   displayName: string;
  onOpenAssistant: () => void;
};

export default function DashboardHero({
  displayName,
  onOpenAssistant,
}: DashboardHeroProps) {
  const t = useTranslations("dashboard");

  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? t("goodMorning")
      : hour < 18
        ? t("goodAfternoon")
        : t("goodEvening");

  return (
    <OrbitSection>
      <OrbitHeading
  title={`${greeting}, ${displayName}`}
  subtitle={t("heroSubtitle")}
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
  {t("workspaceStatus")}
</h2>

<p
  className="
    mt-2
    text-sm
    leading-relaxed
    text-white/60
  "
>
  {t("allSystemsOperational")}
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
              {t("openOrbit")}
            </button>
          </div>
        </OrbitCard>
      </motion.div>
       <DashboardWorkspaceStrip
   />
    </OrbitSection>

  );
}
