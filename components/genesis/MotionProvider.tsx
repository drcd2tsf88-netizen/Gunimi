"use client";

import { ReducedMotionProvider } from "./ReducedMotionProvider";

// ─────────────────────────────────────────────────────────────
// MotionProvider
//
// Top-level wrapper for any surface that uses genesis
// animation components. Wraps ReducedMotionProvider.
//
// Usage: place once at the root of the homepage, Genesis
// experience, or any landing surface.
//
// <MotionProvider>
//   <LandingNavbar />
//   <LandingHero />
//   ...
// </MotionProvider>
// ─────────────────────────────────────────────────────────────

interface MotionProviderProps {
  children: React.ReactNode;
  /** Force reduced motion for all descendants. */
  forceReduceMotion?: boolean;
}

export function MotionProvider({
  children,
  forceReduceMotion = false,
}: MotionProviderProps) {
  return (
    <ReducedMotionProvider forceReduce={forceReduceMotion}>
      {children}
    </ReducedMotionProvider>
  );
}
