"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type OrbitHeadingProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
};

export default function OrbitHeading({
  title,
  subtitle,
  badge,
  className,
}: OrbitHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={cn("space-y-2", className)}
    >
      {/* BADGE */}
      {badge && (
        <div className="inline-flex items-center rounded-full border border-[#6D5BFF]/[0.18] bg-[#6D5BFF]/[0.08] px-3 py-1">
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#8B7DFF]">
            {badge}
          </span>
        </div>
      )}

      {/* CONTENT */}
      <div>
        <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#F7F8FC]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-[1.6] text-[#9AA3B2]">
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
