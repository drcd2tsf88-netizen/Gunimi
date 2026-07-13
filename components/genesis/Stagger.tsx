"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// Stagger + StaggerItem
//
// Orchestrated entrance for lists of elements. The Stagger
// container fires its children (StaggerItem) one by one with
// a configurable delay between each.
//
// Answers the Motion Philosophy question: "What happens next?"
// The sequential reveal creates a reading rhythm — the visitor
// naturally follows from item to item.
//
// Usage:
// <Stagger staggerDelay={0.12}>
//   <StaggerItem>First</StaggerItem>
//   <StaggerItem>Second</StaggerItem>
//   <StaggerItem>Third</StaggerItem>
// </Stagger>
//
// Under prefers-reduced-motion: all items visible immediately.
// ─────────────────────────────────────────────────────────────

const containerVariants = (staggerDelay: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

const itemVariants = {
  hidden:   { opacity: 0, y: 12 },
  visible:  {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// ── Stagger container ─────────────────────────────────────────

interface StaggerProps {
  children: React.ReactNode;
  /** Seconds between each child reveal. Default: 0.1. */
  staggerDelay?: number;
  className?: string;
  /** Trigger once on entry. Default: true. */
  once?: boolean;
}

export function Stagger({
  children,
  staggerDelay = 0.1,
  className,
  once = true,
}: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={containerVariants(staggerDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-15%" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ── StaggerItem ───────────────────────────────────────────────

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  );
}
