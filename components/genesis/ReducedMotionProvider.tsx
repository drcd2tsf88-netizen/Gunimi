"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const MQ = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getSnapshot() {
  return window.matchMedia(MQ).matches;
}

function getServerSnapshot() {
  return false;
}

interface ReducedMotionContextType {
  shouldReduceMotion: boolean;
}

const ReducedMotionContext = createContext<ReducedMotionContextType>({
  shouldReduceMotion: false,
});

interface ReducedMotionProviderProps {
  children: React.ReactNode;
  forceReduce?: boolean;
}

export function ReducedMotionProvider({ children, forceReduce = false }: ReducedMotionProviderProps) {
  const osPrefers = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <ReducedMotionContext.Provider value={{ shouldReduceMotion: forceReduce || osPrefers }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionContext(): boolean {
  return useContext(ReducedMotionContext).shouldReduceMotion;
}
