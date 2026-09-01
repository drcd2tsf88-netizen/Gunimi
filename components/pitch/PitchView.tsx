"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Zap,
  Mail,
  CalendarDays,
  Shield,
  Tag,
  TrendingUp,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tier = { label: string; desc: string };
type PricingTier = { name: string; price: string; desc: string };
type StackRow = { layer: string; tech: string };
type Section = { title: string; points: string[] };

type PitchTranslations = {
  badge: string;
  nav: { prev: string; next: string; slideOf: string };
  cta: { startFree: string; requestDemo: string; openWorkspace: string };
  slides: {
    hero: { label: string; title: string; subtitle: string; hint: string };
    problem: { label: string; title: string; body: string; tools: string[]; footer: string };
    solution: { label: string; title: string; body: string; chain: string[] };
    relationships: { label: string; title: string; body: string; tiers: Tier[]; extras: string[] };
    signals: { label: string; title: string; body: string; examples: string[]; footer: string };
    email: { label: string; title: string; body: string; features: string[]; quote: string };
    calendar: { label: string; title: string; body: string; features: string[]; quote: string };
    execution: { label: string; title: string; sections: Section[] };
    architecture: { label: string; title: string; stack: StackRow[]; security: string[] };
    pricing: { label: string; title: string; subtitle: string; tiers: PricingTier[]; currentOffer: string; ctaLabel: string };
  };
};

// ─── Slide variants ──────────────────────────────────────────────────────────

const VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

const TIER_COLORS = [
  "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300",
  "border-amber-500/30 bg-amber-500/[0.06] text-amber-300",
  "border-red-500/30 bg-red-500/[0.06] text-red-300",
  "border-zinc-500/30 bg-zinc-500/[0.06] text-zinc-400",
];

const SLIDE_ICONS = [Sparkles, AlertTriangle, TrendingUp, CheckCircle2, Zap, Mail, CalendarDays, Tag, Shield, ArrowRight];

// ─── Individual slide renderers ───────────────────────────────────────────────

function HeroSlide({ s, cta }: { s: PitchTranslations["slides"]["hero"]; cta: PitchTranslations["cta"] }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10">
        <Sparkles size={24} className="text-violet-300" />
      </div>
      <div className="space-y-4 max-w-3xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-violet-400/70">{s.label}</p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          {s.title}
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-white/50 md:text-lg">
          {s.subtitle}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          {cta.startFree}
          <ArrowRight size={15} />
        </Link>
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] px-6 py-3 text-sm font-medium text-white/60 transition-colors hover:border-white/20 hover:text-white/90"
        >
          {cta.requestDemo}
        </Link>
      </div>
      <p className="text-[11px] text-white/20">{s.hint}</p>
    </div>
  );
}

function ProblemSlide({ s }: { s: PitchTranslations["slides"]["problem"] }) {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeader label={s.label} title={s.title} body={s.body} icon={AlertTriangle} iconColor="text-amber-300" iconBg="border-amber-500/20 bg-amber-500/10" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {s.tools.map((tool, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/60" />
            <p className="text-sm text-white/55">{tool}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-medium text-amber-300/70">{s.footer}</p>
    </div>
  );
}

function SolutionSlide({ s }: { s: PitchTranslations["slides"]["solution"] }) {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeader label={s.label} title={s.title} body={s.body} icon={TrendingUp} iconColor="text-violet-300" iconBg="border-violet-500/20 bg-violet-500/10" />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {s.chain.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.06] px-4 py-2">
              <p className="text-sm font-medium text-violet-200">{item}</p>
            </div>
            {i < s.chain.length - 1 && (
              <ArrowRight size={13} className="shrink-0 text-white/20" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RelationshipsSlide({ s }: { s: PitchTranslations["slides"]["relationships"] }) {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeader label={s.label} title={s.title} body={s.body} icon={CheckCircle2} iconColor="text-emerald-300" iconBg="border-emerald-500/20 bg-emerald-500/10" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {s.tiers.map((tier, i) => (
          <div key={i} className={`flex flex-col gap-1 rounded-xl border px-4 py-3 ${TIER_COLORS[i]}`}>
            <p className="text-sm font-semibold">{tier.label}</p>
            <p className="text-[11px] opacity-70">{tier.desc}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {s.extras.map((e, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-violet-400" />
            <p className="text-sm text-white/55">{e}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalsSlide({ s }: { s: PitchTranslations["slides"]["signals"] }) {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeader label={s.label} title={s.title} body={s.body} icon={Zap} iconColor="text-amber-300" iconBg="border-amber-500/20 bg-amber-500/10" />
      <div className="space-y-2">
        {s.examples.map((ex, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-2.5">
            <Zap size={12} className="mt-0.5 shrink-0 text-amber-400/60" />
            <p className="text-sm text-white/60">{ex}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-medium text-white/35">{s.footer}</p>
    </div>
  );
}

function EmailSlide({ s }: { s: PitchTranslations["slides"]["email"] }) {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeader label={s.label} title={s.title} body={s.body} icon={Mail} iconColor="text-cyan-300" iconBg="border-cyan-500/20 bg-cyan-500/10" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {s.features.map((f, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
            <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-cyan-400" />
            <p className="text-sm text-white/60">{f}</p>
          </div>
        ))}
      </div>
      <blockquote className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] px-5 py-4 text-center">
        <p className="text-sm font-medium italic text-violet-300/80">&ldquo;{s.quote}&rdquo;</p>
      </blockquote>
    </div>
  );
}

function CalendarSlide({ s }: { s: PitchTranslations["slides"]["calendar"] }) {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeader label={s.label} title={s.title} body={s.body} icon={CalendarDays} iconColor="text-blue-300" iconBg="border-blue-500/20 bg-blue-500/10" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {s.features.map((f, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
            <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-blue-400" />
            <p className="text-sm text-white/60">{f}</p>
          </div>
        ))}
      </div>
      <blockquote className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] px-5 py-4 text-center">
        <p className="text-sm font-medium italic text-blue-300/80">&ldquo;{s.quote}&rdquo;</p>
      </blockquote>
    </div>
  );
}

function ExecutionSlide({ s }: { s: PitchTranslations["slides"]["execution"] }) {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeader label={s.label} title={s.title} icon={Tag} iconColor="text-violet-300" iconBg="border-violet-500/20 bg-violet-500/10" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {s.sections.map((section, i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="mb-3 text-sm font-semibold text-white/80">{section.title}</p>
            <ul className="space-y-2">
              {section.points.map((p, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-white/50">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400/50" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureSlide({ s }: { s: PitchTranslations["slides"]["architecture"] }) {
  return (
    <div className="flex flex-col gap-8">
      <SlideHeader label={s.label} title={s.title} icon={Shield} iconColor="text-emerald-300" iconBg="border-emerald-500/20 bg-emerald-500/10" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          {s.stack.map((row, i) => (
            <div key={i} className={`flex items-start gap-4 px-4 py-2.5 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
              <p className="w-28 shrink-0 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">{row.layer}</p>
              <p className="text-xs text-white/60">{row.tech}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {s.security.map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] px-4 py-2.5">
              <Shield size={12} className="mt-0.5 shrink-0 text-emerald-400/60" />
              <p className="text-sm text-white/55">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingSlide({ s, cta }: { s: PitchTranslations["slides"]["pricing"]; cta: PitchTranslations["cta"] }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-violet-400/70">{s.label}</p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">{s.title}</h2>
        <p className="text-white/40">{s.subtitle}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {s.tiers.map((tier, i) => (
          <div
            key={i}
            className={`flex flex-col gap-2 rounded-xl border p-4 ${i === 0 ? "border-violet-500/25 bg-violet-500/[0.06]" : "border-white/[0.06] bg-white/[0.02]"}`}
          >
            <p className={`text-sm font-semibold ${i === 0 ? "text-violet-300" : "text-white/80"}`}>{tier.name}</p>
            <p className={`text-xl font-bold tabular-nums ${i === 0 ? "text-violet-200" : "text-white/90"}`}>{tier.price}</p>
            <p className="text-[11px] leading-relaxed text-white/40">{tier.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] px-5 py-3 text-center">
          <p className="text-sm font-medium text-violet-300/80">{s.currentOffer}</p>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          {s.ctaLabel}
          <ArrowRight size={15} />
        </Link>
        <Link href="/demo" className="text-xs text-white/30 hover:text-white/60 transition-colors">
          {cta.requestDemo}
        </Link>
      </div>
    </div>
  );
}

// ─── Shared SlideHeader ───────────────────────────────────────────────────────

function SlideHeader({
  label,
  title,
  body,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  label: string;
  title: string;
  body?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="flex items-start gap-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">{label}</p>
        <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl">{title}</h2>
        {body && <p className="mt-2 text-sm leading-relaxed text-white/45">{body}</p>}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PitchView({ t }: { t: PitchTranslations }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const TOTAL = 10;

  const go = useCallback((dir: number) => {
    const next = current + dir;
    if (next < 0 || next >= TOTAL) return;
    setDirection(dir);
    setCurrent(next);
  }, [current]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const slides = [
    <HeroSlide key="hero" s={t.slides.hero} cta={t.cta} />,
    <ProblemSlide key="problem" s={t.slides.problem} />,
    <SolutionSlide key="solution" s={t.slides.solution} />,
    <RelationshipsSlide key="relationships" s={t.slides.relationships} />,
    <SignalsSlide key="signals" s={t.slides.signals} />,
    <EmailSlide key="email" s={t.slides.email} />,
    <CalendarSlide key="calendar" s={t.slides.calendar} />,
    <ExecutionSlide key="execution" s={t.slides.execution} />,
    <ArchitectureSlide key="architecture" s={t.slides.architecture} />,
    <PricingSlide key="pricing" s={t.slides.pricing} cta={t.cta} />,
  ];

  const SlideIcon = SLIDE_ICONS[current] ?? Sparkles;

  return (
    <div className="relative flex min-h-screen flex-col bg-[#05060A]">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/4 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: "radial-gradient(ellipse, rgba(109,91,255,0.06), transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white/80">Gunimi</span>
          <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300/70">
            {t.badge}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-white/30">
          <SlideIcon size={12} className="text-white/20" />
          <span className="tabular-nums">
            {t.nav.slideOf.replace("{current}", String(current + 1)).replace("{total}", String(TOTAL))}
          </span>
        </div>
      </div>

      {/* Slide content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 md:px-12 lg:px-20">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {slides[current]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/[0.05] px-6 py-4">
        {/* Prev */}
        <button
          onClick={() => go(-1)}
          disabled={current === 0}
          className="flex items-center gap-2 rounded-xl border border-white/[0.07] px-4 py-2 text-xs text-white/40 transition-all hover:border-white/15 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-20"
        >
          <ChevronLeft size={14} />
          {t.nav.prev}
        </button>

        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`h-1.5 rounded-full transition-all ${
                i === current
                  ? "w-5 bg-violet-500"
                  : i < current
                  ? "w-1.5 bg-white/30"
                  : "w-1.5 bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => go(1)}
          disabled={current === TOTAL - 1}
          className="flex items-center gap-2 rounded-xl border border-white/[0.07] px-4 py-2 text-xs text-white/40 transition-all hover:border-white/15 hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-20"
        >
          {t.nav.next}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
