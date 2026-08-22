"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Pencil,
  TrendingUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import { formatCurrency } from "@/lib/utils/formatCurrency";

import type { Deal } from "@/types/deal";
import type { WorkspaceDealStage } from "@/types/dealStage";

const SLUG_BORDER: Record<string, string> = {
  lead: "border-l-violet-500/60",
  qualified: "border-l-cyan-500/60",
  proposal: "border-l-blue-500/60",
  negotiation: "border-l-amber-500/60",
  won: "border-l-emerald-500/60",
  lost: "border-l-zinc-600/60",
};

const SLUG_DOT: Record<string, string> = {
  lead: "bg-violet-400",
  qualified: "bg-cyan-400",
  proposal: "bg-blue-400",
  negotiation: "bg-amber-400",
  won: "bg-emerald-400",
  lost: "bg-zinc-500",
};

function closeDateClass(dateStr?: string): string {
  if (!dateStr) return "text-zinc-600";
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff < 0) return "text-red-400";
  if (diff < 7 * 86_400_000) return "text-amber-400";
  return "text-zinc-500";
}

function formatCloseDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type RowProps = {
  deal: Deal;
  stage: WorkspaceDealStage;
  onNavigate: (id: string) => void;
  onEdit: (deal: Deal) => void;
};

function DealRow({ deal, stage, onNavigate, onEdit }: RowProps) {
  const t = useTranslations("deals");
  const [now] = useState(() => Date.now());
  const borderClass = SLUG_BORDER[stage.slug] ?? "border-l-zinc-700/50";
  const isOverdue = !!deal.expected_close_date && new Date(deal.expected_close_date).getTime() < now;

  return (
    <div
      onClick={() => onNavigate(deal.id)}
      className={cn(
        "group flex cursor-pointer items-center gap-4 border-l-2 px-4 py-3",
        "border-b border-b-white/[0.04] transition-colors hover:bg-white/[0.025]",
        borderClass,
      )}
    >
      {/* Icon */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
        <TrendingUp size={12} className="text-violet-400" />
      </div>

      {/* Title + chips */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white/90">{deal.title}</p>
        <div className="mt-0.5 flex items-center gap-2">
          {deal.company?.id && (
            <Link
              href={`/dashboard/companies/${deal.company.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-violet-300"
            >
              <Building2 size={9} />
              {deal.company.name}
            </Link>
          )}
          {deal.company && deal.contact && <span className="text-zinc-700">·</span>}
          {deal.contact?.id && (
            <Link
              href={`/dashboard/contacts/${deal.contact.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-zinc-600 transition-colors hover:text-violet-300"
            >
              <User size={9} />
              {deal.contact.name}
            </Link>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="hidden w-28 shrink-0 text-right sm:block">
        <p className="text-sm font-medium tabular-nums text-white/70">
          {formatCurrency(Number(deal.value ?? 0), deal.currency)}
        </p>
        {(deal.paid_amount ?? 0) > 0 && (
          <p className="text-[10px] text-emerald-400/70">
            {t("paid")}: {formatCurrency(Number(deal.paid_amount), deal.currency)}
          </p>
        )}
      </div>

      {/* Probability */}
      {deal.probability != null && (
        <div className="hidden w-12 shrink-0 text-right lg:block">
          <p className="text-xs tabular-nums text-zinc-500">{deal.probability}%</p>
        </div>
      )}

      {/* Close date */}
      <div className="hidden w-20 shrink-0 text-right md:block">
        <p className={cn("text-xs tabular-nums", closeDateClass(deal.expected_close_date))}>
          {formatCloseDate(deal.expected_close_date)}
        </p>
        {isOverdue && (
          <p className="text-[10px] text-red-500/70">{t("overdue")}</p>
        )}
      </div>

      {/* Edit + Arrow */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(deal); }}
          className="flex h-6 w-6 items-center justify-center rounded-md text-white/20 opacity-0 transition-all hover:bg-white/[0.06] hover:text-white/60 group-hover:opacity-100"
        >
          <Pencil size={11} />
        </button>
        <ArrowRight size={14} className="text-zinc-700 transition-colors group-hover:text-violet-400" />
      </div>
    </div>
  );
}

type GroupHeaderProps = {
  stage: WorkspaceDealStage;
  count: number;
  totalValue: number;
  open: boolean;
  onToggle: () => void;
};

function StageGroupHeader({ stage, count, totalValue, open, onToggle }: GroupHeaderProps) {
  const dotClass = SLUG_DOT[stage.slug] ?? "bg-zinc-600";

  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-white/[0.02]"
    >
      <ChevronRight
        size={12}
        className={cn("shrink-0 text-zinc-600 transition-transform", open && "rotate-90")}
      />
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} />
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
        {stage.name}
      </span>
      <span className="ml-1 rounded-full bg-white/[0.05] px-1.5 py-0.5 text-[10px] tabular-nums text-zinc-600">
        {count}
      </span>
      {totalValue > 0 && (
        <span className="ml-auto pr-1 text-[11px] tabular-nums text-zinc-600">
          {formatCurrency(totalValue)}
        </span>
      )}
    </button>
  );
}

type Props = {
  deals: Deal[];
  stages: WorkspaceDealStage[];
  onEdit: (deal: Deal) => void;
  initialStage?: string;
};

export default function DealsListCommand({ deals, stages, onEdit }: Props) {
  const router = useRouter();
  const t = useTranslations("deals");

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const handleNavigate = useCallback((id: string) => {
    router.push(`/dashboard/deals/${id}`);
  }, [router]);

  const toggleGroup = useCallback((slug: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }, []);

  if (deals.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <GunimiEmptyState
          title={t("noDeals")}
          description={t("noDealsDescription")}
          icon={TrendingUp}
        />
      </div>
    );
  }

  const dealsByStage = new Map<string, Deal[]>();
  for (const stage of stages) dealsByStage.set(stage.slug, []);
  for (const deal of deals) {
    const arr = dealsByStage.get(deal.stage);
    if (arr) arr.push(deal);
    else dealsByStage.set(deal.stage, [deal]);
  }

  const stageMap = new Map(stages.map((s) => [s.slug, s]));

  const knownSlugs = new Set(stages.map((s) => s.slug));
  const unknownDeals = deals.filter((d) => !knownSlugs.has(d.stage));

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080C14]">
      {stages.map((stage) => {
        const items = dealsByStage.get(stage.slug) ?? [];
        if (items.length === 0) return null;
        const isOpen = !collapsed.has(stage.slug);
        const totalValue = items.reduce((sum, d) => sum + Number(d.value ?? 0), 0);
        return (
          <div key={stage.slug} className="border-b border-white/[0.04] last:border-b-0">
            <StageGroupHeader
              stage={stage}
              count={items.length}
              totalValue={totalValue}
              open={isOpen}
              onToggle={() => toggleGroup(stage.slug)}
            />
            {isOpen && items.map((deal) => (
              <DealRow
                key={deal.id}
                deal={deal}
                stage={stageMap.get(deal.stage) ?? stage}
                onNavigate={handleNavigate}
                onEdit={onEdit}
              />
            ))}
          </div>
        );
      })}
      {unknownDeals.map((deal) => (
        <DealRow
          key={deal.id}
          deal={deal}
          stage={{ id: "", slug: deal.stage, name: deal.stage, order_index: 0, color: "", is_won: false, is_lost: false, created_at: "" }}
          onNavigate={handleNavigate}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
