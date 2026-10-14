"use client";

import { useRef } from "react";
import type React from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

function FcBar({ title }: { title: string }) {
  return (
    <div className="bg-[#0D1120] border-b border-[rgba(255,255,255,.03)] px-3.5 py-[9px] flex items-center gap-1.5">
      <div className="flex gap-[5px]">
        {["rgba(239,68,68,.28)", "rgba(245,158,11,.28)", "rgba(34,197,94,.28)"].map((c) => (
          <span key={c} className="w-[7px] h-[7px] rounded-full" style={{ background: c }} />
        ))}
      </div>
      <span className="text-[10px] text-[rgba(61,69,88,.9)] ml-[5px] tracking-[-0.01em]">{title}</span>
    </div>
  );
}

function HealthScoreCard({ title }: { title: string }) {
  const t = useTranslations("landing.v13.features");
  const rows = [
    { initials: "TK", color: "linear-gradient(135deg,#6D5BFF,#A998FF)", name: "Tomáš Kováč", sub: "Acme · 2 dni", score: 87, cls: "text-[#22c55e]", barCls: "bg-[#22c55e]" },
    { initials: "MN", color: "linear-gradient(135deg,#22D3EE,#6D5BFF)", name: "Marta Nováková", sub: "Beta · 18 dní", score: 54, cls: "text-[#f59e0b]", barCls: "bg-[#f59e0b]" },
    { initials: "PH", color: "linear-gradient(135deg,#f59e0b,#ef4444)", name: "Peter Horváth", sub: "Delta · 42 dní", score: 21, cls: "text-[#ef4444]", barCls: "bg-[#ef4444]" },
    { initials: "JS", color: "linear-gradient(135deg,#10b981,#22D3EE)", name: "Jana Svobodová", sub: "Omega · včera", score: 92, cls: "text-[#22c55e]", barCls: "bg-[#22c55e]" },
  ];
  return (
    <div className="bg-[#07090F] border border-[rgba(255,255,255,.06)] rounded-[16px] overflow-hidden" style={{ boxShadow: "0 16px 60px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.04)" }}>
      <FcBar title={title} />
      <div className="p-4 flex flex-col gap-[5px]">
        {rows.map((r) => (
          <div key={r.initials} className="flex items-center gap-2.5 bg-[#0A0D16] border border-[rgba(255,255,255,.03)] rounded-[10px] px-3 py-2.5">
            <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-extrabold text-white" style={{ background: r.color }}>{r.initials}</div>
            <div>
              <div className="text-[12px] font-medium text-[#F0F2FA] tracking-[-0.01em]">{r.name}</div>
              <div className="text-[10px] text-[rgba(61,69,88,.9)] mt-[1px]">{r.sub}</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-[8px] text-[rgba(61,69,88,.7)] mb-[2px] tracking-[0.05em]">{t("f1HealthLabel")}</div>
              <div className={cn("text-[12px] font-bold", r.cls)}>{r.score}</div>
              <div className="w-12 h-[2px] bg-[rgba(255,255,255,.04)] rounded-full overflow-hidden mt-[3px]">
                <div className={cn("h-full rounded-full", r.barCls)} style={{ width: `${r.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalsCard({ title }: { title: string }) {
  const t = useTranslations("landing.v13.features");
  const signals = [
    { dot: "bg-[#ef4444] shadow-[0_0_5px_rgba(239,68,68,.5)]", textKey: "f2Sig1Text", subKey: "f2Sig1Sub", timeKey: "f2Sig1Time", delay: ".15s" },
    { dot: "bg-[#f59e0b] shadow-[0_0_5px_rgba(245,158,11,.4)]", textKey: "f2Sig2Text", subKey: "f2Sig2Sub", timeKey: "f2Sig2Time", delay: ".4s" },
    { dot: "bg-[#22D3EE] shadow-[0_0_5px_rgba(34,211,238,.4)]", textKey: "f2Sig3Text", subKey: "f2Sig3Sub", timeKey: "f2Sig3Time", delay: ".65s" },
  ] as const;

  return (
    <div className="bg-[#07090F] border border-[rgba(255,255,255,.06)] rounded-[16px] overflow-hidden" style={{ boxShadow: "0 16px 60px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.04)" }}>
      <FcBar title={title} />
      <div className="p-4 flex flex-col gap-[5px]">
        {signals.map(({ dot, textKey, subKey, timeKey, delay }) => (
          <div
            key={textKey}
            className="flex items-start gap-2.5 bg-[#0A0D16] border border-[rgba(255,255,255,.03)] rounded-[10px] px-3 py-[11px] opacity-0"
            style={{ animation: `v13-slin .4s ease forwards`, animationDelay: delay }}
          >
            <div className={cn("w-[7px] h-[7px] rounded-full flex-shrink-0 mt-[3px]", dot)} />
            <div>
              <div className="text-[12px] font-semibold text-[#F0F2FA] mb-[2px] tracking-[-0.01em]">{t(textKey)}</div>
              <div className="text-[10px] text-[rgba(61,69,88,.9)] leading-[1.5]">{t(subKey)}</div>
              <div className="text-[9px] text-[rgba(61,69,88,.7)] mt-[3px]">{t(timeKey)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailCard({ title }: { title: string }) {
  const t = useTranslations("landing.v13.features");
  const emails = [
    { from: "Peter Horváth", timeKey: "f3Email1Time", subjectKey: "f3Email1Subject", previewKey: "f3Email1Preview", tagKey: "f3Email1Tag" },
    { from: "Peter Horváth", timeKey: "f3Email2Time", subjectKey: "f3Email2Subject", previewKey: "f3Email2Preview", tagKey: "f3Email2Tag" },
  ] as const;

  return (
    <div className="bg-[#07090F] border border-[rgba(255,255,255,.06)] rounded-[16px] overflow-hidden" style={{ boxShadow: "0 16px 60px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.04)" }}>
      <FcBar title={title} />
      <div className="p-4 flex flex-col gap-[5px]">
        {emails.map(({ from, timeKey, subjectKey, previewKey, tagKey }) => (
          <div key={timeKey} className="bg-[#0A0D16] border border-[rgba(255,255,255,.03)] rounded-[10px] px-3.5 py-3 mb-[5px]">
            <div className="text-[12px] font-semibold text-[#F0F2FA] mb-[2px] flex justify-between tracking-[-0.01em]">
              <span>{from}</span>
              <span className="text-[9px] text-[rgba(61,69,88,.7)]">{t(timeKey)}</span>
            </div>
            <div className="text-[12px] text-[rgba(138,148,168,.7)] mb-1.5">{t(subjectKey)}</div>
            <div className="text-[11px] text-[rgba(61,69,88,.9)] leading-[1.55]">{t(previewKey)}</div>
            <span className="inline-flex items-center gap-1 mt-[7px] bg-[rgba(109,91,255,.06)] border border-[rgba(109,91,255,.12)] rounded-full px-[9px] py-[2px] text-[9px] text-[rgba(139,125,255,.8)] font-semibold tracking-[-0.01em]">
              {t(tagKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[rgba(34,211,238,.04)] border border-[rgba(34,211,238,.1)] rounded-full px-3 py-[4px] text-[9px] font-bold tracking-[0.12em] uppercase text-[rgba(34,211,238,.7)]">
      <span className="w-1 h-1 rounded-full bg-[#22D3EE]" style={{ animation: "v13-blink 2s infinite" }} />
      {label}
    </span>
  );
}

export function V13Features() {
  const t = useTranslations("landing.v13.features");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  const boldTag = (chunks: React.ReactNode) => (
    <b className="text-[rgba(138,148,168,.85)] font-medium">{chunks}</b>
  );

  const panels = [
    {
      eyebrow: t("f1Eyebrow"),
      heading: t("f1Heading"),
      body: t.rich("f1Body", { b: boldTag }),
      showAiTag: true,
      reverse: false,
      card: <HealthScoreCard title={t("f1FcTitle")} />,
    },
    {
      eyebrow: t("f2Eyebrow"),
      heading: t("f2Heading"),
      body: t.rich("f2Body", { b: boldTag }),
      showAiTag: true,
      reverse: true,
      card: <SignalsCard title={t("f2FcTitle")} />,
    },
    {
      eyebrow: t("f3Eyebrow"),
      heading: t("f3Heading"),
      body: t.rich("f3Body", { b: boldTag }),
      showAiTag: false,
      reverse: false,
      card: <EmailCard title={t("f3FcTitle")} />,
    },
  ];

  return (
    <div ref={ref} className="px-6 md:px-10 pb-20">
      {panels.map(({ eyebrow, heading, body, showAiTag, reverse, card }, i) => (
        <motion.div
          key={eyebrow}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: i * 0.12 }}
          className={cn(
            "max-w-[1280px] mx-auto py-[72px] border-t border-[rgba(255,255,255,.04)]",
            "grid grid-cols-1 md:grid-cols-[320px_1fr] gap-10 md:gap-20 items-center",
            reverse && "md:[direction:rtl]",
          )}
        >
          <div className={cn(reverse && "md:[direction:ltr]")}>
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[rgba(109,91,255,.28)] mb-4">
              {eyebrow}
            </div>
            <h3
              className="font-extrabold tracking-[-0.05em] leading-[1.04] text-[#F0F2FA] mb-3.5"
              style={{ fontSize: "clamp(24px,2.8vw,38px)" }}
            >
              {heading}
            </h3>
            <p className="text-[15px] text-[rgba(138,148,168,.6)] leading-[1.75] mb-5 tracking-[-0.01em]">
              {body}
            </p>
            {showAiTag && <AiTag label={t("aiLabel")} />}
          </div>
          <div className={cn(reverse && "md:[direction:ltr]")}>{card}</div>
        </motion.div>
      ))}
    </div>
  );
}
