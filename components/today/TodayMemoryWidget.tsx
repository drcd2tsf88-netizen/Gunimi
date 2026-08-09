"use client";

import Link from "next/link";
import { Brain } from "lucide-react";
import { useTranslations } from "next-intl";
import GunimiCard from "@/components/ui/GunimiCard";
import type { MemoryEvent } from "@/lib/memory/types";

type Props = {
  events: MemoryEvent[];
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

const IMPORTANCE_DOT: Record<string, string> = {
  critical: "bg-red-400",
  high:     "bg-amber-400",
  normal:   "bg-violet-400",
  low:      "bg-zinc-600",
};

export default function TodayMemoryWidget({ events }: Props) {
  const t = useTranslations("today");

  return (
    <Link href="/dashboard/memory" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060A] rounded-[18px]">
      <GunimiCard hoverable className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <Brain size={13} className="text-violet-400" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t("memoryTitle")}
            </p>
          </div>
          <span className="text-[10px] text-zinc-600">
            {t("memoryViewTimeline")} →
          </span>
        </div>

        {events.length === 0 ? (
          <p className="text-xs text-white/30">{t("memoryEmpty")}</p>
        ) : (
          <div className="space-y-2">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-start gap-2.5">
                <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${IMPORTANCE_DOT[ev.importance] ?? "bg-zinc-600"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-white/60">{ev.title}</p>
                </div>
                <span className="shrink-0 text-[10px] text-zinc-600">{relativeTime(ev.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </GunimiCard>
    </Link>
  );
}
