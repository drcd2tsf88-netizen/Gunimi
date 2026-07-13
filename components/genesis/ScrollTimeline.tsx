"use client";

import { useScroll, type MotionValue } from "framer-motion";
import { useRef, createContext, useContext } from "react";

// ─────────────────────────────────────────────────────────────
// ScrollTimeline
//
// Tracks scroll progress through a section and exposes it
// to child components via context. Used for parallax effects,
// progress-based reveals, and cinematic scroll choreography.
//
// scrollYProgress: 0 when the section enters the bottom of
// the viewport, 1 when it exits the top.
//
// Usage:
// <ScrollTimeline>
//   <ScrollTimelineChild />
// </ScrollTimeline>
//
// Inside child:
// const { scrollYProgress } = useScrollTimeline();
// const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
// ─────────────────────────────────────────────────────────────

interface ScrollTimelineContextType {
  scrollYProgress: MotionValue<number>;
}

const ScrollTimelineContext = createContext<ScrollTimelineContextType | null>(null);

interface ScrollTimelineProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollTimeline({ children, className }: ScrollTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <ScrollTimelineContext.Provider value={{ scrollYProgress }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </ScrollTimelineContext.Provider>
  );
}

export function useScrollTimeline(): ScrollTimelineContextType {
  const context = useContext(ScrollTimelineContext);
  if (!context) {
    throw new Error("useScrollTimeline must be used inside a <ScrollTimeline> component");
  }
  return context;
}
