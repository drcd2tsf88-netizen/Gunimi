"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import GunimiCard from "@/components/ui/GunimiCard";

type Props = {
  /** Badge label above the action — already translated. */
  label: string;
  /** The recommended action text — already translated. */
  action: string;
  /** Optional supporting reason — already translated. */
  reason?: string;
  /** When true, renders the calm no-action state using `action` as the message. */
  isEmpty?: boolean;
};

export default function GunimiDecisionCard({ label, action, reason, isEmpty = false }: Props) {
  return (
    <GunimiCard className="p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>

      <div className="mt-4 flex items-start gap-3">
        {isEmpty ? (
          <CheckCircle2
            size={14}
            className="mt-0.5 shrink-0 text-emerald-400"
            aria-hidden
          />
        ) : (
          <ArrowRight
            size={14}
            className="mt-0.5 shrink-0 text-[#6D5BFF]"
            aria-hidden
          />
        )}

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
}
