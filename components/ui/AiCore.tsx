"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// AiCore — Gunimi's visual identity mark.
//
// A living AI nucleus: orbital rings, breathing core, drifting
// particles. Used across landing, dashboard, loading states,
// and AI feature headers. The center of everything.
// ─────────────────────────────────────────────────────────────

type AiCoreProps = {
  size?: number;
  className?: string;
  showRings?: boolean;
  showParticles?: boolean;
  intensity?: "subtle" | "medium" | "strong";
};

const PARTICLES = [
  { x: "16%", y: "22%", s: 1.5, d: 4.2, delay: 0.0,  cyan: false },
  { x: "78%", y: "14%", s: 1.0, d: 5.8, delay: 1.4,  cyan: false },
  { x: "88%", y: "68%", s: 1.5, d: 4.6, delay: 0.7,  cyan: true  },
  { x: "10%", y: "74%", s: 1.0, d: 6.2, delay: 2.1,  cyan: false },
  { x: "52%", y: "90%", s: 1.5, d: 5.1, delay: 0.4,  cyan: false },
  { x: "28%", y: "6%",  s: 1.0, d: 4.7, delay: 1.9,  cyan: true  },
  { x: "93%", y: "38%", s: 1.5, d: 5.4, delay: 2.6,  cyan: false },
  { x: "4%",  y: "50%", s: 1.0, d: 4.4, delay: 3.2,  cyan: false },
  { x: "65%", y: "5%",  s: 1.2, d: 5.9, delay: 0.9,  cyan: true  },
  { x: "40%", y: "92%", s: 1.0, d: 4.8, delay: 1.6,  cyan: false },
];

export default function AiCore({
  size = 280,
  className,
  showRings = true,
  showParticles = true,
  intensity = "medium",
}: AiCoreProps) {
  const shouldReduceMotion = useReducedMotion();
  const c = size / 2;
  const g = intensity === "subtle" ? 0.45 : intensity === "strong" ? 1.0 : 0.72;

  // Ring dimensions — ellipses create the 3D orbit-plane illusion
  const r1x = size * 0.44;  const r1y = size * 0.118;  // outer
  const r2x = size * 0.308; const r2y = size * 0.084;  // mid
  const r3x = size * 0.196; const r3y = size * 0.054;  // inner

  const coreDot = size * 0.066;

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* ── AMBIENT OUTER GLOW ── */}
      <motion.div
        animate={shouldReduceMotion ? { opacity: 0.38 * g, scale: 1 } : {
          opacity: [0.28 * g, 0.55 * g, 0.28 * g],
          scale:   [0.94, 1.06, 0.94],
        }}
        transition={{ duration: 9, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at center,
            rgba(109,91,255,${0.24 * g}) 0%,
            rgba(109,91,255,${0.06 * g}) 38%,
            transparent 68%)`,
        }}
      />

      {/* ── OUTER RING ── */}
      {showRings && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${size} ${size}`}
          style={{ animation: shouldReduceMotion ? "none" : "gunimi-orbit-1 88s linear infinite" }}
        >
          <ellipse
            cx={c} cy={c}
            rx={r1x} ry={r1y}
            stroke={`rgba(109,91,255,${0.12 * g + 0.05})`}
            strokeWidth="0.7"
            fill="none"
          />
          {/* primary satellite */}
          <circle
            cx={c + r1x} cy={c}
            r={size * 0.013}
            fill="#8B7DFF"
            opacity={0.6 * g + 0.2}
          />
          {/* secondary satellite */}
          <circle
            cx={c - r1x * 0.6} cy={c - r1y * 0.65}
            r={size * 0.008}
            fill="#A998FF"
            opacity={0.35 * g + 0.1}
          />
        </svg>
      )}

      {/* ── MID RING — counter-rotates ── */}
      {showRings && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${size} ${size}`}
          style={{ animation: shouldReduceMotion ? "none" : "gunimi-orbit-2 58s linear infinite reverse" }}
        >
          <ellipse
            cx={c} cy={c}
            rx={r2x} ry={r2y}
            stroke={`rgba(109,91,255,${0.20 * g + 0.06})`}
            strokeWidth="0.7"
            fill="none"
          />
          {/* AI cyan satellite */}
          <circle
            cx={c + r2x} cy={c}
            r={size * 0.011}
            fill="#22D3EE"
            opacity={0.50 * g + 0.15}
          />
          <circle
            cx={c - r2x} cy={c}
            r={size * 0.007}
            fill="#A998FF"
            opacity={0.40 * g + 0.1}
          />
        </svg>
      )}

      {/* ── INNER RING ── */}
      {showRings && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${size} ${size}`}
          style={{ animation: shouldReduceMotion ? "none" : "gunimi-orbit-3 36s linear infinite" }}
        >
          <ellipse
            cx={c} cy={c}
            rx={r3x} ry={r3y}
            stroke={`rgba(169,152,255,${0.30 * g + 0.08})`}
            strokeWidth="0.8"
            fill="none"
          />
          <circle
            cx={c + r3x} cy={c}
            r={size * 0.010}
            fill="#6D5BFF"
            opacity={0.85}
          />
        </svg>
      )}

      {/* ── PARTICLES ── */}
      {showParticles && PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width:  p.s,
            height: p.s,
            left:   p.x,
            top:    p.y,
            background: p.cyan ? "#22D3EE" : "#8B7DFF",
          }}
          animate={shouldReduceMotion ? { opacity: 0.25 * g, scale: 1 } : { opacity: [0, 0.55 * g, 0], scale: [0.4, 1.6, 0.4] }}
          transition={{
            duration: p.d,
            delay:    p.delay,
            repeat:   shouldReduceMotion ? 0 : Infinity,
            ease:     "easeInOut",
          }}
        />
      ))}

      {/* ── CORE HALO — breathing ── */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={shouldReduceMotion ? { scale: 1, opacity: 0.40 * g } : {
            scale:   [0.86, 1.14, 0.86],
            opacity: [0.28 * g, 0.58 * g, 0.28 * g],
          }}
          transition={{ duration: 6.0, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
          style={{
            width:        size * 0.24,
            height:       size * 0.24,
            borderRadius: "50%",
            background:   `radial-gradient(circle, rgba(109,91,255,${0.52 * g}) 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* ── CORE DOT ── */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={shouldReduceMotion ? { scale: 1 } : { scale: [0.86, 1.14, 0.86] }}
          transition={{ duration: 4.2, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut" }}
          style={{
            width:        coreDot,
            height:       coreDot,
            borderRadius: "50%",
            background:   "radial-gradient(circle, #C8BBFF 0%, #8B7DFF 42%, #6D5BFF 80%)",
            boxShadow:    `0 0 ${size * 0.10}px rgba(109,91,255,${0.80 * g}),
                           0 0 ${size * 0.05}px rgba(139,125,255,${0.55 * g}),
                           0 0 ${size * 0.02}px rgba(200,187,255,0.9)`,
          }}
        />
      </div>
    </div>
  );
}
