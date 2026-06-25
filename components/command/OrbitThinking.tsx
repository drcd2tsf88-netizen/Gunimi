"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAIStateStore } from "@/lib/store/ai-state-store";

export default function OrbitThinking() {
  const t = useTranslations("command");

  const thinking = useAIStateStore((state) => state.thinking);
  const currentThought = useAIStateStore((state) => state.currentThought);

  if (!thinking) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        flex
        items-center
        gap-3

        rounded-2xl

        border
        border-violet-500/20

        bg-violet-500/10

        px-4
        py-3
      "
    >
      {/* ICON */}
      <div
        className="
          relative

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
        <Brain size={16} className="animate-pulse" />
        <div
          className="
            absolute
            inset-0

            animate-ping

            rounded-xl

            bg-violet-400/10
          "
        />
      </div>

      {/* TEXT */}
      <div className="min-w-0 flex-1">
        <p
          className="
            text-[10px]
            uppercase

            tracking-[0.18em]

            text-violet-300
          "
        >
          {t("cognition")}
        </p>

        <p
          className="
            mt-1

            truncate

            text-sm
            text-white/70
          "
        >
          {currentThought}
        </p>
      </div>
    </motion.div>
  );
}
