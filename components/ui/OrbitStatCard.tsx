"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type OrbitStatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  animated?: boolean;
  className?: string;
};

export default function OrbitStatCard({
  title,
  value,
  description,
  icon: Icon,
  animated = false,
  className,
}: OrbitStatCardProps) {
  const isNumeric = typeof value === "number";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[18px]",
        "border border-white/[0.055] bg-[#0A0E17]",
        "p-5",
        "shadow-[0_4px_20px_rgba(109,91,255,0.06),0_0_0_1px_rgba(255,255,255,0.03)]",
        "transition-all duration-300",
        "hover:border-white/[0.09]",
        "hover:shadow-[0_8px_36px_rgba(109,91,255,0.12),0_0_0_1px_rgba(255,255,255,0.05)]",
        className
      )}
    >
      {/* TOP SHEEN */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* HOVER AMBIENT */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(109,91,255,0.09),transparent_42%)]" />

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">

          {/* TEXT */}
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#9AA3B2]/55">
              {title}
            </p>

            <h3 className="mt-4 break-words text-[32px] font-bold leading-none tracking-[-0.04em] text-[#F7F8FC]">
              {animated && isNumeric ? (
                <CountUp end={value as number} duration={1.8} separator="," />
              ) : (
                value
              )}
            </h3>
          </div>

          {/* ICON */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6D5BFF]/[0.14] bg-[#6D5BFF]/[0.08]">
            <Icon className="h-4 w-4 text-[#8B7DFF]" />
          </div>
        </div>

        {/* DESCRIPTION */}
        {description && (
          <p className="mt-5 text-[13px] leading-relaxed text-[#9AA3B2]">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
