"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// GunimiCard — Dark Titanium Glass material.
//
// Deep matte surface, almost-invisible border, ambient purple
// lighting on hover. No heavy blur. Floats on interaction.
// ─────────────────────────────────────────────────────────────

type GunimiCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
};

export default function GunimiCard({
  children,
  className = "",
  onClick,
  hoverable,
}: GunimiCardProps) {
  const isInteractive = !!onClick || hoverable;

  return (
    <motion.div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      whileHover={isInteractive ? { y: -2, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } } : undefined}
      className={cn(
        // Dark Titanium Glass — deep matte surface
        "group relative overflow-hidden rounded-[18px]",
        "border border-white/[0.055]",
        "bg-[#0A0E17]",
        // Ambient purple shadow, not black
        "shadow-[0_4px_20px_rgba(109,91,255,0.08),0_0_0_1px_rgba(255,255,255,0.03)]",
        "transition-all duration-300",
        // Hover — subtle elevation and glow
        "hover:border-white/[0.09]",
        "hover:shadow-[0_8px_40px_rgba(109,91,255,0.14),0_0_0_1px_rgba(255,255,255,0.05)]",
        onClick && [
          "cursor-pointer",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[#6D5BFF]/50",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[#05060A]",
        ],
        className
      )}
    >
      {/* TOP SHEEN — titanium edge catch */}
      <div
        className="
          pointer-events-none absolute inset-x-0 top-0
          h-px
          bg-gradient-to-r from-transparent via-white/[0.07] to-transparent
        "
      />

      {/* HOVER AMBIENT — radial glow from top-left */}
      <div
        className="
          pointer-events-none absolute inset-0
          opacity-0 transition-opacity duration-500
          group-hover:opacity-100
          bg-[radial-gradient(circle_at_top_left,rgba(109,91,255,0.07),transparent_45%)]
        "
      />

      {/* CONTENT */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
