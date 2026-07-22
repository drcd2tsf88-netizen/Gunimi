"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Users, Building2, TrendingUp, CheckSquare,
  Mail, CalendarDays, BarChart3, Settings, ArrowLeft, ChevronRight,
  Circle, Zap, Brain, Search, X, Send, Phone, FileText, Calendar,
  AlertTriangle, CheckCircle2, Info, Sparkles,
} from "lucide-react";

import AiCore from "@/components/ui/AiCore";
import TodayView from "@/components/today/TodayView";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import {
  DEMO_DISPLAY_NAME, DEMO_WORKSPACE_NAME,
  DEMO_TODAY_DATA, DEMO_CONTACTS, DEMO_COMPANIES, DEMO_DEALS,
  DEMO_TASKS, DEMO_SIGNALS, DEMO_MEMORIES, DEMO_ACTIVITIES,
} from "@/lib/demo/demoWorkspaceData";
import type {
  DemoContact, DemoCompany, DemoDeal, DemoTask, DemoSignal, DemoMemory,
} from "@/lib/demo/demoWorkspaceData";

// ─── Types ───────────────────────────────────────────────────

type DemoSection =
  | "today" | "contacts" | "companies" | "deals" | "tasks"
  | "signals" | "memory" | "email" | "calendar" | "analytics" | "settings";

type NavEntry =
  | { type: "section"; section: DemoSection }
  | { type: "contact-detail"; id: string }
  | { type: "company-detail"; id: string }
  | { type: "deal-detail"; id: string }
  | { type: "task-detail"; id: string }
  | { type: "signal-detail"; id: string };

type DemoNav = {
  navigate: (entry: NavEntry) => void;
  goBack: () => void;
  openActionCTA: () => void;
};

// ─── Nav items ───────────────────────────────────────────────

type NavItem = { id: DemoSection; icon: LucideIcon; labelKey: string; useNavNs: boolean };

const NAV_ITEMS: NavItem[] = [
  { id: "today",     icon: LayoutDashboard, labelKey: "dashboard",    useNavNs: true  },
  { id: "contacts",  icon: Users,           labelKey: "contacts",     useNavNs: true  },
  { id: "companies", icon: Building2,       labelKey: "companies",    useNavNs: true  },
  { id: "deals",     icon: TrendingUp,      labelKey: "deals",        useNavNs: true  },
  { id: "tasks",     icon: CheckSquare,     labelKey: "tasks",        useNavNs: true  },
  { id: "signals",   icon: Zap,             labelKey: "signalsTitle", useNavNs: false },
  { id: "memory",    icon: Brain,           labelKey: "memory",       useNavNs: true  },
  { id: "email",     icon: Mail,            labelKey: "email",        useNavNs: true  },
  { id: "calendar",  icon: CalendarDays,    labelKey: "calendar",     useNavNs: true  },
  { id: "analytics", icon: BarChart3,       labelKey: "analytics",    useNavNs: true  },
  { id: "settings",  icon: Settings,        labelKey: "settings",     useNavNs: true  },
];

const VALID_SECTIONS: DemoSection[] = [
  "today", "contacts", "companies", "deals", "tasks",
  "signals", "memory", "email", "calendar", "analytics", "settings",
];

function toSection(s?: string): DemoSection {
  return VALID_SECTIONS.includes(s as DemoSection) ? (s as DemoSection) : "today";
}

// ─── Helpers ─────────────────────────────────────────────────

function statusPill(status: DemoContact["status"]) {
  if (status === "active") return { bg: "bg-[#22c55e]/10", text: "text-[#22c55e]"  };
  if (status === "stale")  return { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]"  };
  return                          { bg: "bg-[#9AA3B2]/10", text: "text-[#9AA3B2]"  };
}

function healthColor(h: DemoCompany["health"]) {
  if (h === "healthy")   return "#22c55e";
  if (h === "attention") return "#F59E0B";
  return                        "#9AA3B2";
}

function urgencyColor(u: DemoSignal["urgency"]) {
  if (u === "critical") return { dot: "#EF4444", bg: "bg-[#EF4444]/10", text: "text-[#EF4444]", border: "border-[#EF4444]/20" };
  if (u === "warning")  return { dot: "#F59E0B", bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", border: "border-[#F59E0B]/20" };
  return                       { dot: "#22D3EE", bg: "bg-[#22D3EE]/10", text: "text-[#22D3EE]", border: "border-[#22D3EE]/20" };
}

function priorityDot(p: DemoTask["priority"]) {
  if (p === "high")   return "bg-[#EF4444]";
  if (p === "medium") return "bg-[#F59E0B]";
  return                     "bg-[#9AA3B2]";
}

function memoryTypeKey(type: DemoMemory["type"]): string {
  if (type === "fact")         return "memoryTypeFact";
  if (type === "pattern")      return "memoryTypePattern";
  if (type === "relationship") return "memoryTypeRelationship";
  return                              "memoryTypeDecision";
}

function memoryTypeBadge(type: DemoMemory["type"]) {
  if (type === "fact")         return "bg-[#22D3EE]/10 text-[#22D3EE]";
  if (type === "pattern")      return "bg-[#6D5BFF]/10 text-[#8B7DFF]";
  if (type === "relationship") return "bg-[#22c55e]/10 text-[#22c55e]";
  return                              "bg-[#F59E0B]/10 text-[#F59E0B]";
}

function signalTypeKey(type: DemoSignal["type"]): string {
  if (type === "stale_contact") return "signalTypeStaleContact";
  if (type === "deal_risk")     return "signalTypeDealRisk";
  if (type === "opportunity")   return "signalTypeOpportunity";
  return                               "signalTypeTaskOverdue";
}

// ─── Shimmer ─────────────────────────────────────────────────

function DemoShimmer() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded-lg bg-white/[0.04]" />
      <div className="h-4 w-72 rounded bg-white/[0.03]" />
      <div className="mt-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-[14px] bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}

// ─── Breadcrumb ──────────────────────────────────────────────

type BreadcrumbItem = { label: string; onClick?: () => void };

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-5 flex items-center gap-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={11} className="text-[#9AA3B2]/30" />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-[12px] text-[#9AA3B2]/60 transition-colors hover:text-[#9AA3B2]"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[12px] text-[#F7F8FC]/70">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

// ─── Action Bar ──────────────────────────────────────────────

function ActionBar({ openActionCTA, tDemo }: { openActionCTA: () => void; tDemo: (k: string) => string }) {
  const actions = [
    { key: "actionSendEmail", icon: Send  },
    { key: "actionLogCall",   icon: Phone },
    { key: "actionAddNote",   icon: FileText },
    { key: "actionSchedule",  icon: Calendar },
  ] as const;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {actions.map(({ key, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={openActionCTA}
          className="flex items-center gap-2 rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-3.5 py-2 text-[12px] font-medium text-[#9AA3B2]/70 transition-all hover:border-white/[0.12] hover:text-[#F7F8FC]/80"
        >
          <Icon size={12} strokeWidth={1.75} />
          {tDemo(key)}
        </button>
      ))}
    </div>
  );
}

// ─── AI Observation Card ─────────────────────────────────────

function AICard({ observation, tDemo }: { observation: string; tDemo: (k: string) => string }) {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-[#6D5BFF]/15 bg-[#6D5BFF]/[0.04] p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6D5BFF]/20 to-transparent" />
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <AiCore size={28} showRings={false} showParticles={false} intensity="strong" />
        </div>
        <div className="min-w-0">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8B7DFF]">
            {tDemo("aiPoweredBy")}
          </p>
          <p className="text-[13px] leading-relaxed text-[#F7F8FC]/80">{observation}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Feed ───────────────────────────────────────────

function ActivityFeed({ entityId, tDemo }: { entityId: string; tDemo: (k: string) => string }) {
  const activities = DEMO_ACTIVITIES[entityId] ?? [];
  if (activities.length === 0) return null;

  const icons: Record<string, LucideIcon> = {
    activityEmail: Send, activityCall: Phone, activityNote: FileText,
    activityDealUpdate: TrendingUp, activityCreated: Users,
  };

  return (
    <div className="space-y-2">
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9AA3B2]/50">
        {tDemo("activitySection")}
      </h3>
      <div className="space-y-1.5">
        {activities.map((a) => {
          const Icon = icons[a.typeKey] ?? FileText;
          return (
            <div key={a.id} className="flex items-center gap-3 rounded-[10px] border border-white/[0.03] bg-[#0A0E17] px-4 py-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
                <Icon size={12} className="text-[#9AA3B2]/50" strokeWidth={1.75} />
              </div>
              <p className="flex-1 text-[12px] text-[#F7F8FC]/60">{tDemo(a.typeKey)}</p>
              <span className="text-[11px] text-[#9AA3B2]/30">{a.timeAgo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Entity chips (clickable related items) ──────────────────

function EntityChip({ label, subtitle, color, onClick }: { label: string; subtitle?: string; color?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between rounded-[12px] border border-white/[0.05] bg-[#0A0E17] px-4 py-3 transition-all hover:border-white/[0.1] hover:bg-white/[0.025]"
    >
      <div className="flex items-center gap-3">
        {color && <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
        <div className="text-left">
          <p className="text-[13px] font-medium text-[#F7F8FC]">{label}</p>
          {subtitle && <p className="mt-0.5 text-[11px] text-[#9AA3B2]/50">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={13} className="text-[#9AA3B2]/30 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

// ─── CONTACT DETAIL ──────────────────────────────────────────

function ContactDetail({ contact, nav }: { contact: DemoContact; nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  const relatedCompany = DEMO_COMPANIES.find((c) => c.name === contact.company);
  const relatedDeals   = DEMO_DEALS.filter((d) => d.company === contact.company);
  const pill           = statusPill(contact.status);

  return (
    <motion.div
      key={contact.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <Breadcrumb items={[
        { label: tDemo("commandContacts"), onClick: () => nav.navigate({ type: "section", section: "contacts" }) },
        { label: contact.name },
      ]} />

      {/* Header */}
      <div className="relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#6D5BFF]/20 bg-[#6D5BFF]/[0.08] text-xl font-semibold text-[#8B7DFF]">
              {contact.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{contact.name}</h1>
              <p className="mt-0.5 text-[13px] text-[#9AA3B2]/70">{contact.role}</p>
              {relatedCompany && (
                <button
                  onClick={() => nav.navigate({ type: "company-detail", id: relatedCompany.id })}
                  className="mt-1 flex items-center gap-1 text-[12px] text-[#8B7DFF]/70 transition-colors hover:text-[#8B7DFF]"
                >
                  <Building2 size={10} strokeWidth={1.75} />
                  {contact.company}
                </button>
              )}
            </div>
          </div>
          <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[11px] font-semibold ${pill.bg} ${pill.text}`}>
            {tDemo(`status${contact.status.charAt(0).toUpperCase()}${contact.status.slice(1)}`)}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.04] pt-4 sm:grid-cols-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9AA3B2]/40">{tDemo("detailLastContact")}</p>
            <p className="mt-0.5 text-[13px] font-medium text-[#F7F8FC]">{contact.lastContact}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9AA3B2]/40">{tDemo("detailRole")}</p>
            <p className="mt-0.5 text-[13px] font-medium text-[#F7F8FC]">{contact.role}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9AA3B2]/40">{tDemo("detailCompany")}</p>
            <p className="mt-0.5 text-[13px] font-medium text-[#F7F8FC]">{contact.company}</p>
          </div>
        </div>
        <ActionBar openActionCTA={nav.openActionCTA} tDemo={tDemo} />
      </div>

      <AICard observation={tDemo(`aiObservation_${contact.id}`)} tDemo={tDemo} />

      {/* Related Company */}
      {relatedCompany && (
        <div className="space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9AA3B2]/50">{tDemo("detailRelatedCompanies")}</h3>
          <EntityChip
            label={relatedCompany.name}
            subtitle={relatedCompany.industry}
            color={healthColor(relatedCompany.health)}
            onClick={() => nav.navigate({ type: "company-detail", id: relatedCompany.id })}
          />
        </div>
      )}

      {/* Related Deals */}
      {relatedDeals.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9AA3B2]/50">{tDemo("detailRelatedDeals")}</h3>
          <div className="space-y-1.5">
            {relatedDeals.map((d) => (
              <EntityChip
                key={d.id}
                label={d.title}
                subtitle={`${d.value} · ${d.stage}`}
                color={d.stageColor}
                onClick={() => nav.navigate({ type: "deal-detail", id: d.id })}
              />
            ))}
          </div>
        </div>
      )}

      <ActivityFeed entityId={contact.id} tDemo={tDemo} />
    </motion.div>
  );
}

// ─── COMPANY DETAIL ──────────────────────────────────────────

function CompanyDetail({ company, nav }: { company: DemoCompany; nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  const contacts = DEMO_CONTACTS.filter((c) => c.company === company.name);
  const deals    = DEMO_DEALS.filter((d) => d.company === company.name);
  const hColor   = healthColor(company.health);

  return (
    <motion.div
      key={company.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <Breadcrumb items={[
        { label: tDemo("commandCompanies"), onClick: () => nav.navigate({ type: "section", section: "companies" }) },
        { label: company.name },
      ]} />

      {/* Header */}
      <div className="relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-xl font-bold text-[#F7F8FC]">
              {company.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{company.name}</h1>
              <p className="mt-0.5 text-[13px] text-[#9AA3B2]/70">{company.industry}</p>
            </div>
          </div>
          <span className="h-3 w-3 mt-1.5 rounded-full" style={{ backgroundColor: hColor }} />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/[0.04] pt-4">
          <div className="rounded-[12px] border border-white/[0.04] bg-white/[0.02] p-3 text-center">
            <p className="text-[22px] font-semibold text-[#F7F8FC]">{company.contacts}</p>
            <p className="mt-0.5 text-[10px] text-[#9AA3B2]/50">{tDemo("detailContacts")}</p>
          </div>
          <div className="rounded-[12px] border border-white/[0.04] bg-white/[0.02] p-3 text-center">
            <p className="text-[22px] font-semibold text-[#F7F8FC]">{company.openDeals}</p>
            <p className="mt-0.5 text-[10px] text-[#9AA3B2]/50">{tDemo("detailOpenDeals")}</p>
          </div>
          <div className="rounded-[12px] border border-[#6D5BFF]/10 bg-[#6D5BFF]/[0.04] p-3 text-center">
            <p className="text-[18px] font-semibold text-[#8B7DFF]">{company.totalValue}</p>
            <p className="mt-0.5 text-[10px] text-[#9AA3B2]/50">{tDemo("detailPipeline")}</p>
          </div>
        </div>
        <ActionBar openActionCTA={nav.openActionCTA} tDemo={tDemo} />
      </div>

      <AICard observation={tDemo(`aiObservation_${company.id}`)} tDemo={tDemo} />

      {/* Contacts */}
      {contacts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9AA3B2]/50">{tDemo("detailRelatedContacts")}</h3>
          <div className="space-y-1.5">
            {contacts.map((c) => {
              const pill = statusPill(c.status);
              return (
                <EntityChip
                  key={c.id}
                  label={c.name}
                  subtitle={c.role}
                  onClick={() => nav.navigate({ type: "contact-detail", id: c.id })}
                />
              );
              void pill;
            })}
          </div>
        </div>
      )}

      {/* Deals */}
      {deals.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9AA3B2]/50">{tDemo("detailRelatedDeals")}</h3>
          <div className="space-y-1.5">
            {deals.map((d) => (
              <EntityChip
                key={d.id}
                label={d.title}
                subtitle={`${d.value} · ${d.stage}`}
                color={d.stageColor}
                onClick={() => nav.navigate({ type: "deal-detail", id: d.id })}
              />
            ))}
          </div>
        </div>
      )}

      <ActivityFeed entityId={company.id} tDemo={tDemo} />
    </motion.div>
  );
}

// ─── DEAL DETAIL ─────────────────────────────────────────────

const STAGES = ["Discovery", "Proposal", "Negotiation", "Closed"];

function DealDetail({ deal, nav }: { deal: DemoDeal; nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  const relatedCompany  = DEMO_COMPANIES.find((c) => c.name === deal.company);
  const relatedContacts = DEMO_CONTACTS.filter((c) => c.company === deal.company);
  const stageIndex      = STAGES.indexOf(deal.stage);

  return (
    <motion.div
      key={deal.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <Breadcrumb items={[
        { label: tDemo("commandDeals"), onClick: () => nav.navigate({ type: "section", section: "deals" }) },
        { label: deal.title },
      ]} />

      {/* Header */}
      <div className="relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{deal.title}</h1>
            {relatedCompany && (
              <button
                onClick={() => nav.navigate({ type: "company-detail", id: relatedCompany.id })}
                className="mt-1 flex items-center gap-1 text-[12px] text-[#8B7DFF]/70 transition-colors hover:text-[#8B7DFF]"
              >
                <Building2 size={10} strokeWidth={1.75} />
                {deal.company}
              </button>
            )}
          </div>
          <div className="text-right">
            <p className="text-[22px] font-bold tracking-[-0.02em] text-[#F7F8FC]">{deal.value}</p>
            <p className="mt-0.5 text-[11px] text-[#9AA3B2]/50">{deal.daysOpen} {tDemo("detailDaysOpen")}</p>
          </div>
        </div>

        {/* Stage pipeline */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            {STAGES.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex w-full items-center">
                  <div className={`h-1.5 flex-1 rounded-full transition-all ${i <= stageIndex ? "" : "bg-white/[0.06]"}`}
                    style={i <= stageIndex ? { backgroundColor: deal.stageColor } : {}} />
                  <div className={`mx-auto h-3 w-3 rounded-full border-2 transition-all ${
                    i === stageIndex ? "scale-110 border-current" :
                    i < stageIndex  ? "bg-current border-current" :
                    "border-white/[0.12] bg-transparent"
                  }`} style={i <= stageIndex ? { color: deal.stageColor, borderColor: deal.stageColor } : {}} />
                  <div className={`h-1.5 flex-1 rounded-full transition-all ${i < stageIndex ? "" : "bg-white/[0.06]"}`}
                    style={i < stageIndex ? { backgroundColor: deal.stageColor } : {}} />
                </div>
                <span className={`text-[9px] font-medium tracking-[0.06em] ${i === stageIndex ? "text-[#F7F8FC]" : "text-[#9AA3B2]/30"}`}>
                  {s.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
        <ActionBar openActionCTA={nav.openActionCTA} tDemo={tDemo} />
      </div>

      <AICard observation={tDemo(`aiObservation_${deal.id}`)} tDemo={tDemo} />

      {/* Related contacts */}
      {relatedContacts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9AA3B2]/50">{tDemo("detailRelatedContacts")}</h3>
          <div className="space-y-1.5">
            {relatedContacts.map((c) => (
              <EntityChip
                key={c.id}
                label={c.name}
                subtitle={c.role}
                onClick={() => nav.navigate({ type: "contact-detail", id: c.id })}
              />
            ))}
          </div>
        </div>
      )}

      <ActivityFeed entityId={deal.id} tDemo={tDemo} />
    </motion.div>
  );
}

// ─── TASK DETAIL ─────────────────────────────────────────────

function TaskDetail({ task, nav }: { task: DemoTask; nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  const [done, setDone] = useState(false);

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <Breadcrumb items={[
        { label: tDemo("commandTasks"), onClick: () => nav.navigate({ type: "section", section: "tasks" }) },
        { label: task.title },
      ]} />

      <div className="relative overflow-hidden rounded-[20px] border border-white/[0.055] bg-[#0A0E17] p-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => { setDone(true); setTimeout(() => nav.openActionCTA(), 600); }}
            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
              done ? "border-[#22c55e] bg-[#22c55e]/20" : "border-white/20"
            }`}
          >
            {done && <CheckCircle2 size={12} className="text-[#22c55e]" />}
          </button>
          <div>
            <h1 className={`text-[18px] font-semibold tracking-[-0.01em] transition-all ${done ? "text-[#9AA3B2]/40 line-through" : "text-[#F7F8FC]"}`}>
              {task.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9AA3B2]/40">{tDemo("detailDue")}</p>
                <p className="mt-0.5 text-[13px] font-medium" style={{ color: task.dueColor }}>{task.due}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9AA3B2]/40">{tDemo("detailPriority")}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${priorityDot(task.priority)}`} />
                  <p className="text-[13px] font-medium text-[#F7F8FC]">{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── SIGNAL DETAIL ───────────────────────────────────────────

function SignalDetail({ signal, nav }: { signal: DemoSignal; nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  const uc    = urgencyColor(signal.urgency);
  const typeK = signalTypeKey(signal.type);

  function goToEntity() {
    if (signal.entityType === "contact") nav.navigate({ type: "contact-detail", id: signal.entityId });
    else if (signal.entityType === "company") nav.navigate({ type: "company-detail", id: signal.entityId });
    else if (signal.entityType === "deal") nav.navigate({ type: "deal-detail", id: signal.entityId });
    else nav.navigate({ type: "task-detail", id: signal.entityId });
  }

  return (
    <motion.div
      key={signal.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <Breadcrumb items={[
        { label: tDemo("signalsTitle"), onClick: () => nav.navigate({ type: "section", section: "signals" }) },
        { label: signal.title },
      ]} />

      <div className={`relative overflow-hidden rounded-[20px] border bg-[#0A0E17] p-6 ${uc.border}`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${uc.border} ${uc.bg}`}>
            {signal.urgency === "critical" ? <AlertTriangle size={18} className={uc.text} /> :
             signal.urgency === "info"     ? <Info          size={18} className={uc.text} /> :
                                            <Zap           size={18} className={uc.text} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${uc.bg} ${uc.text}`}>
                {tDemo(typeK)}
              </span>
              <span className="text-[11px] text-[#9AA3B2]/40">{signal.createdAt}</span>
            </div>
            <h1 className="mt-2 text-[18px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">{signal.title}</h1>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#9AA3B2]/70">{signal.description}</p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={goToEntity}
            className="flex items-center gap-2 rounded-[10px] bg-[#6D5BFF] px-4 py-2.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            {tDemo("signalViewEntity")}
            <ChevronRight size={12} />
          </button>
          <button
            type="button"
            onClick={nav.openActionCTA}
            className="flex items-center gap-2 rounded-[10px] border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-[12px] font-medium text-[#9AA3B2]/70 transition-all hover:border-white/[0.12]"
          >
            {tDemo("actionAddNote")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── SECTION: CONTACTS ───────────────────────────────────────

function ContactsSection({ nav }: { nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  return (
    <div className="space-y-3">
      <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{tDemo("commandContacts")}</h2>
      <div className="overflow-hidden rounded-[16px] border border-white/[0.055] bg-[#0A0E17]">
        <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/[0.04] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9AA3B2]/40 sm:grid-cols-[1fr_1fr_auto_auto]">
          <span>Name</span>
          <span className="hidden sm:block">Company</span>
          <span className="hidden sm:block">{tDemo("detailLastContact")}</span>
          <span>Status</span>
        </div>
        {DEMO_CONTACTS.map((c, i) => {
          const pill = statusPill(c.status);
          const statusLabel = tDemo(`status${c.status.charAt(0).toUpperCase()}${c.status.slice(1)}`);
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              onClick={() => nav.navigate({ type: "contact-detail", id: c.id })}
              className="grid w-full grid-cols-[1fr_auto] gap-4 border-b border-white/[0.03] px-5 py-3.5 last:border-0 transition-colors hover:bg-white/[0.02] sm:grid-cols-[1fr_1fr_auto_auto]"
            >
              <div className="text-left">
                <p className="text-[13px] font-medium text-[#F7F8FC]">{c.name}</p>
                <p className="mt-0.5 text-[11px] text-[#9AA3B2]/50">{c.role}</p>
              </div>
              <p className="hidden self-center text-[13px] text-[#9AA3B2]/70 sm:block">{c.company}</p>
              <p className="hidden self-center text-[12px] text-[#9AA3B2]/40 sm:block">{c.lastContact}</p>
              <span className={`self-center inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${pill.bg} ${pill.text}`}>
                {statusLabel}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── SECTION: COMPANIES ──────────────────────────────────────

function CompaniesSection({ nav }: { nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  return (
    <div className="space-y-3">
      <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{tDemo("commandCompanies")}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_COMPANIES.map((co, i) => (
          <motion.button
            key={co.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.28 }}
            onClick={() => nav.navigate({ type: "company-detail", id: co.id })}
            className="relative overflow-hidden rounded-[16px] border border-white/[0.055] bg-[#0A0E17] p-5 text-left transition-all hover:border-white/[0.1] hover:bg-white/[0.015]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[15px] font-semibold text-[#F7F8FC]">{co.name}</p>
                <p className="mt-0.5 text-[11px] text-[#9AA3B2]/50">{co.industry}</p>
              </div>
              <span className="h-2.5 w-2.5 mt-0.5 rounded-full" style={{ backgroundColor: healthColor(co.health) }} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-[#9AA3B2]/40">{tDemo("detailContacts")}</p>
                <p className="mt-0.5 text-[18px] font-semibold text-[#F7F8FC]">{co.contacts}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9AA3B2]/40">{tDemo("detailOpenDeals")}</p>
                <p className="mt-0.5 text-[18px] font-semibold text-[#F7F8FC]">{co.openDeals}</p>
              </div>
            </div>
            {co.totalValue !== "—" && (
              <p className="mt-3 text-[12px] text-[#6D5BFF]">{co.totalValue} {tDemo("detailPipeline").toLowerCase()}</p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION: DEALS ──────────────────────────────────────────

function DealsSection({ nav }: { nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  const total = DEMO_DEALS.reduce((sum, d) => sum + parseInt(d.value.replace(/[^0-9]/g, ""), 10), 0);
  return (
    <div className="space-y-3">
      <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{tDemo("commandDeals")}</h2>
      <div className="space-y-2">
        {DEMO_DEALS.map((d, i) => (
          <motion.button
            key={d.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.28 }}
            onClick={() => nav.navigate({ type: "deal-detail", id: d.id })}
            className="flex w-full items-center justify-between rounded-[14px] border border-white/[0.055] bg-[#0A0E17] px-5 py-4 text-left transition-all hover:border-white/[0.1] hover:bg-white/[0.015]"
          >
            <div className="flex items-center gap-4">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.stageColor }} />
              <div>
                <p className="text-[13px] font-medium text-[#F7F8FC]">{d.title}</p>
                <p className="mt-0.5 text-[11px] text-[#9AA3B2]/50">{d.company} · {d.daysOpen}d open</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden rounded-full border px-2.5 py-0.5 text-[11px] font-medium sm:inline-flex"
                style={{ borderColor: `${d.stageColor}40`, color: d.stageColor, backgroundColor: `${d.stageColor}10` }}>
                {d.stage}
              </span>
              <p className="text-[14px] font-semibold text-[#F7F8FC]">{d.value}</p>
            </div>
          </motion.button>
        ))}
      </div>
      <div className="rounded-[12px] border border-[#6D5BFF]/15 bg-[#6D5BFF]/[0.04] px-5 py-3">
        <p className="text-[12px] text-[#9AA3B2]/60">
          {tDemo("detailPipeline")}: <span className="font-semibold text-[#F7F8FC]">€{total.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

// ─── SECTION: TASKS ──────────────────────────────────────────

function TasksSection({ nav }: { nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  const [checked, setChecked] = useState<Set<string>>(new Set());
  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  return (
    <div className="space-y-3">
      <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{tDemo("commandTasks")}</h2>
      <div className="space-y-1.5">
        {DEMO_TASKS.map((task, i) => {
          const done = checked.has(task.id);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="flex items-center gap-3 rounded-[12px] border border-white/[0.04] bg-[#0A0E17] px-4 py-3.5"
            >
              <button
                type="button"
                onClick={() => toggle(task.id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                  done ? "border-[#22c55e] bg-[#22c55e]/20" : "border-white/20"
                }`}
              >
                {done && <Circle size={8} className="fill-[#22c55e] text-[#22c55e]" />}
              </button>
              <button
                type="button"
                onClick={() => nav.navigate({ type: "task-detail", id: task.id })}
                className="flex flex-1 items-center justify-between gap-4 text-left"
              >
                <p className={`text-[13px] transition-all ${done ? "text-[#9AA3B2]/40 line-through" : "text-[#F7F8FC]"}`}>
                  {task.title}
                </p>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden text-[11px] sm:block" style={{ color: done ? "#9AA3B2" : task.dueColor }}>{task.due}</span>
                  <span className={`h-2 w-2 rounded-full ${priorityDot(task.priority)}`} />
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SECTION: SIGNALS ────────────────────────────────────────

function SignalsSection({ nav }: { nav: DemoNav }) {
  const tDemo = useTranslations("demo");
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{tDemo("signalsTitle")}</h2>
        <p className="mt-1 text-[13px] text-[#9AA3B2]/60">{tDemo("signalsSubtitle")}</p>
      </div>
      <div className="space-y-2">
        {DEMO_SIGNALS.map((s, i) => {
          const uc    = urgencyColor(s.urgency);
          const typeK = signalTypeKey(s.type);
          return (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.28 }}
              onClick={() => nav.navigate({ type: "signal-detail", id: s.id })}
              className={`w-full rounded-[14px] border bg-[#0A0E17] p-4 text-left transition-all hover:bg-white/[0.015] ${uc.border}`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full`} style={{ backgroundColor: uc.dot }} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${uc.text}`}>
                      {tDemo(typeK)}
                    </span>
                    <span className="shrink-0 text-[11px] text-[#9AA3B2]/40">{s.createdAt}</span>
                  </div>
                  <p className="mt-1 text-[13px] font-medium text-[#F7F8FC]">{s.title}</p>
                  <p className="mt-0.5 text-[12px] text-[#9AA3B2]/60">{s.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── SECTION: MEMORY ─────────────────────────────────────────

function MemorySection() {
  const tDemo = useTranslations("demo");
  const facts     = DEMO_MEMORIES.filter((m) => m.type === "fact");
  const patterns  = DEMO_MEMORIES.filter((m) => m.type === "pattern");
  const decisions = DEMO_MEMORIES.filter((m) => m.type === "decision");
  const relations = DEMO_MEMORIES.filter((m) => m.type === "relationship");

  function MemoryCard({ mem }: { mem: DemoMemory }) {
    const typeK  = memoryTypeKey(mem.type);
    const badge  = memoryTypeBadge(mem.type);
    return (
      <div className="rounded-[12px] border border-white/[0.04] bg-[#0A0E17] p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[12px] leading-relaxed text-[#F7F8FC]/80">{mem.content}</p>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] ${badge}`}>
            {tDemo(typeK)}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
              <div className="h-full rounded-full bg-[#6D5BFF]/50 transition-all" style={{ width: `${mem.confidence * 100}%` }} />
            </div>
            <span className="text-[10px] text-[#9AA3B2]/40">{Math.round(mem.confidence * 100)}%</span>
          </div>
          <span className="text-[10px] text-[#9AA3B2]/30">{mem.source}</span>
          <span className="text-[10px] text-[#9AA3B2]/30">{mem.observedAt}</span>
        </div>
      </div>
    );
  }

  const groups = [
    { labelKey: "memoryRecent",        items: [...facts, ...decisions] },
    { labelKey: "memoryPatterns",      items: patterns },
    { labelKey: "memoryRelationships", items: relations },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <AiCore size={40} showRings={false} showParticles={false} intensity="strong" />
        </div>
        <div>
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{tDemo("memoryTitle")}</h2>
          <p className="mt-1 text-[13px] text-[#9AA3B2]/60">{tDemo("memorySubtitle")}</p>
        </div>
      </div>

      {groups.map(({ labelKey, items }) => items.length > 0 && (
        <div key={labelKey} className="space-y-2">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9AA3B2]/50">{tDemo(labelKey)}</h3>
          <div className="space-y-1.5">
            {items.map((m) => <MemoryCard key={m.id} mem={m} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Command Center ──────────────────────────────────────────

type CmdResult = { type: "contact" | "company" | "deal" | "task"; label: string; sub: string; id: string };

function CommandCenter({ onClose, onNavigate }: {
  onClose: () => void;
  onNavigate: (entry: NavEntry) => void;
}) {
  const tDemo = useTranslations("demo");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const q = query.toLowerCase();
  const results: CmdResult[] = q.length < 1 ? [] : [
    ...DEMO_CONTACTS.filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)).map((c) => ({
      type: "contact" as const, label: c.name, sub: c.role, id: c.id,
    })),
    ...DEMO_COMPANIES.filter((c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)).map((c) => ({
      type: "company" as const, label: c.name, sub: c.industry, id: c.id,
    })),
    ...DEMO_DEALS.filter((d) => d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q)).map((d) => ({
      type: "deal" as const, label: d.title, sub: `${d.value} · ${d.stage}`, id: d.id,
    })),
    ...DEMO_TASKS.filter((t) => t.title.toLowerCase().includes(q)).map((t) => ({
      type: "task" as const, label: t.title, sub: t.due, id: t.id,
    })),
  ];

  function select(r: CmdResult) {
    if (r.type === "contact") onNavigate({ type: "contact-detail", id: r.id });
    else if (r.type === "company") onNavigate({ type: "company-detail", id: r.id });
    else if (r.type === "deal") onNavigate({ type: "deal-detail", id: r.id });
    else onNavigate({ type: "task-detail", id: r.id });
    onClose();
  }

  const typeIcon: Record<string, LucideIcon> = {
    contact: Users, company: Building2, deal: TrendingUp, task: CheckSquare,
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-start justify-center px-4 pt-[15vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[560px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0A0F1F]/98 shadow-[0_32px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-white/[0.05] px-5 py-4">
          <Search size={16} className="shrink-0 text-[#9AA3B2]/50" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tDemo("commandPlaceholder")}
            className="flex-1 bg-transparent text-[14px] text-[#F7F8FC] placeholder:text-[#9AA3B2]/30 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-[#9AA3B2]/40 transition-colors hover:text-[#9AA3B2]"
          >
            <X size={13} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto">
          {q.length > 0 && results.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-[13px] text-[#9AA3B2]/40">{tDemo("commandEmpty")} &ldquo;{query}&rdquo;</p>
            </div>
          ) : q.length === 0 ? (
            <div className="px-5 py-6 text-center">
              <p className="text-[12px] text-[#9AA3B2]/30">{tDemo("commandHint")}</p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((r) => {
                const Icon = typeIcon[r.type] ?? FileText;
                return (
                  <button
                    key={`${r.type}-${r.id}`}
                    type="button"
                    onClick={() => select(r)}
                    className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
                      <Icon size={13} className="text-[#9AA3B2]/60" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#F7F8FC]">{r.label}</p>
                      <p className="mt-0.5 text-[11px] text-[#9AA3B2]/40">{r.sub}</p>
                    </div>
                    <div className="ml-auto">
                      <ChevronRight size={13} className="text-[#9AA3B2]/25" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-white/[0.04] px-5 py-3">
          <kbd className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-[#9AA3B2]/25">↑↓</kbd>
          <kbd className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-[#9AA3B2]/25">↵</kbd>
          <kbd className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 text-[9px] text-[#9AA3B2]/25">Esc</kbd>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Action CTA Modal ─────────────────────────────────────────

function ActionCTAModal({ onClose, tDemo }: { onClose: () => void; tDemo: (k: string) => string }) {
  return (
    <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0A0F1F]/98 p-8 shadow-[0_32px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6D5BFF]/30 to-transparent" />
        <div className="mb-5 flex justify-center">
          <AiCore size={56} showRings intensity="strong" />
        </div>
        <h2 className="text-center text-[18px] font-semibold tracking-[-0.02em] text-[#F7F8FC]">{tDemo("actionCTATitle")}</h2>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-[#9AA3B2]/70">{tDemo("actionCTABody")}</p>
        <div className="mt-6 space-y-2">
          <Link
            href="/register?ref=demo"
            className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#6D5BFF] px-5 py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Sparkles size={13} />
            {tDemo("actionCTAButton")}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-[12px] px-5 py-3 text-[13px] text-[#9AA3B2]/50 transition-colors hover:text-[#9AA3B2]"
          >
            {tDemo("actionCTADismiss")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Timed CTA Banner ─────────────────────────────────────────

function TimedCTABanner({ onDismiss, tDemo }: { onDismiss: () => void; tDemo: (k: string) => string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-[7000] w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-[20px] border border-[#6D5BFF]/25 bg-[#0A0F1F]/98 p-5 shadow-[0_16px_60px_rgba(109,91,255,0.2)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6D5BFF]/25 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <AiCore size={28} showRings={false} showParticles={false} intensity="strong" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#F7F8FC]">{tDemo("ctaTimedTitle")}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#9AA3B2]/60">{tDemo("ctaTimedBody")}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-[#9AA3B2]/30 transition-colors hover:text-[#9AA3B2]"
        >
          <X size={14} />
        </button>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href="/register?ref=demo-timed"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#6D5BFF] px-4 py-2.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Sparkles size={11} />
          {tDemo("ctaTimedButton")}
        </Link>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-[10px] border border-white/[0.06] px-4 py-2.5 text-[12px] text-[#9AA3B2]/40 transition-colors hover:text-[#9AA3B2]"
        >
          {tDemo("ctaTimedDismiss")}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main DemoDashboardPage ───────────────────────────────────

export default function DemoDashboardPage({ initialSection }: { initialSection?: string }) {
  const tNav  = useTranslations("nav");
  const tDemo = useTranslations("demo");

  const [navStack, setNavStack] = useState<NavEntry[]>([
    { type: "section", section: toSection(initialSection) },
  ]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cmdOpen, setCmdOpen]       = useState(false);
  const [actionCTA, setActionCTA]   = useState(false);
  const [timedCTA, setTimedCTA]     = useState(false);
  const [ctaDismissed, setCtaDismissed] = useState(false);

  const currentEntry = navStack[navStack.length - 1];
  const canGoBack    = navStack.length > 1;

  const transition = useCallback((fn: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      fn();
      setIsTransitioning(false);
    }, 150);
  }, []);

  const navigate = useCallback((entry: NavEntry) => {
    transition(() => setNavStack((prev) => [...prev, entry]));
  }, [transition]);

  const goBack = useCallback(() => {
    if (navStack.length <= 1) return;
    transition(() => setNavStack((prev) => prev.slice(0, -1)));
  }, [navStack.length, transition]);

  const navigateToSection = useCallback((section: DemoSection) => {
    transition(() => setNavStack([{ type: "section", section }]));
  }, [transition]);

  const openActionCTA = useCallback(() => setActionCTA(true), []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
        return;
      }
      if (e.key === "Escape") {
        if (cmdOpen) { setCmdOpen(false); return; }
        if (actionCTA) { setActionCTA(false); return; }
        if (canGoBack) { goBack(); }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [cmdOpen, actionCTA, canGoBack, goBack]);

  // Timed CTA: 2 minutes
  useEffect(() => {
    if (ctaDismissed) return;
    const timer = setTimeout(() => setTimedCTA(true), 120000);
    return () => clearTimeout(timer);
  }, [ctaDismissed]);

  const demoNav: DemoNav = { navigate, goBack, openActionCTA };

  function getNavLabel(item: NavItem): string {
    return item.useNavNs ? tNav(item.labelKey) : tDemo(item.labelKey);
  }

  function getActiveSection(): DemoSection | null {
    if (currentEntry.type === "section") return currentEntry.section;
    return null;
  }

  function renderContent() {
    if (isTransitioning) return <DemoShimmer />;

    switch (currentEntry.type) {
      case "section":
        switch (currentEntry.section) {
          case "today":     return <TodayView displayName={DEMO_DISPLAY_NAME} {...DEMO_TODAY_DATA} />;
          case "contacts":  return <ContactsSection nav={demoNav} />;
          case "companies": return <CompaniesSection nav={demoNav} />;
          case "deals":     return <DealsSection nav={demoNav} />;
          case "tasks":     return <TasksSection nav={demoNav} />;
          case "signals":   return <SignalsSection nav={demoNav} />;
          case "memory":    return <MemorySection />;
          case "email":     return <GunimiEmptyState title="Email" icon={Mail} description={tDemo("connectPrompt")} action={<Link href="/register?ref=demo" className="inline-flex items-center gap-2 rounded-[10px] bg-[#6D5BFF] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90">{tDemo("enterGunimi")}<ChevronRight size={14}/></Link>} />;
          case "calendar":  return <GunimiEmptyState title="Calendar" icon={CalendarDays} description={tDemo("connectPrompt")} action={<Link href="/register?ref=demo" className="inline-flex items-center gap-2 rounded-[10px] bg-[#6D5BFF] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90">{tDemo("enterGunimi")}<ChevronRight size={14}/></Link>} />;
          case "analytics": return <GunimiEmptyState title="Analytics" icon={BarChart3} description={tDemo("connectPrompt")} action={<Link href="/register?ref=demo" className="inline-flex items-center gap-2 rounded-[10px] bg-[#6D5BFF] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90">{tDemo("enterGunimi")}<ChevronRight size={14}/></Link>} />;
          case "settings":  return <GunimiEmptyState title="Settings" icon={Settings} description={tDemo("connectPrompt")} action={<Link href="/register?ref=demo" className="inline-flex items-center gap-2 rounded-[10px] bg-[#6D5BFF] px-5 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90">{tDemo("enterGunimi")}<ChevronRight size={14}/></Link>} />;
        }
        break;

      case "contact-detail": {
        const contact = DEMO_CONTACTS.find((c) => c.id === currentEntry.id);
        return contact ? <ContactDetail contact={contact} nav={demoNav} /> : null;
      }
      case "company-detail": {
        const company = DEMO_COMPANIES.find((c) => c.id === currentEntry.id);
        return company ? <CompanyDetail company={company} nav={demoNav} /> : null;
      }
      case "deal-detail": {
        const deal = DEMO_DEALS.find((d) => d.id === currentEntry.id);
        return deal ? <DealDetail deal={deal} nav={demoNav} /> : null;
      }
      case "task-detail": {
        const task = DEMO_TASKS.find((t) => t.id === currentEntry.id);
        return task ? <TaskDetail task={task} nav={demoNav} /> : null;
      }
      case "signal-detail": {
        const signal = DEMO_SIGNALS.find((s) => s.id === currentEntry.id);
        return signal ? <SignalDetail signal={signal} nav={demoNav} /> : null;
      }
    }
    return null;
  }

  const activeSection = getActiveSection();

  return (
    <div className="flex min-h-dvh bg-[#05060A] text-white">

      {/* ── Sidebar (desktop) ─────────────────────────────── */}
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-white/[0.04] bg-[#05060A] lg:flex">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.04] px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-9 w-9 shrink-0">
              <AiCore size={36} showRings={false} showParticles={false} intensity="strong" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[13px] font-semibold tracking-[-0.01em] text-[#F7F8FC]">Gunimi</h1>
              <p className="mt-px truncate text-[10px] font-medium tracking-[0.02em] text-[#9AA3B2]/65">
                {DEMO_WORKSPACE_NAME}
              </p>
            </div>
          </div>
          <span className="ml-2 flex shrink-0 items-center rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/[0.08] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#F59E0B]">
            Demo
          </span>
        </div>

        {/* Nav */}
        <nav aria-label="Demo navigation" className="flex-1 overflow-y-auto px-2.5 py-3">
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateToSection(item.id)}
                  className={[
                    "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5",
                    "transition-all duration-[220ms]",
                    isActive
                      ? "bg-[#0F1520] text-[#F7F8FC] shadow-[inset_2px_0_0_#6D5BFF]"
                      : "text-[#9AA3B2]/65 hover:bg-white/[0.025] hover:text-[#F7F8FC]/80",
                  ].join(" ")}
                >
                  <div className={[
                    "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg",
                    "transition-colors duration-[220ms]",
                    isActive
                      ? "bg-[#6D5BFF]/12 text-[#8B7DFF]"
                      : "text-[#9AA3B2]/50 group-hover:text-[#9AA3B2]/80",
                  ].join(" ")}>
                    <Icon size={14} strokeWidth={1.75} />
                  </div>
                  <span className="text-[13px] font-medium tracking-[-0.01em]">
                    {getNavLabel(item)}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="space-y-2 border-t border-white/[0.04] p-3">
          <Link
            href="/register?ref=demo"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D5BFF] px-4 py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Sparkles size={13} />
            {tDemo("enterGunimi")}
          </Link>
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.05] px-4 py-2.5 text-[12px] text-[#9AA3B2]/60 transition-colors hover:text-[#9AA3B2]"
          >
            <ArrowLeft size={12} />
            {tDemo("exitDemo")}
          </Link>
        </div>
      </aside>

      {/* ── Main column ──────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Topbar */}
        <header
          className="sticky top-0 z-topbar flex items-center justify-between border-b border-white/[0.04] bg-[#05060A]/80 px-4 py-2.5 backdrop-blur-[18px] lg:px-6"
          style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 lg:hidden">
              <AiCore size={22} showRings={false} showParticles={false} intensity="strong" />
              <span className="text-[13px] font-semibold text-[#F7F8FC]">Gunimi</span>
            </div>
            {/* Back button when in detail view */}
            {canGoBack && (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 rounded-[8px] border border-white/[0.06] px-2.5 py-1.5 text-[12px] text-[#9AA3B2]/70 transition-colors hover:text-[#9AA3B2]"
              >
                <ArrowLeft size={12} />
                {tDemo("back")}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Command center trigger */}
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              aria-label={tDemo("openCommand")}
              className="hidden items-center gap-2 rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[11px] text-[#9AA3B2]/30 transition-colors hover:border-white/[0.1] hover:text-[#9AA3B2]/60 md:flex"
            >
              <Search size={12} />
              <span className="hidden lg:block">{tDemo("commandPlaceholder")}</span>
              <kbd className="rounded border border-white/[0.06] bg-white/[0.03] px-1 py-0.5 text-[9px]">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-white/[0.06] text-[#9AA3B2]/50 transition-colors hover:text-[#9AA3B2] md:hidden"
            >
              <Search size={14} />
            </button>
            {/* Demo badge */}
            <span className="hidden items-center gap-1.5 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F59E0B] sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F59E0B]" />
              {tDemo("banner")}
            </span>
            <Link
              href="/register?ref=demo"
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#6D5BFF] px-4 py-2 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              {tDemo("enterGunimi")}
            </Link>
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-[10px] border border-white/[0.06] px-3 py-2 text-[12px] text-[#9AA3B2]/60 transition-colors hover:text-[#9AA3B2] md:flex"
            >
              <ArrowLeft size={12} />
              {tDemo("exitDemo")}
            </Link>
          </div>
        </header>

        {/* Mobile section nav (top 5 only) */}
        <div className="flex gap-1 overflow-x-auto border-b border-white/[0.04] px-4 py-2 lg:hidden">
          {NAV_ITEMS.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToSection(item.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all ${
                  isActive ? "bg-[#6D5BFF]/15 text-[#8B7DFF]" : "text-[#9AA3B2]/60 hover:text-[#9AA3B2]"
                }`}
              >
                <Icon size={13} strokeWidth={1.75} />
                {getNavLabel(item)}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          <motion.main
            key={`${currentEntry.type}-${currentEntry.type === "section" ? currentEntry.section : currentEntry.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8"
          >
            {renderContent()}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* ── Overlays ─────────────────────────────────────── */}
      <AnimatePresence>
        {cmdOpen && (
          <CommandCenter
            key="cmd"
            onClose={() => setCmdOpen(false)}
            onNavigate={(entry) => { navigate(entry); setCmdOpen(false); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {actionCTA && (
          <ActionCTAModal key="action-cta" onClose={() => setActionCTA(false)} tDemo={tDemo} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {timedCTA && !ctaDismissed && (
          <TimedCTABanner
            key="timed-cta"
            onDismiss={() => { setTimedCTA(false); setCtaDismissed(true); }}
            tDemo={tDemo}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
