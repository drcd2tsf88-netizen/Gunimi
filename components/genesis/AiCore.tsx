"use client";

import { useRef } from "react";
import {
  useReducedMotion,
  useAnimationFrame,
  useMotionValue,
  motion,
} from "framer-motion";
import BaseAiCore from "@/components/ui/AiCore";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// AiCore (genesis)
//
// Genesis wrapper around the base AiCore visual identity mark.
// Differences from components/ui/AiCore:
//
// 1. Default size is 600 (hero scale) rather than 280
// 2. Adds "minimal" intensity variant for the Final CTA section
// 3. Adds "showImpulse" for the genesis hero: a single light
//    pulse along the outer orbit once every 13s — makes the
//    system feel alive without being decorative
// 4. Under prefers-reduced-motion: static core dot only
// ─────────────────────────────────────────────────────────────

type GenesisIntensity = "minimal" | "subtle" | "medium" | "strong";

interface AiCoreProps {
  size?: number;
  showRings?: boolean;
  showParticles?: boolean;
  intensity?: GenesisIntensity;
  className?: string;
  /** One light impulse along the outer orbit per 13s cycle. Hero only. */
  showImpulse?: boolean;
}

// ── ImpulseOverlay ───────────────────────────────────────────

interface ImpulseOverlayProps {
  size: number;
}

function ImpulseOverlay({ size }: ImpulseOverlayProps) {
  const c = size / 2;
  const rx = size * 0.44;
  const ry = size * 0.118;

  const glowDiameter   = size * 0.08;
  const dotDiameter    = size * 0.018;
  const coreGlowRadius = size * 0.18; // matches BaseAiCore halo proportions

  // Impulse position (computed every frame)
  const glowX          = useMotionValue(c - glowDiameter / 2);
  const glowY          = useMotionValue(c - glowDiameter / 2);
  const dotX           = useMotionValue(c - dotDiameter / 2);
  const dotY           = useMotionValue(c - dotDiameter / 2);
  const impulseOpacity = useMotionValue(0);

  // Core brightening — fires when impulse returns to origin (progress ≈ 0)
  const coreOpacity    = useMotionValue(0);

  // Stable epoch so first flash fires at 6.5s, first core pulse at 13s
  const startRef = useRef<number | null>(null);

  useAnimationFrame((t) => {
    if (!startRef.current) startRef.current = t;
    const elapsed = t - startRef.current;

    const CYCLE = 13000; // ms
    const progress = (elapsed % CYCLE) / CYCLE; // 0 → 1

    // ── Impulse position — clockwise along outer ring ──
    const angle = -progress * 2 * Math.PI;
    const px = c + rx * Math.cos(angle);
    const py = c + ry * Math.sin(angle);

    glowX.set(px - glowDiameter / 2);
    glowY.set(py - glowDiameter / 2);
    dotX.set(px - dotDiameter / 2);
    dotY.set(py - dotDiameter / 2);

    // ── Impulse flash at 50% mark (6.5s) — visible ~0.7s ──
    const flashDist = Math.abs(progress - 0.5);
    const FLASH_HALF = 0.055;
    impulseOpacity.set(
      flashDist < FLASH_HALF ? (1 - flashDist / FLASH_HALF) ** 2 : 0
    );

    // ── Core brightening at return (progress ≈ 0, every 13s) ──
    // Guard: skip first 1.2s so mount doesn't trigger a false pulse
    if (elapsed > 1200) {
      const returnDist = Math.min(progress, 1 - progress);
      const RETURN_HALF = 0.018; // ~468ms total window
      // Max 0.32 opacity — "naozaj minimálne" (truly minimal)
      coreOpacity.set(
        returnDist < RETURN_HALF
          ? (1 - returnDist / RETURN_HALF) ** 2 * 0.32
          : 0
      );
    } else {
      coreOpacity.set(0);
    }
  });

  return (
    <>
      {/* ── Impulse: soft glow aura ── */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          x: glowX,
          y: glowY,
          width: glowDiameter,
          height: glowDiameter,
          background:
            "radial-gradient(circle, rgba(200,187,255,0.65) 0%, rgba(109,91,255,0.22) 45%, transparent 70%)",
          opacity: impulseOpacity,
        }}
      />
      {/* ── Impulse: sharp core dot ── */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          x: dotX,
          y: dotY,
          width: dotDiameter,
          height: dotDiameter,
          background: "white",
          boxShadow:
            "0 0 6px rgba(200,187,255,0.95), 0 0 12px rgba(109,91,255,0.5)",
          opacity: impulseOpacity,
        }}
      />
      {/* ── Core brightening: signal received — barely perceptible ──
           Fires 6.5s after impulse flash, lasts ~0.4s.
           Reads as "the core noticed" not "the core reacted". ── */}
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: c - coreGlowRadius,
          top:  c - coreGlowRadius,
          width:  coreGlowRadius * 2,
          height: coreGlowRadius * 2,
          background:
            "radial-gradient(circle, rgba(200,187,255,0.88) 0%, rgba(139,125,255,0.45) 30%, rgba(109,91,255,0.12) 60%, transparent 80%)",
          opacity: coreOpacity,
        }}
      />
    </>
  );
}

// ── AiCore ───────────────────────────────────────────────────

export function AiCore({
  size = 600,
  showRings = true,
  showParticles = true,
  intensity = "subtle",
  className,
  showImpulse = false,
}: AiCoreProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const dotSize = size * 0.066;
    return (
      <div
        className={cn("relative select-none", className)}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #C8BBFF 0%, #8B7DFF 42%, #6D5BFF 80%)",
              opacity: 0.4,
            }}
          />
        </div>
      </div>
    );
  }

  // Without impulse — pass through to BaseAiCore unchanged
  if (!showImpulse) {
    return (
      <BaseAiCore
        size={size}
        showRings={showRings}
        showParticles={showParticles}
        intensity={intensity === "minimal" ? "subtle" : intensity}
        className={className}
      />
    );
  }

  // With impulse — needs a positioned wrapper so ImpulseOverlay's
  // absolute divs are scoped to the AiCore bounds
  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <BaseAiCore
        size={size}
        showRings={showRings}
        showParticles={showParticles}
        intensity={intensity === "minimal" ? "subtle" : intensity}
      />
      <ImpulseOverlay size={size} />
    </div>
  );
}
