"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function FadeIn({ children, delay = 0, duration = 0.4, className, once = true }: FadeInProps) {
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
      className={cn("g-fadein", className)}
      style={{ "--g-reveal-delay": `${delay}s`, "--g-reveal-dur": `${duration}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
