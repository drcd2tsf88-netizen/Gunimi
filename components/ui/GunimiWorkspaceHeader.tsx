"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type WorkspaceHealthLevel = "healthy" | "warning" | "at-risk";

export type WorkspaceHealth = {
  level: WorkspaceHealthLevel;
  label: string;
};

type Props = {
  /** Entity type label — e.g. "Deal", "Contact", "Company". Already translated by caller. */
  type: string;
  /** Entity title shown as the primary h1. */
  title: string;
  /** Optional sub-context rendered between badges and title — e.g. a company context link. */
  context?: React.ReactNode;
  /** Owner full name. Rendered as a subtle badge. */
  owner?: string;
  /** Health signal shown in the header badge row. */
  health?: WorkspaceHealth;
  /** Back navigation href. */
  backHref: string;
  /** Back navigation label. Already translated by caller. */
  backLabel: string;
  /** Primary action slot — stage picker, edit button, value display, etc. */
  actions?: React.ReactNode;
};

const HEALTH_STYLES: Record<WorkspaceHealthLevel, string> = {
  healthy: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  "at-risk": "border-red-500/20 bg-red-500/10 text-red-300",
};

export default function GunimiWorkspaceHeader({
  type,
  title,
  context,
  owner,
  health,
  backHref,
  backLabel,
  actions,
}: Props) {
  return (
    <div className="space-y-3">
      {/* BACK NAV */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-white/35 transition-colors hover:text-white/70"
      >
        <ArrowLeft size={13} />
        {backLabel}
      </Link>

      {/* IDENTITY ROW */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1 space-y-2">
          {/* BADGE ROW: type — health — owner */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
              {type}
            </span>

            {health && (
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[10px] font-medium",
                  HEALTH_STYLES[health.level],
                )}
              >
                {health.label}
              </span>
            )}

            {owner && (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[10px] text-white/40">
                {owner}
              </span>
            )}
          </div>

          {/* CONTEXT SLOT (e.g. company link for deals) */}
          {context}

          {/* ENTITY TITLE */}
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white">
            {title}
          </h1>
        </div>

        {/* PRIMARY ACTIONS SLOT */}
        {actions && (
          <div className="flex shrink-0 items-center gap-3 pt-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
