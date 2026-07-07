"use client";

import { useState } from "react";
import AiCore from "@/components/ui/AiCore";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import {
  Cpu, Layers, Type, Space, Circle, BoxSelect, Zap, Wind,
  Sparkles, MousePointerClick, BarChart3, Table2, AlertCircle,
  CheckCircle2, Info, AlertTriangle, Palette, Move,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// GDL v1.0 — Living Design Playground
// Internal developer reference. Not user-facing.
// ─────────────────────────────────────────────────────────────

const NAV = [
  { id: "colors",     label: "Colors",      icon: Palette },
  { id: "typography", label: "Typography",  icon: Type },
  { id: "spacing",    label: "Spacing",     icon: Space },
  { id: "radius",     label: "Radius",      icon: Circle },
  { id: "shadows",    label: "Shadows",     icon: Layers },
  { id: "materials",  label: "Materials",   icon: BoxSelect },
  { id: "buttons",    label: "Buttons",     icon: MousePointerClick },
  { id: "inputs",     label: "Inputs",      icon: Cpu },
  { id: "ai-core",    label: "AI Core",     icon: Sparkles },
  { id: "motion",     label: "Motion",      icon: Wind },
  { id: "charts",     label: "Charts",      icon: BarChart3 },
  { id: "tables",     label: "Tables",      icon: Table2 },
  { id: "status",     label: "Status",      icon: Zap },
  { id: "states",     label: "AI States",   icon: Move },
] as const;

type SectionId = typeof NAV[number]["id"];

const COLOR_TOKENS = [
  { group: "Background",   tokens: [
    { name: "--g-bg",        hex: "#05060A", label: "Deep Space" },
    { name: "--g-surface",   hex: "#0A0E17", label: "Titanium" },
    { name: "--g-surface-2", hex: "#0F1520", label: "Elevated" },
    { name: "--g-surface-3", hex: "#161E2E", label: "Float" },
  ]},
  { group: "Primary Identity", tokens: [
    { name: "--g-primary",   hex: "#6D5BFF", label: "Brand" },
    { name: "--g-primary-2", hex: "#8B7DFF", label: "Hover" },
    { name: "--g-primary-3", hex: "#A998FF", label: "Accent" },
    { name: "--g-primary-4", hex: "#C4B5FF", label: "Light" },
  ]},
  { group: "AI Accent", tokens: [
    { name: "--g-ai",   hex: "#22D3EE", label: "Cyan — AI only" },
    { name: "--g-ai-2", hex: "#67E8F9", label: "Cyan Light" },
  ]},
  { group: "Text Scale", tokens: [
    { name: "--g-text",   hex: "#F7F8FC", label: "Primary" },
    { name: "--g-text-2", hex: "#C8CDD8", label: "Secondary" },
    { name: "--g-muted",  hex: "#9AA3B2", label: "Tertiary" },
  ]},
  { group: "Status", tokens: [
    { name: "--g-success", hex: "#22c55e", label: "Success" },
    { name: "--g-warning", hex: "#f59e0b", label: "Warning" },
    { name: "--g-danger",  hex: "#ef4444", label: "Danger" },
    { name: "--g-info",    hex: "#3b82f6", label: "Info" },
  ]},
  { group: "Chart Palette", tokens: [
    { name: "--g-chart-1", hex: "#6D5BFF", label: "Primary" },
    { name: "--g-chart-2", hex: "#22D3EE", label: "AI" },
    { name: "--g-chart-3", hex: "#A998FF", label: "Accent" },
    { name: "--g-chart-4", hex: "#34d399", label: "Emerald" },
    { name: "--g-chart-5", hex: "#f59e0b", label: "Amber" },
    { name: "--g-chart-6", hex: "#f472b6", label: "Rose" },
    { name: "--g-chart-7", hex: "#60a5fa", label: "Blue" },
    { name: "--g-chart-8", hex: "#fb923c", label: "Orange" },
  ]},
];

const RADIUS_TOKENS = [
  { name: "--g-radius-xs",   value: "4px",     tailwind: "rounded-[4px]" },
  { name: "--g-radius-sm",   value: "6px",     tailwind: "rounded-[6px]" },
  { name: "--g-radius-md",   value: "10px",    tailwind: "rounded-[10px]" },
  { name: "--g-radius-lg",   value: "14px",    tailwind: "rounded-[14px]" },
  { name: "--g-radius-xl",   value: "18px",    tailwind: "rounded-[18px]" },
  { name: "--g-radius-2xl",  value: "22px",    tailwind: "rounded-[22px]" },
  { name: "--g-radius-3xl",  value: "28px",    tailwind: "rounded-[28px]" },
  { name: "--g-radius-pill", value: "9999px",  tailwind: "rounded-full" },
];

const SPACING_TOKENS = [
  { name: "--g-space-1",  value: "4px" },
  { name: "--g-space-2",  value: "8px" },
  { name: "--g-space-3",  value: "12px" },
  { name: "--g-space-4",  value: "16px" },
  { name: "--g-space-5",  value: "20px" },
  { name: "--g-space-6",  value: "24px" },
  { name: "--g-space-8",  value: "32px" },
  { name: "--g-space-10", value: "40px" },
  { name: "--g-space-12", value: "48px" },
  { name: "--g-space-16", value: "64px" },
  { name: "--g-space-20", value: "80px" },
  { name: "--g-space-24", value: "96px" },
  { name: "--g-space-32", value: "128px" },
];

const SHADOW_TOKENS = [
  { name: "--g-shadow-xs", label: "XS", desc: "Chips, inline" },
  { name: "--g-shadow-sm", label: "SM", desc: "Small cards, buttons" },
  { name: "--g-shadow-md", label: "MD", desc: "Standard cards" },
  { name: "--g-shadow-lg", label: "LG", desc: "Dropdowns, popovers" },
  { name: "--g-shadow-xl", label: "XL", desc: "Dialogs, command" },
];

const DURATION_TOKENS = [
  { name: "--g-duration-instant", value: "80ms",    usage: "Icon color swap" },
  { name: "--g-duration-xs",      value: "120ms",   usage: "Tooltip" },
  { name: "--g-duration-sm",      value: "200ms",   usage: "Hover states" },
  { name: "--g-duration-md",      value: "300ms",   usage: "Cards, buttons" },
  { name: "--g-duration-lg",      value: "450ms",   usage: "Panel open/close" },
  { name: "--g-duration-xl",      value: "650ms",   usage: "Page entrances" },
  { name: "--g-duration-2xl",     value: "950ms",   usage: "Hero animations" },
  { name: "--g-duration-ai-breathe",    value: "4500ms",  usage: "AI Core breath" },
  { name: "--g-duration-ai-orbit-fast", value: "36000ms", usage: "Inner ring" },
  { name: "--g-duration-ai-orbit-mid",  value: "58000ms", usage: "Mid ring" },
  { name: "--g-duration-ai-orbit-slow", value: "88000ms", usage: "Outer ring" },
];

const EASING_TOKENS = [
  { name: "--g-ease",        value: "cubic-bezier(0.16, 1, 0.3, 1)",       usage: "Default — fast start, slow end" },
  { name: "--g-ease-out",    value: "cubic-bezier(0.0, 0.0, 0.2, 1)",      usage: "Exiting elements" },
  { name: "--g-ease-in",     value: "cubic-bezier(0.4, 0, 1, 1)",          usage: "Entering at speed" },
  { name: "--g-ease-spring", value: "cubic-bezier(0.34, 1.56, 0.64, 1)",   usage: "Bouncy entrances (rare)" },
  { name: "--g-ease-smooth", value: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", usage: "Continuous animations" },
];

const AI_CORE_USAGES = [
  { label: "Hero",        size: 140, showRings: true,  showParticles: true,  intensity: "subtle"  as const, desc: "Landing page background, opacity-40" },
  { label: "Loading",     size: 80,  showRings: true,  showParticles: true,  intensity: "medium"  as const, desc: "Auth / initialization screens" },
  { label: "Sidebar",     size: 36,  showRings: false, showParticles: false, intensity: "strong"  as const, desc: "Logo mark — dot only" },
  { label: "Section",     size: 48,  showRings: false, showParticles: false, intensity: "medium"  as const, desc: "AI feature header mark" },
  { label: "Memory",      size: 80,  showRings: true,  showParticles: false, intensity: "medium"  as const, desc: "Rings, no particles" },
  { label: "Chat",        size: 100, showRings: true,  showParticles: true,  intensity: "strong"  as const, desc: "Command center — full intensity" },
  { label: "Automation",  size: 72,  showRings: true,  showParticles: false, intensity: "medium"  as const, desc: "Workflow dashboard" },
  { label: "Observatory", size: 88,  showRings: true,  showParticles: true,  intensity: "subtle"  as const, desc: "Rings + particles, subtle" },
];

const TYPE_SCALE = [
  { name: "Hero XXL",  size: "text-[96px]",  weight: "font-bold",     spacing: "tracking-[-0.06em]", sample: "Gunimi" },
  { name: "Hero XL",   size: "text-[56px]",  weight: "font-semibold", spacing: "tracking-[-0.05em]", sample: "AI Workspace OS" },
  { name: "H1",        size: "text-[40px]",  weight: "font-semibold", spacing: "tracking-[-0.03em]", sample: "Dashboard Overview" },
  { name: "H2",        size: "text-[30px]",  weight: "font-semibold", spacing: "tracking-[-0.025em]",sample: "Section Title" },
  { name: "H3",        size: "text-[22px]",  weight: "font-semibold", spacing: "tracking-[-0.02em]", sample: "Subsection" },
  { name: "Title",     size: "text-[17px]",  weight: "font-semibold", spacing: "tracking-[-0.015em]",sample: "Card Title" },
  { name: "Subtitle",  size: "text-[15px]",  weight: "font-medium",   spacing: "tracking-[-0.01em]", sample: "Card subtitle or description" },
  { name: "Body",      size: "text-[14px]",  weight: "font-normal",   spacing: "",                   sample: "Default body text used in most places throughout the product." },
  { name: "Small",     size: "text-[13px]",  weight: "font-normal",   spacing: "",                   sample: "Secondary text, descriptions, helper copy." },
  { name: "Caption",   size: "text-[11px]",  weight: "font-medium",   spacing: "tracking-[0.04em] uppercase",  sample: "Label · Badge · Timestamp" },
  { name: "Numbers",   size: "text-[28px]",  weight: "font-bold",     spacing: "tracking-[-0.04em] font-mono", sample: "€42,381" },
];

function SectionHeader({ id, title, desc }: { id: string; title: string; desc: string }) {
  return (
    <div id={id} className="mb-8 scroll-mt-20">
      <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{title}</h2>
      <p className="mt-1 text-[13px] text-[#9AA3B2]">{desc}</p>
      <div className="mt-4 h-px bg-gradient-to-r from-white/[0.07] to-transparent" />
    </div>
  );
}

function TokenPill({ name }: { name: string }) {
  return (
    <code className="rounded-[6px] border border-white/[0.06] bg-[#0F1520] px-2 py-0.5 text-[11px] text-[#A998FF]">
      {name}
    </code>
  );
}

export default function DesignSystemView() {
  const [activeSection, setActiveSection] = useState<SectionId>("colors");
  const [loadingBtn, setLoadingBtn] = useState(false);

  const scrollTo = (id: SectionId) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const simulateLoad = () => {
    setLoadingBtn(true);
    setTimeout(() => setLoadingBtn(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#05060A] text-[#F7F8FC]">
      {/* ── SIDEBAR NAV ── */}
      <aside className="sticky top-0 h-screen w-52 shrink-0 overflow-y-auto border-r border-white/[0.04] bg-[#05060A] py-8">
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <AiCore size={28} showRings={false} showParticles={false} intensity="strong" />
            <span className="text-[13px] font-semibold text-[#F7F8FC]">GDL v1.0</span>
          </div>
          <p className="text-[11px] text-[#9AA3B2]/60 leading-relaxed">Design System Playground</p>
        </div>

        <nav aria-label="Design system navigation" className="px-3 space-y-0.5">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={[
                "flex w-full items-center gap-2.5 rounded-[9px] px-3 py-2 text-[13px] text-left transition-all duration-200",
                activeSection === id
                  ? "bg-[#0F1520] text-[#F7F8FC] shadow-[inset_2px_0_0_#6D5BFF]"
                  : "text-[#9AA3B2]/70 hover:bg-white/[0.025] hover:text-[#9AA3B2]",
              ].join(" ")}
            >
              <Icon size={14} strokeWidth={1.75} className="shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto px-10 py-12 max-w-5xl">

        {/* PAGE HERO */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <AiCore size={56} showRings showParticles intensity="medium" />
            <div>
              <h1 className="text-[32px] font-bold tracking-[-0.04em] text-[#F7F8FC]">
                Gunimi Design Language
              </h1>
              <p className="text-[13px] text-[#9AA3B2] mt-0.5">GDL v1.0 — Living Design Playground</p>
            </div>
          </div>
          <p className="max-w-2xl text-[14px] text-[#C8CDD8] leading-relaxed">
            The single source of truth for every visual decision in Gunimi. Every token, component, and
            interaction demonstrated live. Read{" "}
            <code className="text-[#A998FF] text-[12px]">docs/design-language/</code> for the full
            specification.
          </p>
        </div>

        {/* ── COLORS ── */}
        <section className="mb-16">
          <SectionHeader
            id="colors"
            title="Color System"
            desc="All tokens live in styles/orbit-theme.css under the --g-* namespace."
          />
          <div className="space-y-8">
            {COLOR_TOKENS.map((group) => (
              <div key={group.group}>
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-[#9AA3B2]/60">
                  {group.group}
                </p>
                <div className="flex flex-wrap gap-3">
                  {group.tokens.map((t) => (
                    <div key={t.name} className="flex flex-col gap-2">
                      <div
                        className="h-14 w-24 rounded-[10px] border border-white/[0.06]"
                        style={{ background: t.hex }}
                        title={t.hex}
                      />
                      <div>
                        <TokenPill name={t.name} />
                        <p className="mt-0.5 text-[11px] text-[#9AA3B2]">{t.label}</p>
                        <p className="text-[11px] text-[#9AA3B2]/50 font-mono">{t.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Transparent tokens note */}
          <div className="mt-8 rounded-[12px] border border-white/[0.06] bg-[#0A0E17] p-4">
            <p className="text-[12px] text-[#9AA3B2]">
              <span className="text-[#A998FF]">Transparency tokens</span> (borders, glows, overlays) are
              rgba values and not shown as swatches. See{" "}
              <code className="text-[11px] text-[#9AA3B2]">docs/design-language/02-color-system.md</code>.
            </p>
          </div>
        </section>

        {/* ── TYPOGRAPHY ── */}
        <section className="mb-16">
          <SectionHeader
            id="typography"
            title="Typography"
            desc="Inter only. Tight negative tracking on headings. Mono for all data."
          />
          <div className="space-y-6">
            {TYPE_SCALE.map((t) => (
              <div key={t.name} className="flex items-baseline gap-6">
                <div className="w-20 shrink-0">
                  <p className="text-[11px] font-medium text-[#9AA3B2]/60 uppercase tracking-[0.10em]">
                    {t.name}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${t.size} ${t.weight} ${t.spacing} text-[#F7F8FC] leading-none truncate`}>
                    {t.sample}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SPACING ── */}
        <section className="mb-16">
          <SectionHeader
            id="spacing"
            title="Spacing System"
            desc="Every value is a multiple of 4px. Nothing outside this scale."
          />
          <div className="space-y-3">
            {SPACING_TOKENS.map((t) => (
              <div key={t.name} className="flex items-center gap-4">
                <TokenPill name={t.name} />
                <code className="w-14 text-[12px] font-mono text-[#9AA3B2]">{t.value}</code>
                <div
                  className="h-5 rounded-[3px] bg-[#6D5BFF]/40"
                  style={{ width: t.value }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── RADIUS ── */}
        <section className="mb-16">
          <SectionHeader
            id="radius"
            title="Radius Scale"
            desc="8 values from 4px chip to full pill. Components use the xl/2xl range most."
          />
          <div className="flex flex-wrap gap-5 items-end">
            {RADIUS_TOKENS.map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-2">
                <div
                  className="h-16 w-16 border border-white/[0.12] bg-[#0A0E17]"
                  style={{ borderRadius: r.value }}
                />
                <TokenPill name={r.name} />
                <code className="text-[11px] font-mono text-[#9AA3B2]">{r.value}</code>
              </div>
            ))}
          </div>
        </section>

        {/* ── SHADOWS ── */}
        <section className="mb-16">
          <SectionHeader
            id="shadows"
            title="Shadows & Glows"
            desc="All shadows are ambient purple — never black. Glows emit light from primary elements."
          />

          <p className="mb-5 text-[12px] text-[#9AA3B2]/70 uppercase tracking-[0.10em]">Shadow Scale</p>
          <div className="flex flex-wrap gap-6 mb-10">
            {SHADOW_TOKENS.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-3">
                <div
                  className="h-20 w-32 rounded-[14px] bg-[#0A0E17] border border-white/[0.06]"
                  style={{ boxShadow: `var(${s.name})` }}
                />
                <div className="text-center">
                  <p className="text-[13px] font-medium text-[#F7F8FC]">{s.label}</p>
                  <p className="text-[11px] text-[#9AA3B2]">{s.desc}</p>
                  <TokenPill name={s.name} />
                </div>
              </div>
            ))}
          </div>

          <p className="mb-5 text-[12px] text-[#9AA3B2]/70 uppercase tracking-[0.10em]">Glow Scale (primary)</p>
          <div className="flex flex-wrap gap-6">
            {["xs","sm","md","lg","xl"].map((size) => (
              <div key={size} className="flex flex-col items-center gap-3">
                <div
                  className="h-16 w-24 rounded-[12px] bg-[#6D5BFF]"
                  style={{ boxShadow: `var(--g-glow-${size})` }}
                />
                <div className="text-center">
                  <p className="text-[12px] font-medium text-[#F7F8FC] uppercase">{size}</p>
                  <TokenPill name={`--g-glow-${size}`} />
                </div>
              </div>
            ))}
            <div className="flex flex-col items-center gap-3">
              <div
                className="h-16 w-24 rounded-[12px] bg-[#22D3EE]"
                style={{ boxShadow: "var(--g-glow-ai)" }}
              />
              <div className="text-center">
                <p className="text-[12px] font-medium text-[#22D3EE] uppercase">AI</p>
                <TokenPill name="--g-glow-ai" />
              </div>
            </div>
          </div>
        </section>

        {/* ── MATERIALS ── */}
        <section className="mb-16">
          <SectionHeader
            id="materials"
            title="Materials & Surfaces"
            desc="Dark Titanium is the primary material. L0–L3 surface hierarchy. Never skip levels."
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {/* Dark Titanium */}
            <GunimiCard className="p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/50 mb-2">
                Dark Titanium
              </p>
              <p className="text-[14px] font-semibold text-[#F7F8FC]">Standard Card</p>
              <p className="text-[12px] text-[#9AA3B2] mt-1">bg-[#0A0E17] border-white/5.5%</p>
            </GunimiCard>

            {/* Interactive */}
            <GunimiCard hoverable className="p-5">
              <p className="text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/50 mb-2">
                Interactive
              </p>
              <p className="text-[14px] font-semibold text-[#F7F8FC]">Hoverable Card</p>
              <p className="text-[12px] text-[#9AA3B2] mt-1">Hover to see lift + ambient light</p>
            </GunimiCard>

            {/* AI Surface */}
            <div className="relative overflow-hidden rounded-[18px] border border-[rgba(34,211,238,0.15)] bg-[#0A0E17] p-5 shadow-[0_8px_28px_rgba(109,91,255,0.13),0_0_28px_rgba(34,211,238,0.10)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.05),transparent_50%)]" />
              <div className="relative z-10">
                <p className="text-[12px] font-medium uppercase tracking-[0.10em] text-[#22D3EE]/70 mb-2">
                  AI Surface
                </p>
                <p className="text-[14px] font-semibold text-[#F7F8FC]">Active AI Card</p>
                <p className="text-[12px] text-[#9AA3B2] mt-1">Cyan border + AI glow</p>
              </div>
            </div>

            {/* Glass */}
            <div className="relative overflow-hidden rounded-[18px] border border-white/[0.055] bg-[rgba(10,14,23,0.88)] p-5 shadow-[0_8px_28px_rgba(109,91,255,0.13)] backdrop-blur-[12px]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
              <div className="relative z-10">
                <p className="text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/50 mb-2">
                  Dark Glass
                </p>
                <p className="text-[14px] font-semibold text-[#F7F8FC]">Overlay / Dialog</p>
                <p className="text-[12px] text-[#9AA3B2] mt-1">88% opacity + blur(12px)</p>
              </div>
            </div>

            {/* Matte */}
            <div className="rounded-[18px] bg-[#05060A] p-5 border border-white/[0.03]">
              <p className="text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/50 mb-2">
                Dark Matte
              </p>
              <p className="text-[14px] font-semibold text-[#F7F8FC]">Sidebar / Page Floor</p>
              <p className="text-[12px] text-[#9AA3B2] mt-1">bg-[#05060A] — grounded</p>
            </div>

            {/* L2 elevated */}
            <div className="rounded-[18px] bg-[#0F1520] p-5 border border-white/[0.07]">
              <p className="text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/50 mb-2">
                Surface L2
              </p>
              <p className="text-[14px] font-semibold text-[#F7F8FC]">Elevated Card</p>
              <p className="text-[12px] text-[#9AA3B2] mt-1">bg-[#0F1520] — above standard</p>
            </div>
          </div>
        </section>

        {/* ── BUTTONS ── */}
        <section className="mb-16">
          <SectionHeader
            id="buttons"
            title="Button System"
            desc="4 variants, 3 states. Primary glow is brand identity — never dilute it."
          />

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/60">
                Variants
              </p>
              <div className="flex flex-wrap gap-3">
                <GunimiButton variant="primary">Primary</GunimiButton>
                <GunimiButton variant="secondary">Secondary</GunimiButton>
                <GunimiButton variant="ghost">Ghost</GunimiButton>
                <GunimiButton variant="danger">Danger</GunimiButton>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/60">
                States
              </p>
              <div className="flex flex-wrap gap-3">
                <GunimiButton variant="primary" loading={loadingBtn} onClick={simulateLoad}>
                  Loading State
                </GunimiButton>
                <GunimiButton variant="primary" disabled>
                  Disabled
                </GunimiButton>
                <GunimiButton variant="secondary" disabled>
                  Disabled
                </GunimiButton>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/60">
                Large CTA (landing)
              </p>
              <div className="flex flex-wrap gap-3">
                <GunimiButton variant="primary" className="py-3.5 px-7 text-[14px]">
                  Get Started
                </GunimiButton>
                <GunimiButton variant="secondary" className="py-3.5 px-7 text-[14px]">
                  Watch Demo
                </GunimiButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── INPUTS ── */}
        <section className="mb-16">
          <SectionHeader
            id="inputs"
            title="Input System"
            desc="Focus ring is a soft glow, not a hard outline. The surface warms on focus."
          />
          <div className="max-w-sm space-y-4">
            <div>
              <p className="mb-2 text-[12px] text-[#9AA3B2]">Default</p>
              <GunimiInput placeholder="Enter value…" />
            </div>
            <div>
              <p className="mb-2 text-[12px] text-[#9AA3B2]">With value</p>
              <GunimiInput defaultValue="Gunimi AI Workspace" />
            </div>
            <div>
              <p className="mb-2 text-[12px] text-[#9AA3B2]">Disabled</p>
              <GunimiInput placeholder="Disabled input" disabled />
            </div>
            <div>
              <p className="mb-2 text-[12px] text-[#9AA3B2]">Error state (via CSS override)</p>
              <GunimiInput
                defaultValue="invalid@"
                className="border-[rgba(239,68,68,0.35)] focus:border-[rgba(239,68,68,0.55)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.10)]"
              />
              <p className="mt-1.5 text-[12px] text-[#ef4444]">Invalid email address</p>
            </div>
          </div>
        </section>

        {/* ── AI CORE ── */}
        <section className="mb-16">
          <SectionHeader
            id="ai-core"
            title="AI Core"
            desc="8 canonical usage contexts. The visual identity of Gunimi — never decorative."
          />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {AI_CORE_USAGES.map((u) => (
              <GunimiCard key={u.label} className="p-5 text-center">
                <div className="flex justify-center mb-3">
                  <AiCore
                    size={u.size}
                    showRings={u.showRings}
                    showParticles={u.showParticles}
                    intensity={u.intensity}
                  />
                </div>
                <p className="text-[13px] font-semibold text-[#F7F8FC]">{u.label}</p>
                <p className="text-[11px] text-[#9AA3B2] mt-0.5">{`size=${u.size}`}</p>
                <p className="text-[11px] text-[#9AA3B2]/70 mt-1 leading-snug">{u.desc}</p>
              </GunimiCard>
            ))}
          </div>

          <div className="mt-6 rounded-[12px] border border-[rgba(34,211,238,0.12)] bg-[rgba(34,211,238,0.03)] p-4">
            <p className="text-[12px] text-[#67E8F9]">
              <span className="font-semibold">Rule:</span> The AI Core is a semantic element. Use it only where
              AI is operating. Never as decoration. See{" "}
              <code className="text-[11px]">docs/design-language/07-ai-core.md</code>.
            </p>
          </div>
        </section>

        {/* ── MOTION ── */}
        <section className="mb-16">
          <SectionHeader
            id="motion"
            title="Motion Language"
            desc="Duration and easing tokens. UI motion: 80–650ms. AI motion: 3200–88000ms."
          />

          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/60">
            Duration Tokens
          </p>
          <div className="overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#0A0E17] mb-8">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]">Token</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]">Value</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]">Usage</th>
                </tr>
              </thead>
              <tbody>
                {DURATION_TOKENS.map((t, i) => (
                  <tr key={t.name} className={i % 2 === 0 ? "" : "bg-white/[0.015]"}>
                    <td className="px-4 py-2.5"><TokenPill name={t.name} /></td>
                    <td className="px-4 py-2.5 font-mono text-[12px] text-[#9AA3B2]">{t.value}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#9AA3B2]">{t.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/60">
            Easing Tokens
          </p>
          <div className="overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#0A0E17]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]">Token</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]">Curve</th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]">Usage</th>
                </tr>
              </thead>
              <tbody>
                {EASING_TOKENS.map((t, i) => (
                  <tr key={t.name} className={i % 2 === 0 ? "" : "bg-white/[0.015]"}>
                    <td className="px-4 py-2.5"><TokenPill name={t.name} /></td>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-[#9AA3B2] leading-snug">{t.value}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#9AA3B2]">{t.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── CHARTS ── */}
        <section className="mb-16">
          <SectionHeader
            id="charts"
            title="Chart Palette"
            desc="8 colors, always used in sequence. Visually distinct on dark backgrounds."
          />
          <div className="flex flex-wrap gap-3">
            {COLOR_TOKENS.find((g) => g.group === "Chart Palette")?.tokens.map((t, i) => (
              <div key={t.name} className="flex flex-col items-center gap-1.5">
                <div
                  className="h-10 w-10 rounded-[8px] flex items-center justify-center text-[11px] font-bold text-white/80"
                  style={{ background: t.hex }}
                >
                  {i + 1}
                </div>
                <code className="text-[10px] font-mono text-[#9AA3B2]">{t.hex}</code>
              </div>
            ))}
          </div>
          <div className="mt-6 flex h-32 w-full overflow-hidden rounded-[12px] border border-white/[0.06]">
            {COLOR_TOKENS.find((g) => g.group === "Chart Palette")?.tokens.map((t) => (
              <div
                key={t.name}
                className="flex-1 h-full"
                style={{ background: t.hex, opacity: 0.75 }}
                title={t.hex}
              />
            ))}
          </div>
        </section>

        {/* ── TABLES ── */}
        <section className="mb-16">
          <SectionHeader
            id="tables"
            title="Table System"
            desc="Minimal grid, hover rows, left-border selection. Header: 10.5px uppercase."
          />
          <div className="overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#0A0E17]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Name", "Status", "Value", "Updated"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10.5px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Acme Corp",       status: "Active",  value: "€84,200", updated: "2h ago" },
                  { name: "Nova Systems",    status: "In Review",value: "€31,500", updated: "1d ago" },
                  { name: "Orbit Ventures",  status: "Closed",  value: "€12,000", updated: "3d ago" },
                  { name: "Starbridge Labs", status: "Active",  value: "€220,000",updated: "5m ago" },
                ].map((row, i) => (
                  <tr
                    key={row.name}
                    className={[
                      "border-b border-white/[0.03] transition-colors duration-150",
                      "hover:bg-[rgba(109,91,255,0.04)]",
                      i === 1 ? "bg-[rgba(109,91,255,0.06)] border-l-2 border-l-[rgba(109,91,255,0.3)]" : "",
                    ].join(" ")}
                  >
                    <td className="px-4 py-3 font-medium text-[#F7F8FC]">{row.name}</td>
                    <td className="px-4 py-3">
                      <span className={[
                        "rounded-full px-2.5 py-1 text-[11px] font-medium",
                        row.status === "Active"    ? "bg-[rgba(34,197,94,0.10)] text-[#22c55e]" :
                        row.status === "Closed"    ? "bg-[rgba(255,255,255,0.04)] text-[#9AA3B2]" :
                                                     "bg-[rgba(109,91,255,0.10)] text-[#A998FF]",
                      ].join(" ")}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-[#C8CDD8]">{row.value}</td>
                    <td className="px-4 py-3 text-[12px] text-[#9AA3B2]">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-[#9AA3B2]/60">Row 2 shown in selected state (left border + background tint).</p>
        </section>

        {/* ── STATUS ── */}
        <section className="mb-16">
          <SectionHeader
            id="status"
            title="Status Colors"
            desc="Always paired with text labels — never color alone to convey meaning."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { color: "#22c55e", soft: "rgba(34,197,94,0.10)",   border: "rgba(34,197,94,0.20)",   label: "Success", icon: CheckCircle2 },
              { color: "#f59e0b", soft: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.20)",  label: "Warning", icon: AlertTriangle },
              { color: "#ef4444", soft: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.20)",   label: "Danger",  icon: AlertCircle },
              { color: "#3b82f6", soft: "rgba(59,130,246,0.10)",  border: "rgba(59,130,246,0.20)",  label: "Info",    icon: Info },
            ].map(({ color, soft, border, label, icon: StatusIcon }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-[12px] border p-4"
                style={{ background: soft, borderColor: border }}
              >
                <StatusIcon size={16} style={{ color }} />
                <span className="text-[13px] font-medium" style={{ color }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Status chips */}
          <p className="mt-8 mb-4 text-[12px] font-medium uppercase tracking-[0.10em] text-[#9AA3B2]/60">
            Status Chips
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Active",     bg: "rgba(34,197,94,0.10)",   border: "rgba(34,197,94,0.20)",   text: "#22c55e" },
              { label: "Thinking",   bg: "rgba(34,211,238,0.06)",  border: "rgba(34,211,238,0.15)",  text: "#22D3EE" },
              { label: "In Review",  bg: "rgba(109,91,255,0.08)",  border: "rgba(109,91,255,0.20)",  text: "#A998FF" },
              { label: "Closed",     bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", text: "#9AA3B2" },
              { label: "Error",      bg: "rgba(239,68,68,0.10)",   border: "rgba(239,68,68,0.20)",   text: "#ef4444" },
              { label: "Caution",    bg: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.20)",  text: "#f59e0b" },
            ].map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium border"
                style={{ background: chip.bg, borderColor: chip.border, color: chip.text }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: chip.text }} />
                {chip.label}
              </span>
            ))}
          </div>
        </section>

        {/* ── AI STATES ── */}
        <section className="mb-16">
          <SectionHeader
            id="states"
            title="AI States"
            desc="Each AI state has distinct visual language. The user always knows what the AI is doing."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Thinking */}
            <div className="relative overflow-hidden rounded-[18px] border border-[rgba(34,211,238,0.15)] bg-[#0A0E17] p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.04),transparent_50%)]" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
                  <span className="rounded-full border border-[rgba(34,211,238,0.15)] bg-[rgba(34,211,238,0.06)] px-2.5 py-0.5 text-[11px] font-medium text-[#22D3EE]">
                    Thinking
                  </span>
                </div>
                <p className="text-[14px] text-[#C8CDD8]">Analyzing workspace data…</p>
                <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#6D5BFF] to-[#22D3EE] animate-pulse" />
                </div>
              </div>
            </div>

            {/* Success */}
            <div className="relative overflow-hidden rounded-[18px] border border-[rgba(34,197,94,0.20)] bg-[#0A0E17] p-5">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={14} className="text-[#22c55e]" />
                  <span className="rounded-full border border-[rgba(34,197,94,0.20)] bg-[rgba(34,197,94,0.10)] px-2.5 py-0.5 text-[11px] font-medium text-[#22c55e]">
                    Analysis complete
                  </span>
                </div>
                <p className="text-[14px] text-[#C8CDD8]">3 insights generated for this pipeline stage.</p>
              </div>
            </div>

            {/* Streaming */}
            <div className="relative overflow-hidden rounded-[18px] border border-white/[0.06] bg-[#0A0E17] p-5">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-[#A998FF]" />
                  <span className="rounded-full border border-[rgba(109,91,255,0.20)] bg-[rgba(109,91,255,0.08)] px-2.5 py-0.5 text-[11px] font-medium text-[#A998FF]">
                    Streaming
                  </span>
                </div>
                <p className="text-[14px] text-[#C8CDD8]">
                  Acme Corp shows a 23% increase in engagement over Q3, driven by two key
                  <span className="inline-block h-3.5 w-0.5 bg-[#22D3EE] ml-0.5 align-middle animate-pulse" />
                </p>
              </div>
            </div>

            {/* Memory Access */}
            <div className="relative overflow-hidden rounded-[18px] border border-white/[0.06] bg-[#0A0E17] p-5">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <AiCore size={20} showRings={false} showParticles={false} intensity="strong" />
                  <span className="rounded-full border border-[rgba(34,211,238,0.15)] bg-[rgba(34,211,238,0.06)] px-2.5 py-0.5 text-[11px] font-medium text-[#22D3EE]">
                    Memory accessed
                  </span>
                </div>
                <p className="text-[14px] text-[#C8CDD8]">Recalling context from 3 previous interactions…</p>
              </div>
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/[0.04] pt-8 pb-16 text-center">
          <AiCore size={40} showRings={false} showParticles={false} intensity="subtle" className="mx-auto mb-4" />
          <p className="text-[12px] text-[#9AA3B2]/50">
            Gunimi Design Language v1.0 · Internal Reference · Not for production display
          </p>
          <p className="mt-1 text-[11px] text-[#9AA3B2]/30">
            Token source:{" "}
            <code className="text-[#9AA3B2]/50">styles/orbit-theme.css</code> ·
            Documentation:{" "}
            <code className="text-[#9AA3B2]/50">docs/design-language/</code>
          </p>
        </footer>

      </main>
    </div>
  );
}
