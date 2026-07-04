"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Brain, Database, Zap, Command, Users, TrendingUp,
  BarChart3, Mail, Calendar, FileText, Search,
} from "lucide-react";

type Module = { title: string; desc: string };

const MODULE_CONFIGS = [
  { icon: Brain,      accent: "#6D5BFF", glow: "rgba(109,91,255,0.10)" },
  { icon: Database,   accent: "#8B7DFF", glow: "rgba(139,125,255,0.10)" },
  { icon: Zap,        accent: "#6D5BFF", glow: "rgba(109,91,255,0.10)" },
  { icon: Command,    accent: "#22D3EE", glow: "rgba(34,211,238,0.08)" },
  { icon: Users,      accent: "#6D5BFF", glow: "rgba(109,91,255,0.10)" },
  { icon: TrendingUp, accent: "#22c55e", glow: "rgba(34,197,94,0.08)" },
  { icon: BarChart3,  accent: "#6D5BFF", glow: "rgba(109,91,255,0.10)" },
  { icon: Calendar,   accent: "#8B7DFF", glow: "rgba(139,125,255,0.10)" },
  { icon: Mail,       accent: "#6D5BFF", glow: "rgba(109,91,255,0.10)" },
  { icon: FileText,   accent: "#8B7DFF", glow: "rgba(139,125,255,0.10)" },
  { icon: Search,     accent: "#22D3EE", glow: "rgba(34,211,238,0.08)" },
];

export default function LandingFeatures() {
  const t = useTranslations("landing.features");
  const modules = t.raw("modules") as Module[];

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
            {t("eyebrow")}
          </p>
          <h2 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[56px]">
            {t("headlineLine1")}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #A998FF 0%, #F7F8FC 55%, #C4B5FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("headlineLine2")}
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-[52ch] text-[16px] leading-[1.65] text-[#9AA3B2]">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* MODULES GRID */}
        <div className="mt-20 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((mod, index) => {
            const cfg = MODULE_CONFIGS[index];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.055, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-[22px] border border-white/[0.055] bg-[#0A0E17] p-6 transition-all duration-300 hover:border-white/[0.09] hover:shadow-[0_8px_40px_rgba(109,91,255,0.12),0_0_0_1px_rgba(255,255,255,0.04)]"
                style={{ boxShadow: "0 4px 20px rgba(109,91,255,0.06), 0 0 0 1px rgba(255,255,255,0.03)" }}
              >
                {/* Top sheen */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

                {/* Hover ambient from top-left */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at top left, ${cfg.glow}, transparent 50%)` }}
                />

                {/* Bottom accent glow on hover */}
                <div
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(to right, transparent, ${cfg.accent}50, transparent)` }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-[10px] border"
                    style={{
                      background: cfg.glow,
                      borderColor: `${cfg.accent}30`,
                      color: cfg.accent,
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
                      {t("statusLive")}
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
