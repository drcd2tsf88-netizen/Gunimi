"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
}

export function Stagger({ children, staggerDelay = 0.1, className, once = true }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items = el.querySelectorAll<HTMLElement>("[data-stagger-item]");
          items.forEach((item, i) => {
            item.style.transitionDelay = `${i * staggerDelay}s`;
            item.dataset.visible = "";
          });
          if (once) io.disconnect();
        } else if (!once) {
          const items = el.querySelectorAll<HTMLElement>("[data-stagger-item]");
          items.forEach((item) => {
            item.style.transitionDelay = "";
            delete item.dataset.visible;
          });
        }
      },
      { rootMargin: "-15%" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once, staggerDelay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <div data-stagger-item className={cn("g-reveal", className)}>
      {children}
    </div>
  );
}
