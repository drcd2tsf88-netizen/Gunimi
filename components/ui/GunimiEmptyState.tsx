"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import AiCore from "@/components/ui/AiCore";

type GunimiEmptyStateProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
  action?: ReactNode;
};

export default function GunimiEmptyState({
  title,
  description,
  icon: Icon,
  action,
}: GunimiEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[18px] border border-white/[0.055] bg-[#0A0E17] px-8 py-16 text-center shadow-[0_4px_20px_rgba(109,91,255,0.06)]"
    >
      {/* TOP SHEEN */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* AMBIENT GLOW */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.07), transparent 50%)" }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">

        {/* AI CORE — visual focal point */}
        <div className="relative mb-6 flex justify-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.18]">
            <AiCore size={140} showRings={false} showParticles={false} intensity="subtle" />
          </div>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#6D5BFF]/[0.16] bg-[#6D5BFF]/[0.08]">
            <Icon className="h-5 w-5 text-[#8B7DFF]" />
          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
          {title}
        </h3>

        {/* DESCRIPTION */}
        {description && (
          <p className="mt-2.5 max-w-sm text-[13px] leading-relaxed text-[#9AA3B2]">
            {description}
          </p>
        )}

        {/* ACTION */}
        {action && (
          <div className="mt-7">{action}</div>
        )}
      </div>
    </motion.div>
  );
}
