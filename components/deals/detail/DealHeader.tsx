"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Activity,
  ArrowLeft,
  Calendar,
  ChevronDown,
  Pencil,
  Target,
  TrendingUp,
  Building2,
  User,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import GunimiButton from "@/components/ui/GunimiButton";
import TagPicker from "@/components/ui/TagPicker";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { updateDealStage } from "@/server/actions/deals/updateDealStage";

import type { Deal } from "@/types/deal";
import type { WorkspaceTag } from "@/types/tag";

const STAGES = ["lead", "qualified", "proposal", "negotiation", "won", "lost"] as const;
type DealStage = (typeof STAGES)[number];

const STAGE_BADGE: Record<DealStage, string> = {
  lead: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  qualified: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  proposal: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  negotiation: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  won: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  lost: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
};

const STAGE_DOT: Record<DealStage, string> = {
  lead: "bg-violet-400",
  qualified: "bg-cyan-400",
  proposal: "bg-blue-400",
  negotiation: "bg-amber-400",
  won: "bg-emerald-400",
  lost: "bg-zinc-400",
};

const STAGE_WEIGHTS: Record<string, number> = {
  negotiation: 1.2,
  proposal: 1.0,
  qualified: 0.85,
  lead: 0.7,
};

type HealthKey = "healthy" | "warning" | "at-risk";

const HEALTH_STYLES: Record<HealthKey, string> = {
  healthy: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  "at-risk": "border-red-500/20 bg-red-500/10 text-red-300",
};

function computeHealth(deal: Deal): { key: HealthKey; labelKey: "healthStatusHealthy" | "healthStatusWarning" | "healthStatusAtRisk" } {
  const now = Date.now();
  const MS_PER_DAY = 86_400_000;
  const daysSinceUpdated = deal.updated_at
    ? Math.floor((now - new Date(deal.updated_at).getTime()) / MS_PER_DAY)
    : 30;
  const daysUntilClose = deal.expected_close_date
    ? Math.floor((new Date(deal.expected_close_date).getTime() - now) / MS_PER_DAY)
    : null;
  const stageWeight = STAGE_WEIGHTS[deal.stage.toLowerCase()] ?? 1.0;
  const base = deal.probability != null ? deal.probability : stageWeight * 50;
  const staleFactor = Math.max(0, 1 - daysSinceUpdated / 30);
  let urgencyFactor = 1.0;
  if (daysUntilClose !== null) {
    if (daysUntilClose < 0) urgencyFactor = 0.5;
    else if (daysUntilClose === 0) urgencyFactor = 1.5;
    else if (daysUntilClose <= 7) urgencyFactor = 1.3;
    else if (daysUntilClose <= 14) urgencyFactor = 1.15;
  }
  const score = Math.max(0, Math.min(100, Math.round(base * staleFactor * urgencyFactor)));
  if (score >= 70) return { key: "healthy", labelKey: "healthStatusHealthy" };
  if (score >= 40) return { key: "warning", labelKey: "healthStatusWarning" };
  return { key: "at-risk", labelKey: "healthStatusAtRisk" };
}

type Props = {
  deal: Deal;
  onEdit: () => void;
  allTags: WorkspaceTag[];
  entityTags: WorkspaceTag[];
};

export default function DealHeader({ deal, onEdit, allTags, entityTags }: Props) {
  const t = useTranslations("deals");
  const tc = useTranslations("common");
  const router = useRouter();

  const [currentStage, setCurrentStage] = useState<DealStage>(deal.stage as DealStage);
  const [isPending, startTransition] = useTransition();

  const [now] = useState(() => Date.now());
  const daysOpen = Math.max(0, Math.floor((now - new Date(deal.created_at).getTime()) / 86_400_000));
  const value = Number(deal.value ?? 0);
  const probability = deal.probability ?? 0;
  const expectedRevenue = Math.round(value * probability / 100);

  const health = computeHealth(deal);

  function handleStageChange(stage: DealStage) {
    if (stage === currentStage) return;
    startTransition(async () => {
      const ok = await updateDealStage(deal.id, stage);
      if (ok) {
        setCurrentStage(stage);
        toast.success(t("stageUpdated"));
        router.refresh();
      } else {
        toast.error(t("failedToUpdateStage"));
      }
    });
  }

  return (
    <>
      {/* Back */}
      <Link
        href="/dashboard/deals"
        className="inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
      >
        <ArrowLeft size={12} />
        {t("backToPipeline")}
      </Link>

      {/* Compact identity strip */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#080C14] px-5 py-4 sm:flex-row sm:items-start sm:justify-between">

        {/* Left — icon + info */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
            <TrendingUp size={20} className="text-violet-300" />
          </div>

          {/* Info block */}
          <div className="min-w-0 space-y-1.5">
            {/* Title + health */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold leading-tight text-white">{deal.title}</h1>
              <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", HEALTH_STYLES[health.key])}>
                {t(health.labelKey)}
              </span>
            </div>

            {/* Company · Contact */}
            <div className="flex flex-wrap items-center gap-2">
              {deal.company?.id && (
                <Link
                  href={`/dashboard/companies/${deal.company.id}`}
                  className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-violet-300"
                >
                  <Building2 size={11} />
                  {deal.company.name}
                </Link>
              )}
              {deal.company && deal.contact && <span className="text-zinc-700">·</span>}
              {deal.contact?.id && (
                <Link
                  href={`/dashboard/contacts/${deal.contact.id}`}
                  className="flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-violet-300"
                >
                  <User size={11} />
                  {deal.contact.name}
                </Link>
              )}
              {deal.owner?.full_name && (
                <>
                  {(deal.company || deal.contact) && <span className="text-zinc-700">·</span>}
                  <span className="text-xs text-zinc-600">{deal.owner.full_name}</span>
                </>
              )}
            </div>

            {/* Tags */}
            <TagPicker
              entityType="deal"
              entityId={deal.id}
              allTags={allTags}
              initialTags={entityTags}
            />

            {/* Inline metrics */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
              <div className="flex items-center gap-1.5 text-xs">
                <TrendingUp size={11} className="text-zinc-600" />
                <span className="font-medium tabular-nums text-white/70">{formatCurrency(value, deal.currency)}</span>
                <span className="text-zinc-600">{t("value")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Target size={11} className="text-zinc-600" />
                <span className="font-medium tabular-nums text-white/70">{probability}%</span>
                <span className="text-zinc-600">{t("probability")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Activity size={11} className="text-zinc-600" />
                <span className="font-medium tabular-nums text-white/70">{formatCurrency(expectedRevenue, deal.currency)}</span>
                <span className="text-zinc-600">{t("expectedRevenue")}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <Calendar size={11} className="text-zinc-600" />
                <span className="font-medium tabular-nums text-white/70">{daysOpen}</span>
                <span className="text-zinc-600">{t("daysOpen")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — stage picker + edit */}
        <div className="flex shrink-0 items-center gap-2 sm:pt-0.5">
          {/* Stage dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                disabled={isPending}
                aria-label={t("changeStageLabel")}
                className={cn(
                  "group flex h-8 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-all outline-none",
                  "focus-visible:ring-2 focus-visible:ring-[#6D5BFF]/50",
                  STAGE_BADGE[currentStage] ?? STAGE_BADGE.lead,
                  isPending && "cursor-not-allowed opacity-50",
                )}
              >
                {t(currentStage)}
                <ChevronDown
                  size={11}
                  className="transition-transform group-data-[state=open]:rotate-180"
                />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={6}
                className="z-50 min-w-[160px] overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F1F]/95 p-1.5 shadow-xl backdrop-blur-2xl"
              >
                {STAGES.map((stage) => (
                  <DropdownMenu.Item
                    key={stage}
                    onSelect={() => handleStageChange(stage)}
                    className={cn(
                      "flex w-full cursor-default select-none items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs outline-none transition-all",
                      stage === currentStage
                        ? "bg-white/[0.06] text-white"
                        : "text-white/50 data-[highlighted]:bg-white/[0.04] data-[highlighted]:text-white/80",
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STAGE_DOT[stage])} />
                    {t(stage)}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <GunimiButton
            variant="secondary"
            className="h-8 gap-1.5 px-3 text-xs"
            onClick={onEdit}
          >
            <Pencil size={12} />
            {tc("edit")}
          </GunimiButton>
        </div>
      </div>
    </>
  );
}
