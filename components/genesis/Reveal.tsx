"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// Reveal
//
// The primary scroll entrance animation. Opacity + directional
// translate — used for headings, body text, cards, and most
// homepage content reveals.
//
// Answers the Motion Philosophy question: "What is important?"
// The directional entrance guides the visitor's eye to the
// element as it enters — communicating that it matters.
//
// Under prefers-reduced-motion: renders children immediately
// at their final position with no animation.
//
// Default: y=20 (rising entrance). Use x for horizontal reveals.
// ─────────────────────────────────────────────────────────────

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  /** Vertical offset to animate from (positive = from below). Default: 20. */
  y?: number;
  /** Horizontal offset to animate from (positive = from right). Default: 0. */
  x?: number;
  className?: string;
  /** Trigger once on entry and never re-animate on scroll back. Default: true. */
  once?: boolean;
}

export function Reveal({
  children,
  delay = 0,
  duration = 0.8,
  y = 20,
  x = 0,
  className,
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
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
