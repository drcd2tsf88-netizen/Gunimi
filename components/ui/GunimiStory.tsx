"use client";

import { Flag, Users, Mail, Phone, ArrowRight, MoreHorizontal, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import GunimiCard from "@/components/ui/GunimiCard";
import type { StoryIconKey } from "@/lib/deals/story";

export type RenderedStoryEvent = {
  id: string;
  iconKey: StoryIconKey;
  badge: string;
  title: string;
  detail?: string;
  who?: string;
  date: string;
};

type Props = {
  label: string;
  events: RenderedStoryEvent[];
  earlyNoteTitle?: string;
  earlyNoteDescription?: string;
};

const ICONS: Record<StoryIconKey, LucideIcon> = {
  begin: Flag,
  meeting: Users,
  email: Mail,
  call: Phone,
  stage: ArrowRight,
  group: MoreHorizontal,
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function GunimiStory({ label, events, earlyNoteTitle, earlyNoteDescription }: Props) {
  return (
    <GunimiCard className="p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>

      <ol className="mt-4 list-none" aria-label={label}>
        {events.map((event, i) => {
          const isLast = i === events.length - 1;
          const isBegin = event.iconKey === "begin";
          const isGroup = event.iconKey === "group";
          const Icon = ICONS[event.iconKey];

          return (
            <li key={event.id} className="flex gap-3">
              {/* Left column — decorative only */}
              <div className="flex flex-col items-center" aria-hidden="true">
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                    isBegin
                      ? "border-violet-500/20 bg-violet-500/10"
                      : "border-white/[0.06] bg-[#0A0E17]",
                  )}
                >
                  <Icon
                    size={12}
                    className={isBegin ? "text-violet-400" : "text-white/25"}
                  />
                </div>
                {!isLast && (
                  <div className="mt-1.5 w-px flex-1 bg-white/[0.05]" />
                )}
              </div>

              {/* Right column — event content */}
              <div className={cn("min-w-0 flex-1 pt-0.5", !isLast && "pb-5")}>
                <p
                  className={cn(
                    "text-[10px] uppercase tracking-[0.14em]",
                    isGroup ? "text-white/20" : "text-zinc-500",
                  )}
                >
                  {event.badge}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-sm font-medium",
                    isGroup ? "text-white/40" : "text-white/80",
                  )}
                >
                  {event.title}
                </p>
                {event.detail && (
                  <p className="mt-0.5 text-xs text-white/40">{event.detail}</p>
                )}
                <p className="mt-1 text-xs text-white/30">
                  {event.who && `${event.who} · `}
                  {formatDate(event.date)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {earlyNoteTitle && (
        <div className="mt-4 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-3 text-center">
          <p className="text-xs text-white/35">{earlyNoteTitle}</p>
          {earlyNoteDescription && (
            <p className="mt-1 text-xs text-white/20">{earlyNoteDescription}</p>
          )}
        </div>
      )}
    </GunimiCard>
  );
}
