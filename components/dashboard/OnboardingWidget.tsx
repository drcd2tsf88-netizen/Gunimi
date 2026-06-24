"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Mail,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import OrbitCard from "@/components/ui/OrbitCard";
import type { OnboardingStatus } from "@/server/actions/onboarding/getOnboardingStatus";

type Props = {
  status: OnboardingStatus;
  onOpenAI: () => void;
};

type StepDef =
  | { key: string; icon: React.ElementType; label: string; done: boolean; href: string }
  | { key: string; icon: React.ElementType; label: string; done: boolean; action: () => void };

function StepRow({ step }: { step: StepDef }) {
  const inner = (
    <div
      className={[
        "flex items-center gap-3 px-5 py-3.5 transition-colors",
        step.done ? "opacity-50" : "hover:bg-white/[0.02]",
      ].join(" ")}
    >
      {step.done ? (
        <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
      ) : (
        <Circle size={14} className="shrink-0 text-white/20" />
      )}
      <step.icon
        size={13}
        className={step.done ? "shrink-0 text-white/25" : "shrink-0 text-violet-300/80"}
      />
      <p
        className={[
          "flex-1 text-sm",
          step.done ? "text-white/35 line-through decoration-white/15" : "text-white/80",
        ].join(" ")}
      >
        {step.label}
      </p>
      {!step.done && <ArrowRight size={11} className="shrink-0 text-white/20" />}
    </div>
  );

  if (step.done) return <div>{inner}</div>;
  if ("href" in step) return <Link href={step.href}>{inner}</Link>;
  return (
    <button type="button" className="w-full text-left" onClick={step.action}>
      {inner}
    </button>
  );
}

export default function OnboardingWidget({ status, onOpenAI }: Props) {
  const t = useTranslations("onboarding");
  const [aiDone, setAiDone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("orbit_onboarding_ai_done") === "true";
  });
  const [collapsed, setCollapsed] = useState(false);

  function handleAIClick() {
    localStorage.setItem("orbit_onboarding_ai_done", "true");
    setAiDone(true);
    onOpenAI();
  }

  const steps: StepDef[] = [
    {
      key: "email",
      icon: Mail,
      label: t("stepEmail"),
      done: status.emailConnected,
      href: "/dashboard/email",
    },
    {
      key: "calendar",
      icon: CalendarDays,
      label: t("stepCalendar"),
      done: status.calendarConnected,
      href: "/dashboard/calendar",
    },
    {
      key: "contact",
      icon: Users,
      label: t("stepContact"),
      done: status.contactsCount > 0,
      href: "/dashboard/crm",
    },
    {
      key: "company",
      icon: Building2,
      label: t("stepCompany"),
      done: status.companiesCount > 0,
      href: "/dashboard/companies",
    },
    {
      key: "deal",
      icon: TrendingUp,
      label: t("stepDeal"),
      done: status.dealsCount > 0,
      href: "/dashboard/deals",
    },
    {
      key: "ai",
      icon: Sparkles,
      label: t("stepAI"),
      done: aiDone,
      action: handleAIClick,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const totalCount = steps.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  // Phase 7: all done — show completion state (widget removes itself on next render cycle)
  if (completedCount === totalCount) {
    return (
      <OrbitCard className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90">{t("completionTitle")}</p>
            <p className="text-xs text-white/35">{t("completionSubtitle")}</p>
          </div>
        </div>
      </OrbitCard>
    );
  }

  return (
    <OrbitCard className="overflow-visible">
      {/* HEADER + TOGGLE */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10">
            <Sparkles size={14} className="text-violet-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90">{t("welcomeTitle")}</p>
            <p className="text-xs text-white/40">{t("welcomeSubtitle")}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs text-white/35">
            {t("completed", { count: completedCount, total: totalCount })}
          </span>
          {collapsed ? (
            <ChevronDown size={14} className="text-white/30" />
          ) : (
            <ChevronUp size={14} className="text-white/30" />
          )}
        </div>
      </button>

      {/* PROGRESS BAR */}
      <div className="border-t border-white/[0.05] px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-white/30">{progressPct}%</span>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* CHECKLIST */}
          <div className="divide-y divide-white/[0.04] border-t border-white/[0.05]">
            {steps.map((step) => (
              <StepRow key={step.key} step={step} />
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="border-t border-white/[0.05] px-5 py-4">
            <p className="mb-3 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              {t("quickActionsTitle")}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: t("actionConnectEmail"), href: "/dashboard/email" },
                { label: t("actionConnectCalendar"), href: "/dashboard/calendar" },
                { label: t("actionCreateContact"), href: "/dashboard/crm" },
                { label: t("actionCreateCompany"), href: "/dashboard/companies" },
                { label: t("actionCreateDeal"), href: "/dashboard/deals" },
                { label: t("actionImportCSV"), href: "/dashboard/import" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/55 transition-all hover:border-white/[0.14] hover:text-white/85"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </OrbitCard>
  );
}
