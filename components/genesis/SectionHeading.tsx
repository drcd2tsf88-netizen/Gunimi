"use client";

import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

// ─────────────────────────────────────────────────────────────
// SectionHeading
//
// Eyebrow + headline + optional subheadline — the canonical
// section header pattern used across all genesis surfaces.
//
// Each element has its own staggered Reveal entrance:
//   eyebrow   → delay 0
//   headline  → delay 0.1
//   sub       → delay 0.2
//
// Delay offsets are configurable for sections where the heading
// appears after other content (e.g., Today's opening sentence).
//
// Usage:
// <SectionHeading
//   eyebrow="Signal Intelligence"
//   headline={<>This is what<br />understanding looks like.</>}
//   align="center"
// />
// ─────────────────────────────────────────────────────────────

interface SectionHeadingProps {
  eyebrow?: string;
  headline: React.ReactNode;
  subheadline?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Base delay for all elements. Stagger offsets add on top of this. */
  baseDelay?: number;
}

export function SectionHeading({
  eyebrow,
  headline,
  subheadline,
  align = "center",
  className,
  baseDelay = 0,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <Reveal delay={baseDelay} duration={0.4} y={8}>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9AA3B2]/65">
            {eyebrow}
          </p>
        </Reveal>
      )}

      <Reveal delay={baseDelay + (eyebrow ? 0.1 : 0)} y={16}>
        <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] text-[#F7F8FC] md:text-[48px] md:tracking-[-0.015em]">
          {headline}
        </h2>
      </Reveal>

      {subheadline && (
        <Reveal delay={baseDelay + (eyebrow ? 0.2 : 0.1)} y={12}>
          <p className="max-w-[560px] text-[16px] leading-[1.65] text-[#9AA3B2] md:text-[18px]">
            {subheadline}
          </p>
        </Reveal>
      )}
    </div>
  );
}
