"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  className?: string;
  once?: boolean;
}

export function Reveal({ children, delay = 0, duration = 0.8, y = 20, x = 0, className, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "";
          if (once) io.disconnect();
        } else if (!once) {
          delete el.dataset.visible;
        }
      },
      { rootMargin: "-15%" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={cn("g-reveal", className)}
      style={{
        "--g-reveal-y": `${y}px`,
        "--g-reveal-x": `${x}px`,
        "--g-reveal-delay": `${delay}s`,
        "--g-reveal-dur": `${duration}s`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
