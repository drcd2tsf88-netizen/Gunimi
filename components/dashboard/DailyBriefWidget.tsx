"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";

type DailyBriefItem = {
  text: string;
  entityType?: "deal" | "contact" | "company" | "task";
  entityId?: string;
  entityHref?: string;
};

type DailyBrief = {
  summary: string;
  priorities: DailyBriefItem[];
  risks: DailyBriefItem[];
  opportunities: DailyBriefItem[];
};

type Props = {
  displayName: string;
  isNewWorkspace?: boolean;
};

type SectionProps = {
  label: string;
  items: DailyBriefItem[];
  color: "violet" | "red" | "emerald";
  icon: React.ElementType;
};

const COLOR_MAP = {
  violet: {
    label: "text-violet-300",
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
    icon: "text-violet-300",
    dot: "bg-violet-400",
    itemBorder: "border-violet-500/15 hover:border-violet-500/30",
    itemBg: "hover:bg-violet-500/5",
  },
  red: {
    label: "text-red-300",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    icon: "text-red-300",
    dot: "bg-red-400",
    itemBorder: "border-red-500/15 hover:border-red-500/30",
    itemBg: "hover:bg-red-500/5",
  },
  emerald: {
    label: "text-emerald-300",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    icon: "text-emerald-300",
    dot: "bg-emerald-400",
    itemBorder: "border-emerald-500/15 hover:border-emerald-500/30",
    itemBg: "hover:bg-emerald-500/5",
  },
};

function BriefSection({ label, items, color, icon: Icon }: SectionProps) {
  const c = COLOR_MAP[color];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={11} className={c.icon} />
        <span
          className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${c.label}`}
        >
          {label}
        </span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => {
          const content = (
            <div
              className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors ${c.itemBorder} ${item.entityHref ? c.itemBg : ""}`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`}
                />
                <p className="text-xs leading-relaxed text-white/70">
                  {item.text}
                </p>
              </div>
              {item.entityHref && (
                <ArrowRight size={11} className="mt-1 shrink-0 text-white/25" />
              )}
            </div>
          );

          return item.entityHref ? (
            <Link key={i} href={item.entityHref} className="block">
              {content}
            </Link>
          ) : (
            <div key={i}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}

export default function DailyBriefWidget({ displayName, isNewWorkspace = false }: Props) {
  const t = useTranslations("dashboard");
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t("goodMorning")
      : hour < 18
        ? t("goodAfternoon")
        : t("goodEvening");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/ai/brief");
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = (await res.json()) as DailyBrief;
        setBrief(json);
      } catch {
        setBrief(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const hasContent =
    brief &&
    (brief.summary ||
      brief.priorities.length > 0 ||
      brief.risks.length > 0 ||
      brief.opportunities.length > 0);

  return (
    <OrbitCard className="p-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
          <Sparkles className="h-4 w-4 text-violet-300" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t("orbitIntelligence")}
            </p>
            <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] uppercase tracking-wide text-violet-300">
              Live
            </span>
          </div>
          <h2 className="mt-1 text-base font-semibold">
            {greeting}, {displayName}
          </h2>
          <p className="mt-0.5 text-[11px] text-white/30">{today}</p>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-5 space-y-3 animate-pulse">
          <div className="h-3.5 w-4/5 rounded-lg bg-white/[0.04]" />
          <div className="h-3 w-2/3 rounded-lg bg-white/[0.04]" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded-lg bg-white/[0.04]" />
            <div className="h-10 w-full rounded-xl bg-white/[0.03]" />
            <div className="h-10 w-full rounded-xl bg-white/[0.03]" />
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && hasContent && (
        <div className="mt-5 space-y-5">
          {/* Summary */}
          {brief!.summary && (
            <p className="border-l-2 border-violet-500/30 pl-3.5 text-sm leading-relaxed text-white/55">
              {brief!.summary}
            </p>
          )}

          {/* Priorities + Risks side by side when both exist */}
          {brief!.priorities.length > 0 || brief!.risks.length > 0 ? (
            <div
              className={
                brief!.priorities.length > 0 && brief!.risks.length > 0
                  ? "grid gap-5 sm:grid-cols-2"
                  : ""
              }
            >
              {brief!.priorities.length > 0 && (
                <BriefSection
                  label={t("briefPriorities")}
                  items={brief!.priorities}
                  color="violet"
                  icon={CheckCircle2}
                />
              )}
              {brief!.risks.length > 0 && (
                <BriefSection
                  label={t("briefRisks")}
                  items={brief!.risks}
                  color="red"
                  icon={AlertTriangle}
                />
              )}
            </div>
          ) : null}

          {/* Opportunities — full width */}
          {brief!.opportunities.length > 0 && (
            <BriefSection
              label={t("briefOpportunities")}
              items={brief!.opportunities}
              color="emerald"
              icon={TrendingUp}
            />
          )}
        </div>
      )}

      {/* All clear */}
      {!loading && brief && !hasContent && (
        <p className="mt-5 text-sm text-white/30">{t("briefAllClear")}</p>
      )}

      {/* Unavailable — show onboarding guidance for empty workspaces */}
      {!loading && !brief && isNewWorkspace && (
        <div className="mt-5 space-y-3">
          <p className="border-l-2 border-violet-500/30 pl-3.5 text-sm leading-relaxed text-white/55">
            {t("briefOnboardingIntro")}
          </p>
          <p className="text-sm leading-relaxed text-white/35">{t("briefOnboardingHint")}</p>
        </div>
      )}
      {!loading && !brief && !isNewWorkspace && (
        <p className="mt-5 text-sm text-white/30">{t("briefUnavailable")}</p>
      )}
    </OrbitCard>
  );
}
