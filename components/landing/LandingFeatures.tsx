"use client";

import { motion } from "framer-motion";
import {
  Brain, Database, Zap, Command, Users, TrendingUp,
  BarChart3, Mail, Calendar, FileText, Search,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// LandingFeatures — 11 intelligent workspace modules.
// Dark Titanium cards, GDL hover lighting, ambient glow.
// Each card is a module, not a bullet point.
// ─────────────────────────────────────────────────────────────

const MODULES = [
  {
    icon:  Brain,
    title: "AI Intelligence",
    desc:  "Real-time analysis, summaries, and insights generated continuously across your workspace.",
    accent: "#6D5BFF",
    glow:   "rgba(109,91,255,0.10)",
  },
  {
    icon:  Database,
    title: "Memory",
    desc:  "Everything Gunimi learns about your business, customers, and history stays permanently accessible.",
    accent: "#8B7DFF",
    glow:   "rgba(139,125,255,0.10)",
  },
  {
    icon:  Zap,
    title: "Automation",
    desc:  "Build workflows that run on their own. Trigger actions, send notifications, update records.",
    accent: "#6D5BFF",
    glow:   "rgba(109,91,255,0.10)",
  },
  {
    icon:  Command,
    title: "Command Center",
    desc:  "One keyboard shortcut. Every action. Ask Gunimi anything about your business.",
    accent: "#22D3EE",
    glow:   "rgba(34,211,238,0.08)",
  },
  {
    icon:  Users,
    title: "Contacts & CRM",
    desc:  "A living graph of every company, contact, and relationship. Always up to date.",
    accent: "#6D5BFF",
    glow:   "rgba(109,91,255,0.10)",
  },
  {
    icon:  TrendingUp,
    title: "Deals & Pipeline",
    desc:  "See your pipeline, track progress, and get AI guidance on which deals to prioritize.",
    accent: "#22c55e",
    glow:   "rgba(34,197,94,0.08)",
  },
  {
    icon:  BarChart3,
    title: "Analytics",
    desc:  "Revenue, activity, and performance tracked automatically. No manual reporting.",
    accent: "#6D5BFF",
    glow:   "rgba(109,91,255,0.10)",
  },
  {
    icon:  Calendar,
    title: "Calendar",
    desc:  "Scheduling, time blocks, and meeting preparation — integrated with your workspace context.",
    accent: "#8B7DFF",
    glow:   "rgba(139,125,255,0.10)",
  },
  {
    icon:  Mail,
    title: "Email",
    desc:  "Send, track, and automate outreach. AI writes the first draft. You approve and send.",
    accent: "#6D5BFF",
    glow:   "rgba(109,91,255,0.10)",
  },
  {
    icon:  FileText,
    title: "Notes",
    desc:  "Capture decisions, meeting notes, and knowledge. AI links them to the right context.",
    accent: "#8B7DFF",
    glow:   "rgba(139,125,255,0.10)",
  },
  {
    icon:  Search,
    title: "Observatory",
    desc:  "A live view of everything happening in your workspace — automated signals, alerts, and intelligence.",
    accent: "#22D3EE",
    glow:   "rgba(34,211,238,0.08)",
  },
];

export default function LandingFeatures() {
  return (
    <section id="systems" className="relative overflow-hidden px-6 py-32 md:px-12">

      {/* BACKGROUND AMBIENCE */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[5%] top-[10%] h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(109,91,255,0.07) 0%, transparent 70%)", filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-[10%] right-[5%] h-[360px] w-[360px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)", filter: "blur(120px)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6D5BFF]">
            Every system in one place
          </p>
          <h2 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[56px]">
            Eleven modules.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #A998FF 0%, #F7F8FC 55%, #C4B5FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              One operating system.
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-[52ch] text-[16px] leading-[1.65] text-[#9AA3B2]">
            Everything your business needs. Not as separate apps — as a single intelligent workspace
            where every module knows about every other module.
          </p>
        </motion.div>

        {/* MODULES GRID */}
        <div className="mt-20 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.055, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-[22px] border border-white/[0.055] bg-[#0A0E17] p-6 transition-all duration-300 hover:border-white/[0.09] hover:shadow-[0_8px_40px_rgba(109,91,255,0.12),0_0_0_1px_rgba(255,255,255,0.04)]"
                style={{ boxShadow: "0 4px_20px_rgba(109,91,255,0.06),0_0_0_1px_rgba(255,255,255,0.03)" }}
              >
                {/* Top sheen */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

                {/* Hover ambient from top-left */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at top left, ${mod.glow}, transparent 50%)` }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-[10px] border"
                    style={{
                      background: `${mod.glow}`,
                      borderColor: `${mod.accent}30`,
                      color: mod.accent,
                    }}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </div>

                  {/* Text */}
                  <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-[#F7F8FC]">
                    {mod.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-[1.6] text-[#9AA3B2]">
                    {mod.desc}
                  </p>

                  {/* Status */}
                  <div className="mt-5 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/45">
                      Live
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
