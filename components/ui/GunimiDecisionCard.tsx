"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";

type Props = {
  label: string;
  action: string;
  reason?: string;
  isEmpty?: boolean;
  /** Optional navigation target — makes the whole card a link. */
  href?: string;
  /** Optional click handler — takes precedence over href. */
  onClick?: () => void;
};

export default function GunimiDecisionCard({ label, action, reason, isEmpty = false, href, onClick }: Props) {
  const isInteractive = !isEmpty && (href || onClick);
  const inner = (
    <GunimiCard className={`p-5 ${isInteractive ? "cursor-pointer transition-colors hover:border-violet-500/30 hover:bg-violet-500/[0.04]" : ""}`}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>

      <div className="mt-4 flex items-start gap-3">
        {isEmpty ? (
          <CheckCircle2
            size={14}
            className="mt-0.5 shrink-0 text-emerald-400"
            aria-hidden
          />
        ) : isInteractive ? (
          <ArrowRight
            size={14}
            className="mt-0.5 shrink-0 text-violet-400"
            aria-hidden
          />
        ) : null}

        <div className="min-w-0">
          <p
            className={
              isEmpty
                ? "text-sm font-medium text-white/60"
                : "text-sm font-semibold text-white"
            }
          >
            {action}
          </p>

          {reason && (
            <p className="mt-1 text-xs leading-relaxed text-white/45">{reason}</p>
          )}
        </div>
      </div>
    </GunimiCard>
  );

  if (!isEmpty && onClick) {
    return <button className="w-full text-left" onClick={onClick}>{inner}</button>;
  }

  if (!isEmpty && href) {
    return <Link href={href}>{inner}</Link>;
  }

  return inner;
}
