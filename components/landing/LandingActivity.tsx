"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Shield, Lock, Zap, Globe, CheckCircle2 } from "lucide-react";

type Stat = { value: string; label: string };
type TrustPoint = { title: string; desc: string };

const TRUST_ICONS = [Shield, Lock, Zap, Globe];

export default function LandingActivity() {
  const t = useTranslations("landing.trust");
  const stats = t.raw("stats") as Stat[];
  const trustPoints = t.raw("trustPoints") as TrustPoint[];
  const badges = t.raw("badges") as string[];

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
            {t("eyebrow")}
          </p>
          <h2 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[52px]">
            {t("headlineLine1")}
            <span className="text-[#9AA3B2]"> {t("headlineLine2")} </span>
            {t("headlineLine3")}
          </h2>
          <p className="mx-auto mt-7 max-w-[50ch] text-[16px] leading-[1.65] text-[#9AA3B2]">
            {t("subtitle")}
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
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.6 }}
                className="relative flex flex-col items-center rounded-[16px] border border-white/[0.055] bg-[#0A0E17] px-5 py-5 text-center shadow-[0_4px_20px_rgba(109,91,255,0.06)]"
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
          {trustPoints.map((point, index) => {
            const Icon = TRUST_ICONS[index];
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
          {badges.map((badge) => (
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
