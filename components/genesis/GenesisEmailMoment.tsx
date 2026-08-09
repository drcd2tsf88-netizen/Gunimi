"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Section } from "./Section";
import { SectionContainer } from "./SectionContainer";
import { Reveal } from "./Reveal";

// ── HighlightSpan ──────────────────────────────────────────────
// Inline animated highlight with a soft glow.

interface HighlightSpanProps {
  children: React.ReactNode;
  color: "violet" | "amber" | "emerald";
  delay: number;
}

const HIGHLIGHT_STYLES: Record<
  HighlightSpanProps["color"],
  { bg: string; text: string; glow: string }
> = {
  violet:  { bg: "rgba(139,92,246,0.18)", text: "#c4b5fd", glow: "rgba(139,92,246,0.25)" },
  amber:   { bg: "rgba(251,191,36,0.14)", text: "#fcd34d", glow: "rgba(251,191,36,0.22)" },
  emerald: { bg: "rgba(52,211,153,0.15)", text: "#6ee7b7", glow: "rgba(52,211,153,0.22)" },
};

function HighlightSpan({ children, color }: Omit<HighlightSpanProps, "delay">) {
  const s = HIGHLIGHT_STYLES[color];
  return (
    <span style={{
      backgroundColor: s.bg,
      color: s.text,
      boxShadow: `0 0 14px ${s.glow}`,
      borderRadius: "5px",
      padding: "1px 6px",
      fontWeight: 500,
    }}>
      {children}
    </span>
  );
}

// ── ActionRow ─────────────────────────────────────────────────

function ActionRow({ label, delay }: { label: string; delay: number }) {
  return (
    <Reveal x={12} y={0} delay={delay} duration={0.45} className="flex items-start gap-2.5">
      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400/70" />
      <span className="text-[13px] leading-snug text-white/60">{label}</span>
    </Reveal>
  );
}

// ── GenesisEmailMoment ────────────────────────────────────────

export function GenesisEmailMoment() {
  const t = useTranslations("landing.actEmail");
  const actions = t.raw("actions") as string[];

  return (
    <Section id="email-moment" ambient="violet">

      {/* Ambient glow behind the section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 50% 50%, rgba(109,91,255,0.06), transparent)",
        }}
      />

      <SectionContainer maxWidth="content" className="relative z-10">

        {/* ── Section heading ──────────────────────────────── */}
        <div className="mb-14 max-w-[560px]">
          <Reveal y={18} duration={0.9}>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[#9AA3B2]/45">
              {t("intro")}
            </p>
            <h2 className="text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--g-text)] md:text-[40px]">
              {t("heading")}
            </h2>
          </Reveal>
          <Reveal y={12} duration={0.8} delay={0.15}>
            <p className="mt-4 text-[16px] leading-[1.65] text-[#9AA3B2] md:text-[17px]">
              {t("subheading")}
            </p>
          </Reveal>
        </div>

        {/* ── Two-column layout ────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start lg:gap-10">

          {/* Email card */}
          <Reveal y={20} duration={1.0} delay={0.1}>
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#06070E",
                boxShadow:
                  "0 4px 40px rgba(0,0,0,0.5), 0 0 80px rgba(109,91,255,0.05)",
              }}
            >
              {/* Chrome bar */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-white/[0.07]" />
                </div>
                <div className="ml-2 flex-1 rounded-md bg-white/[0.03] px-3 py-1">
                  <span className="text-[10px] text-white/15">inbox</span>
                </div>
              </div>

              {/* Email meta */}
              <div
                className="px-6 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-[11px] text-white/25">From:</span>
                  <HighlightSpan color="violet">
                    {t("from")}
                  </HighlightSpan>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white/25">Subject:</span>
                  <span className="text-[13px] font-medium text-white/55">{t("subject")}</span>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6 text-[15px] leading-[2] text-white/40">
                <span>{t("bodyPart1")} </span>
                <HighlightSpan color="amber">
                  {t("highlight2")}
                </HighlightSpan>
                <span> {t("bodyPart2")} </span>
                <HighlightSpan color="emerald">
                  {t("highlight3")}
                </HighlightSpan>
                <span>{t("bodyPart3")}</span>
              </div>

              {/* Legend */}
              <div
                className="flex flex-wrap gap-4 px-6 py-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
              >
                {(
                  [
                    { color: "#c4b5fd", label: "Contact" },
                    { color: "#fcd34d", label: "Meeting" },
                    { color: "#6ee7b7", label: "Deal" },
                  ] as const
                ).map(({ color, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 text-[11px] text-white/20"
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: color, opacity: 0.7 }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Gunimi understood panel */}
          <Reveal y={18} duration={0.85} delay={0.25}>
            <div
              className="rounded-2xl p-6"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#06070E",
                boxShadow: "0 4px 40px rgba(0,0,0,0.4)",
              }}
            >
              {/* Panel heading */}
              <div className="mb-5 flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: "#6ee7b7",
                    boxShadow: "0 0 8px rgba(52,211,153,0.6)",
                  }}
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9AA3B2]/40">
                  {t("panelTitle")}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {actions.map((action, i) => (
                  <ActionRow key={action} label={action} delay={0.4 + i * 0.1} />
                ))}
              </div>

              {/* Separator + status */}
              <div
                className="mt-6 pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p className="text-[11px] text-white/20">
                  {t("processedNote")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionContainer>
    </Section>
  );
}
