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
        <Circle size={14} className="shrink-0 text-[#9AA3B2]/20" />
      )}
      <step.icon
        size={13}
        className={step.done ? "shrink-0 text-[#9AA3B2]/25" : "shrink-0 text-[#8B7DFF]/80"}
      />
      <p
        className={[
          "flex-1 text-[13px]",
          step.done ? "text-[#9AA3B2]/35 line-through decoration-[#9AA3B2]/15" : "text-[#C8CDD8]",
        ].join(" ")}
      >
        {step.label}
      </p>
      {!step.done && <ArrowRight size={11} className="shrink-0 text-[#9AA3B2]/20" />}
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

  const coreSteps: StepDef[] = [
    { key: "contact", icon: Users,      label: t("stepContact"), done: status.contactsCount > 0,  href: "/dashboard/contacts" },
    { key: "company", icon: Building2,  label: t("stepCompany"), done: status.companiesCount > 0, href: "/dashboard/companies" },
    { key: "deal",    icon: TrendingUp, label: t("stepDeal"),    done: status.dealsCount > 0,     href: "/dashboard/deals" },
  ];

  const optionalSteps: StepDef[] = [
    { key: "email",    icon: Mail,        label: t("stepEmail"),    done: status.emailConnected,    href: "/dashboard/email" },
    { key: "calendar", icon: CalendarDays,label: t("stepCalendar"), done: status.calendarConnected, href: "/dashboard/calendar" },
    { key: "ai",       icon: Sparkles,    label: t("stepAI"),       done: aiDone,                  action: handleAIClick },
  ];

  const completedCore = coreSteps.filter((s) => s.done).length;
  const totalCore     = coreSteps.length;
  const progressPct   = Math.round((completedCore / totalCore) * 100);

  if (completedCore === totalCore) {
    return (
      <OrbitCard className="p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-500/[0.18] bg-emerald-500/[0.08]">
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-[#F7F8FC]/90">{t("completionTitle")}</p>
            <p className="text-[11.5px] text-[#9AA3B2]/50">{t("completionSubtitle")}</p>
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#6D5BFF]/[0.16] bg-[#6D5BFF]/[0.08]">
            <Sparkles size={14} className="text-[#8B7DFF]" />
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-[#F7F8FC]/90">{t("welcomeTitle")}</p>
            <p className="text-[11.5px] text-[#9AA3B2]/50">{t("welcomeSubtitle")}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[11.5px] text-[#9AA3B2]/40">
            {t("completed", { count: completedCore, total: totalCore })}
          </span>
          {collapsed ? (
            <ChevronDown size={14} className="text-[#9AA3B2]/30" />
          ) : (
            <ChevronUp size={14} className="text-[#9AA3B2]/30" />
          )}
        </div>
      </button>

      {/* PROGRESS BAR */}
      <div className="border-t border-white/[0.05] px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6D5BFF] to-[#8B7DFF] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-[#9AA3B2]/35">{progressPct}%</span>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* CORE CHECKLIST */}
          <div className="divide-y divide-white/[0.04] border-t border-white/[0.05]">
            {coreSteps.map((step) => (
              <StepRow key={step.key} step={step} />
            ))}
          </div>

          {/* OPTIONAL ENHANCEMENTS */}
          <div className="border-t border-white/[0.05]">
            <p className="px-5 pb-1 pt-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#9AA3B2]/40">
              {t("stepOptionalLabel")}
            </p>
            <div className="divide-y divide-white/[0.04]">
              {optionalSteps.map((step) => (
                <StepRow key={step.key} step={step} />
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="border-t border-white/[0.05] px-5 py-4">
            <p className="mb-3 text-[9.5px] uppercase tracking-[0.14em] text-[#9AA3B2]/40">
              {t("quickActionsTitle")}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: t("actionCreateContact"),  href: "/dashboard/contacts" },
                { label: t("actionCreateCompany"),  href: "/dashboard/companies" },
                { label: t("actionCreateDeal"),     href: "/dashboard/deals" },
                { label: t("actionConnectEmail"),   href: "/dashboard/email" },
                { label: t("actionConnectCalendar"),href: "/dashboard/calendar" },
                { label: t("actionImportCSV"),      href: "/dashboard/import" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[12px] text-[#9AA3B2]/60 transition-all duration-200 hover:border-[#6D5BFF]/[0.18] hover:bg-[#6D5BFF]/[0.06] hover:text-[#C8CDD8]"
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
