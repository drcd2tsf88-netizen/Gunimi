"use client";

import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";

export type ContextEntry = {
  id: string;
  label?: string;
  primary: string;
  secondary?: string;
  href?: string;
  meta?: string;
};

type Props = {
  title: string;
  icon: LucideIcon;
  entries: ContextEntry[];
  action?: { label: string; onClick: () => void };
};

export default function GunimiContextCard({ title, icon: Icon, entries, action }: Props) {
  return (
    <GunimiCard className="p-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon size={12} className="text-white/30" aria-hidden />
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium">
              {title}
            </span>
          </div>
          {action && (
            <button
              onClick={action.onClick}
              aria-label={action.label}
              className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] text-zinc-500 hover:bg-white/[0.05] hover:text-white/60 transition-colors"
            >
              <Plus size={10} aria-hidden />
              {action.label}
            </button>
          )}
        </div>

        <div className="divide-y divide-white/[0.04]">
          {entries.map((entry) => {
            const rowContent = (
              <div className="flex items-start justify-between gap-3 py-2.5">
                <div className="flex-1 min-w-0 space-y-0.5">
                  {entry.label && (
                    <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-medium">
                      {entry.label}
                    </div>
                  )}
                  <div className="text-sm font-medium text-white/80 truncate">
                    {entry.primary}
                  </div>
                  {entry.secondary && (
                    <div className="text-xs text-white/40 truncate">{entry.secondary}</div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pt-1">
                  {entry.meta && (
                    <span className="text-[11px] text-white/30 tabular-nums">{entry.meta}</span>
                  )}
                  {entry.href && (
                    <ChevronRight size={12} className="text-white/20" aria-hidden />
                  )}
                </div>
              </div>
            );

            return entry.href ? (
              <Link
                key={entry.id}
                href={entry.href}
                className="block rounded-md hover:bg-white/[0.03] transition-colors duration-150"
              >
                {rowContent}
              </Link>
            ) : (
              <div key={entry.id}>{rowContent}</div>
            );
          })}
        </div>
      </div>
    </GunimiCard>
  );
}
