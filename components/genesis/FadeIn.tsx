"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// FadeIn
//
// Opacity-only scroll reveal. Use for elements where a
// directional entrance would be distracting — large ambient
// visuals, background elements, the Business Memory section.
//
// Under prefers-reduced-motion: renders children immediately
// at full opacity, no animation.
//
// See Reveal for opacity + directional (y/x) entrances.
// ─────────────────────────────────────────────────────────────

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  /** Trigger once on entry and never re-animate on scroll back. Default: true. */
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className,
  once = true,
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once, margin: "-15%" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
