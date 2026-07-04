"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Zap, Globe, CheckCircle2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// LandingActivity — Trust & Enterprise section.
// Security, privacy, performance. Premium and minimal.
// ─────────────────────────────────────────────────────────────

const TRUST_STATS = [
  { value: "99.9%",  label: "Uptime SLA" },
  { value: "< 80ms", label: "Average response" },
  { value: "SOC 2",  label: "Type II certified" },
  { value: "GDPR",   label: "Fully compliant" },
];

const TRUST_POINTS = [
  {
    icon: Shield,
    title: "Enterprise security",
    desc: "SOC 2 Type II certified. Data encrypted at rest and in transit. Role-based access control across every workspace.",
  },
  {
    icon: Lock,
    title: "Your data stays yours",
    desc: "We never train AI models on your data. Your workspace memory is isolated and only accessible to your team.",
  },
  {
    icon: Zap,
    title: "Built for performance",
    desc: "Sub-100ms response times. Global CDN. Designed to handle enterprise workloads without degradation.",
  },
  {
    icon: Globe,
    title: "Globally available",
    desc: "Multi-region infrastructure. Automatic failover. 99.9% uptime SLA with full incident transparency.",
  },
];

export default function LandingActivity() {
  return (
    <section id="enterprise" className="relative overflow-hidden px-6 py-32 md:px-12">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.06) 0%, transparent 65%)", filter: "blur(80px)" }}
        />
        {/* Horizontal divider glow */}
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
            Enterprise ready
          </p>
          <h2 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[52px]">
            Secure.
            <span className="text-[#9AA3B2]"> Private. </span>
            Reliable.
          </h2>
          <p className="mx-auto mt-7 max-w-[50ch] text-[16px] leading-[1.65] text-[#9AA3B2]">
            Built from day one for organizations that require
            compliance, privacy, and enterprise-grade reliability.
          </p>
        </motion.div>

        {/* STATS ROW */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TRUST_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.6 }}
                className="flex flex-col items-center rounded-[16px] border border-white/[0.055] bg-[#0A0E17] px-5 py-5 text-center shadow-[0_4px_20px_rgba(109,91,255,0.06)]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                <span className="text-[24px] font-bold tracking-[-0.04em] text-[#F7F8FC]">
                  {stat.value}
                </span>
                <span className="mt-1 text-[11px] text-[#9AA3B2]/60">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* TRUST GRID */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_POINTS.map((point, index) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 + index * 0.07, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-6 transition-all duration-300 hover:border-white/[0.09]"
              >
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(109,91,255,0.07),transparent_50%)]" />

                <div className="relative z-10">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] border border-[rgba(109,91,255,0.20)] bg-[rgba(109,91,255,0.08)] text-[#8B7DFF]">
                    <Icon size={16} strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[14px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">
                    {point.title}
                  </h3>
                  <p className="mt-2.5 text-[12.5px] leading-[1.6] text-[#9AA3B2]">
                    {point.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* COMPLIANCE BADGES */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
        >
          {["SOC 2 Type II", "GDPR", "ISO 27001 ready", "CCPA", "End-to-end encryption", "Zero-knowledge AI"].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2 text-[12px] text-[#9AA3B2]/70"
            >
              <CheckCircle2 size={12} className="text-[#22c55e]" />
              {badge}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
