"use client";

import { createContext, useContext } from "react";
import { useReducedMotion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// ReducedMotionProvider
//
// Provides the OS-level reduced motion preference to all
// genesis components. Also allows manual override — useful
// when the Genesis cinematic engine wants to suppress all
// scroll animations during a video or interactive sequence.
// ─────────────────────────────────────────────────────────────

interface ReducedMotionContextType {
  shouldReduceMotion: boolean;
}

const ReducedMotionContext = createContext<ReducedMotionContextType>({
  shouldReduceMotion: false,
});

interface ReducedMotionProviderProps {
  children: React.ReactNode;
  /** Force reduced motion regardless of OS setting. Useful during cinematic sequences. */
  forceReduce?: boolean;
}

export function ReducedMotionProvider({
  children,
  forceReduce = false,
}: ReducedMotionProviderProps) {
  const osPrefers = useReducedMotion() ?? false;
  const shouldReduceMotion = forceReduce || osPrefers;

  return (
    <ReducedMotionContext.Provider value={{ shouldReduceMotion }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionContext(): boolean {
  return useContext(ReducedMotionContext).shouldReduceMotion;
}
