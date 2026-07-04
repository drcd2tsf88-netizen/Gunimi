"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Database, Zap, Bot, Eye, Command } from "lucide-react";
import { useTranslations } from "next-intl";
import AiCore from "@/components/ui/AiCore";

type Node = { title: string; desc: string };

const NODE_CONFIGS = [
  { icon: Database, color: "#8B7DFF" },
  { icon: Zap,      color: "#6D5BFF" },
  { icon: Bot,      color: "#22D3EE" },
  { icon: Eye,      color: "#A998FF" },
  { icon: Command,  color: "#6D5BFF" },
];

export default function LandingObservatory() {
  const t = useTranslations("landing.observatory");
  const nodes = t.raw("nodes") as Node[];

  return (
    <section id="ai" className="relative overflow-hidden px-6 py-32 md:px-12">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(ellipse, rgba(109,91,255,0.08) 0%, transparent 60%)", filter: "blur(80px)" }}
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
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#22D3EE]">
            {t("eyebrow")}
          </p>
          <h2 className="text-[40px] font-bold leading-[0.95] tracking-[-0.04em] text-[#F7F8FC] md:text-[56px]">
            {t("headlineLine1")}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #A998FF 0%, #F7F8FC 50%, #22D3EE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("headlineLine2")}
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-[50ch] text-[16px] leading-[1.65] text-[#9AA3B2]">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* AI ECOSYSTEM — center composition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-20 max-w-4xl"
        >
          {/* Outer container card */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.055] bg-[#0A0E17] p-8 shadow-[0_20px_60px_rgba(109,91,255,0.14),0_0_0_1px_rgba(255,255,255,0.03)] md:p-12">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(circle at center, rgba(109,91,255,0.06), transparent 60%)" }}
            />

            {/* Central AI Core with label */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                <AiCore size={180} showRings showParticles intensity="strong" />
              </motion.div>

              <div className="mt-4 text-center">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6D5BFF]">
                  {t("coreName")}
                </p>
                <p className="mt-1 text-[12px] text-[#9AA3B2]/60">
                  {t("coreSubtitle")}
                </p>
              </div>
            </div>

            {/* AI Nodes — grid layout below core */}
            <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {nodes.map((node, index) => {
                const cfg = NODE_CONFIGS[index];
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={node.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + index * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex flex-col items-center rounded-[16px] border border-white/[0.05] bg-white/[0.025] p-4 text-center transition-all duration-300 hover:border-white/[0.09] hover:bg-white/[0.04]"
                  >
                    <div
                      className="mb-3 flex h-9 w-9 items-center justify-center rounded-[9px]"
                      style={{ background: `${cfg.color}18`, color: cfg.color }}
                    >
                      <Icon size={16} strokeWidth={1.75} />
                    </div>
                    <p className="text-[12px] font-semibold text-[#F7F8FC]">{node.title}</p>
                    <p className="mt-1 text-[11px] leading-[1.5] text-[#9AA3B2]/60">{node.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* BOTTOM CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/register"
            className="
              group flex items-center gap-2.5
              rounded-[12px] border border-[#6D5BFF]/[0.20]
              bg-[rgba(109,91,255,0.08)] px-6 py-3.5
              text-[13px] font-medium text-[#A998FF]
              transition-all duration-300
              hover:border-[#6D5BFF]/[0.35] hover:bg-[rgba(109,91,255,0.14)]
            "
          >
            {t("exploreCta")}
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
