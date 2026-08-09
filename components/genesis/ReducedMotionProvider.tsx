"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
  const [osPrefers, setOsPrefers] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setOsPrefers(mq.matches);
    const handler = (e: MediaQueryListEvent) => setOsPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <ReducedMotionContext.Provider value={{ shouldReduceMotion: forceReduce || osPrefers }}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionContext(): boolean {
  return useContext(ReducedMotionContext).shouldReduceMotion;
}
