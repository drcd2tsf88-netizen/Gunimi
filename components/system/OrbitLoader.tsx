"use client";

import { motion } from "framer-motion";
import AiCore from "@/components/ui/AiCore";

// ─────────────────────────────────────────────────────────────
// OrbitLoader — Full-screen initialization state.
// The AI Core is the first thing users see on every load.
// ─────────────────────────────────────────────────────────────

export default function OrbitLoader() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#05060A]">

      {/* DEEP SPACE BACKGROUND */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(109,91,255,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(34,211,238,0.04) 0%, transparent 55%)
          `,
        }}
      />

      {/* AI CORE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1,  scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <AiCore
          size={220}
          showRings
          showParticles
          intensity="medium"
        />
      </motion.div>

      {/* WORDMARK */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1,  y: 0 }}
        transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 flex flex-col items-center gap-2"
      >
        <p className="text-[15px] font-semibold tracking-[0.04em] text-[#F7F8FC]">
          Gunimi
        </p>
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#9AA3B2]/60">
          AI Workspace OS
        </p>
      </motion.div>

      {/* PROGRESS LINE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-14 w-48 overflow-hidden rounded-full"
        style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ delay: 1.0, duration: 1.8, ease: [0.16, 1, 0.3, 1], repeat: Infinity, repeatDelay: 0.4 }}
          className="h-full w-1/2 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(109,91,255,0.6), transparent)",
          }}
        />
      </motion.div>

    </div>
  );
}
