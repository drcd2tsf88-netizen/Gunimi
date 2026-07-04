"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, CheckCircle2, Brain, Zap } from "lucide-react";
import AiCore from "@/components/ui/AiCore";

// ─────────────────────────────────────────────────────────────
// LandingWorkspacePreview — Premium product showcase.
// Layered floating panels. Not a screenshot. A composition.
// Deep Space background, ambient glow, live metric cards.
// ─────────────────────────────────────────────────────────────

const METRICS = [
  { label: "New deals", value: "+12", change: "+34%", positive: true },
  { label: "Revenue",   value: "€84.2k", change: "+18%", positive: true },
  { label: "Tasks done", value: "47/52", change: "90%", positive: true },
];

const RECENT_ACTIVITY = [
  { icon: Brain,    text: "AI analyzed Acme Corp deal",      time: "2m ago",  accent: "#6D5BFF" },
  { icon: Zap,      text: "Automation triggered: Follow-up", time: "8m ago",  accent: "#22D3EE" },
  { icon: CheckCircle2, text: "Task closed by AI suggestion", time: "15m ago", accent: "#22c55e" },
  { icon: Users,    text: "New contact linked to deal",      time: "1h ago",  accent: "#8B7DFF" },
];

export default function LandingWorkspacePreview() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-12">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[15%] top-[20%] h-[400px] w-[400px]"
          style={{ background: "radial-gradient(circle, rgba(109,91,255,0.08) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[10%] right-[15%] h-[360px] w-[360px]"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)", filter: "blur(100px)" }}
        />
        <div
          className="absolute left-0 right-0 top-0 h-[1px]"
          style={{ background: "linear-gradient(to right, transparent, rgba(109,91,255,0.10), transparent)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#9AA3B2]/60">
            Inside the workspace
          </p>
          <h2 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[52px]">
            Everything visible.
            <br />
            <span className="text-[#9AA3B2]">Nothing missed.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[50ch] text-[16px] leading-[1.65] text-[#9AA3B2]">
            A live view of your entire business — metrics, relationships, tasks,
            and AI signals — all in one place.
          </p>
        </motion.div>

        {/* FLOATING WORKSPACE COMPOSITION */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 overflow-hidden rounded-[28px] border border-white/[0.055] bg-[#0A0E17] shadow-[0_24px_80px_rgba(109,91,255,0.16),0_0_0_1px_rgba(255,255,255,0.03)]"
        >
          {/* Top sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          {/* Internal ambient */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at top, rgba(109,91,255,0.06), transparent 55%)" }}
          />

          {/* BROWSER CHROME */}
          <div className="relative z-10 flex items-center gap-4 border-b border-white/[0.04] px-6 py-4">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]/60" />
            </div>
            <div className="h-4 w-px bg-white/[0.06]" />
            <div className="flex items-center gap-2">
              <AiCore size={18} showRings={false} showParticles={false} intensity="strong" />
              <span className="text-[13px] font-medium text-[#F7F8FC]">Gunimi</span>
              <span className="text-[12px] text-[#9AA3B2]/40">— Workspace</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22c55e]" />
              <span className="text-[12px] text-[#9AA3B2]/50">AI active</span>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="relative z-10 grid gap-5 p-6 lg:grid-cols-[1fr_340px]">

            {/* LEFT COLUMN */}
            <div className="space-y-5">

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-4">
                {METRICS.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                    className="group relative overflow-hidden rounded-[16px] border border-white/[0.055] bg-[#0F1520] p-4"
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                    <p className="text-[11px] text-[#9AA3B2]/60">{m.label}</p>
                    <p className="mt-2 text-[22px] font-bold tracking-[-0.04em] text-[#F7F8FC]">{m.value}</p>
                    <p className="mt-1 text-[11px] text-[#22c55e]">{m.change} this month</p>
                  </motion.div>
                ))}
              </div>

              {/* Chart area */}
              <div className="relative overflow-hidden rounded-[16px] border border-white/[0.055] bg-[#0F1520] p-5">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/50">Revenue</p>
                    <p className="mt-1 text-[18px] font-bold tracking-[-0.03em] text-[#F7F8FC]">€84,200</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-[rgba(34,197,94,0.20)] bg-[rgba(34,197,94,0.08)] px-3 py-1">
                    <TrendingUp size={11} className="text-[#22c55e]" />
                    <span className="text-[11px] text-[#22c55e]">+18% vs last month</span>
                  </div>
                </div>
                {/* Simple SVG bar chart */}
                <svg viewBox="0 0 400 80" className="w-full" aria-label="Revenue chart">
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6D5BFF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#6D5BFF" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  {[32, 48, 36, 60, 44, 70, 52, 80, 58, 72, 64, 76].map((h, i) => (
                    <rect
                      key={i}
                      x={i * 34 + 2} y={80 - h} width={28} height={h}
                      fill="url(#barGrad)" rx="4"
                      filter="drop-shadow(0 0 4px rgba(109,91,255,0.40))"
                    />
                  ))}
                </svg>
              </div>

              {/* Deals table mini */}
              <div className="overflow-hidden rounded-[16px] border border-white/[0.055] bg-[#0F1520]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <div className="border-b border-white/[0.04] px-5 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/50">Active Deals</p>
                </div>
                {[
                  { company: "Acme Corp",       stage: "Negotiation",  value: "€42k", ai: true },
                  { company: "Nova Systems",    stage: "Proposal",     value: "€18k", ai: false },
                  { company: "Starbridge",      stage: "Qualified",    value: "€91k", ai: true },
                ].map((deal, i) => (
                  <div key={deal.company} className={`flex items-center justify-between px-5 py-3 ${i < 2 ? "border-b border-white/[0.03]" : ""}`}>
                    <div>
                      <p className="text-[13px] font-medium text-[#F7F8FC]">{deal.company}</p>
                      <p className="text-[11px] text-[#9AA3B2]/60">{deal.stage}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {deal.ai && (
                        <span className="rounded-full border border-[rgba(34,211,238,0.15)] bg-[rgba(34,211,238,0.06)] px-2 py-0.5 text-[10px] text-[#22D3EE]">
                          AI insight
                        </span>
                      )}
                      <span className="text-[13px] font-mono text-[#F7F8FC]">{deal.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN — AI activity feed */}
            <div className="space-y-4">
              {/* AI Core header */}
              <div className="relative overflow-hidden rounded-[16px] border border-[rgba(34,211,238,0.12)] bg-[#0F1520] p-5">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(circle at top left, rgba(34,211,238,0.04), transparent 55%)" }}
                />
                <div className="relative z-10 flex items-center gap-3">
                  <AiCore size={44} showRings showParticles={false} intensity="medium" />
                  <div>
                    <p className="text-[12px] font-semibold text-[#F7F8FC]">Intelligence Core</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22D3EE]" />
                      <span className="text-[11px] text-[#22D3EE]">Analyzing workspace</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity stream */}
              <div className="rounded-[16px] border border-white/[0.055] bg-[#0F1520] p-4">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/50">
                  Recent AI Activity
                </p>
                <div className="space-y-3">
                  {RECENT_ACTIVITY.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.text}
                        initial={{ opacity: 0, x: 8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.07, duration: 0.5 }}
                        className="flex items-start gap-2.5"
                      >
                        <div
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px]"
                          style={{ background: `${item.accent}15`, color: item.accent }}
                        >
                          <Icon size={12} strokeWidth={2} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] leading-[1.5] text-[#C8CDD8]">{item.text}</p>
                          <p className="mt-0.5 text-[10.5px] text-[#9AA3B2]/45">{item.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* CTA inside preview */}
              <Link
                href="/register"
                className="
                  flex w-full items-center justify-center gap-2
                  rounded-[12px] border border-[#6D5BFF]/30 bg-[#6D5BFF]
                  px-5 py-3 text-[13px] font-semibold text-white
                  shadow-[0_0_20px_rgba(109,91,255,0.35)]
                  transition-all duration-300
                  hover:bg-[#7B6BFF] hover:shadow-[0_0_32px_rgba(109,91,255,0.50)]
                "
              >
                Open your workspace
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
