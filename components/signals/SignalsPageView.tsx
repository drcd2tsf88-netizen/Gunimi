"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Radio, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { dismissSignal } from "@/server/actions/signals/dismissSignal";
import { runWorkspaceScan } from "@/server/actions/signals/runWorkspaceScan";
import type { EnrichedSignal } from "@/server/actions/signals/getWorkspaceSignals";
import type { DismissalType } from "@/lib/signals/types";

type Props = {
  initialSignals: EnrichedSignal[];
};

const SEVERITY_BORDER: Record<string, string> = {
  critical: "border-l-red-400",
  warning:  "border-l-amber-400",
  info:     "border-l-blue-400",
};

const SEVERITY_BADGE: Record<string, string> = {
  critical: "border-red-500/20 bg-red-500/10 text-red-300",
  warning:  "border-amber-500/20 bg-amber-500/10 text-amber-300",
  info:     "border-blue-500/20 bg-blue-500/10 text-blue-300",
};

const ENTITY_CATEGORY_KEY: Record<string, string> = {
  deal:    "categoryDeal",
  contact: "categoryContact",
  company: "categoryCompany",
  task:    "categoryTask",
};

const CATEGORY_ORDER = ["deal", "contact", "company", "task"];

function getRelativeDays(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

export default function SignalsPageView({ initialSignals }: Props) {
  const t = useTranslations("signalsPage");
  const [signals, setSignals] = useState<EnrichedSignal[]>(initialSignals);
  const [isDismissing, startDismiss] = useTransition();
  const [isScanning, startScan] = useTransition();

  function handleDismiss(signalId: string, type: DismissalType) {
    startDismiss(async () => {
      const { success } = await dismissSignal(signalId, type);
      if (success) {
        setSignals((prev) => prev.filter((s) => s.id !== signalId));
        toast.success(t("dismissed"));
      }
    });
  }

  function handleScanNow() {
    startScan(async () => {
      const scanTypes = ["relationship_stale", "deal_stale", "company_stale", "long_running_tasks", "missing_follow_up"] as const;
      await Promise.all(scanTypes.map((st) => runWorkspaceScan(st)));
      toast.success(t("scanComplete"));
      // Reload page to get fresh signals
      window.location.reload();
    });
  }

  const grouped = CATEGORY_ORDER.reduce<Record<string, EnrichedSignal[]>>((acc, cat) => {
    const items = signals.filter((s) => s.entityType === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const signalTypeLabel = (type: string): string => {
    try {
      return t(`types.${type}` as Parameters<typeof t>[0]);
    } catch {
      return type.replace(/_/g, " ");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <GunimiSection>
        <div className="flex items-start justify-between gap-4">
          <GunimiHeading
            badge={t("badge")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div className="flex shrink-0 items-center gap-2">
            {signals.length > 0 && (
              <span className="flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-300">
                <Radio size={11} />
                {t("totalActive", { count: signals.length })}
              </span>
            )}
            <GunimiButton
              variant="secondary"
              onClick={handleScanNow}
              loading={isScanning}
            >
              <RefreshCw size={14} />
              {isScanning ? t("scanning") : t("scanNow")}
            </GunimiButton>
          </div>
        </div>
      </GunimiSection>

      {/* Empty state */}
      {signals.length === 0 && (
        <GunimiSection>
          <GunimiEmptyState
            icon={Radio}
            title={t("noSignals")}
            description={t("noSignalsDescription")}
          />
        </GunimiSection>
      )}

      {/* Signal groups */}
      {Object.entries(grouped).map(([category, items]) => (
        <GunimiSection key={category}>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t(ENTITY_CATEGORY_KEY[category] as Parameters<typeof t>[0])}
            </span>
            <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-600">
              {items.length}
            </span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080C14]">
            {items.map((signal) => {
              const days = getRelativeDays(signal.producedAt);
              return (
                <div
                  key={signal.id}
                  className={`flex items-center gap-4 border-b border-b-white/[0.04] border-l-2 px-4 py-3.5 transition-colors hover:bg-white/[0.025] last:border-b-0 ${SEVERITY_BORDER[signal.severity] ?? "border-l-zinc-600"}`}
                >

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">
                        {signalTypeLabel(signal.type)}
                      </p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${SEVERITY_BADGE[signal.severity] ?? ""}`}>
                        {t(("severity" + signal.severity.charAt(0).toUpperCase() + signal.severity.slice(1)) as Parameters<typeof t>[0])}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                      {signal.entityName}
                      {days > 0 && (
                        <span className="ml-2 text-zinc-600">
                          · {t("detected")} {days}d {days === 1 ? "ago" : "ago"}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={signal.entityHref}
                      className="flex h-7 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-xs text-zinc-400 transition-all hover:border-violet-500/30 hover:text-violet-300"
                    >
                      <ArrowRight size={11} />
                    </Link>

                    <div className="hidden sm:block">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            disabled={isDismissing}
                            className="group flex h-7 items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 text-xs text-zinc-400 transition-all hover:border-violet-500/30 hover:text-violet-300 disabled:opacity-40 data-[state=open]:border-violet-500/30 data-[state=open]:text-violet-300"
                          >
                            {t("dismiss")}
                            <ChevronDown size={10} className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={6}>
                          {(["not_urgent", "remind_later", "not_relevant"] as DismissalType[]).map((type) => (
                            <DropdownMenuItem
                              key={type}
                              onSelect={() => handleDismiss(signal.id, type)}
                            >
                              {t(`dismiss${type.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("")}` as Parameters<typeof t>[0])}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GunimiSection>
      ))}
    </div>
  );
}
