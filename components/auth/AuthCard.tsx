"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AiCore from "@/components/ui/AiCore";

// ─────────────────────────────────────────────────────────────
// AuthCard — Shared shell for every auth/onboarding page.
// GDL v1.0: Deep Space bg, Dark Titanium card, ambient AiCore.
// ─────────────────────────────────────────────────────────────

type AuthCardProps = {
  children: React.ReactNode;
  maxWidth?: string;
  centered?: boolean;
};

export default function AuthCard({
  children,
  maxWidth = "max-w-[512px]",
  centered = false,
}: AuthCardProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#05060A] px-6 py-12 text-white">

      {/* DEEP SPACE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[540px] w-[760px] -translate-x-1/2 -translate-y-1/4"
          style={{
            background: "radial-gradient(ellipse, rgba(109,91,255,0.10), transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-80px] right-[-40px] h-[360px] w-[360px]"
          style={{
            background: "radial-gradient(circle, rgba(109,91,255,0.05), transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* AI CORE — ambient presence behind the card */}
      <div className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 opacity-[0.07]">
        <AiCore size={520} showRings showParticles={false} intensity="subtle" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative z-10 w-full overflow-hidden",
          "rounded-[28px] border border-white/[0.055] bg-[#0A0E17]",
          "p-8",
          "shadow-[0_8px_60px_rgba(109,91,255,0.14),0_0_0_1px_rgba(255,255,255,0.03)]",
          maxWidth,
          centered && "text-center",
        )}
      >
        {/* TOP SHEEN */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent" />
        {/* INNER AMBIENT */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.06), transparent 55%)" }}
        />

        {/* CONTENT */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </main>
  );
}
