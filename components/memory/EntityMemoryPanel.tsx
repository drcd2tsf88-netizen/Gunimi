"use client";

import { useTranslations } from "next-intl";
import {
  Activity,
  Building2,
  CalendarDays,
  CheckSquare,
  FileText,
  Mail,
  Sparkles,
  TrendingUp,
  Upload,
  User,
  Users,
  Zap,
} from "lucide-react";

import GunimiCard from "@/components/ui/GunimiCard";
import { isMilestone, getImportance } from "@/lib/memory/importance";
import type { MemoryImportance } from "@/lib/memory/types";
import type { WorkspaceActivity } from "@/types/activity";

type Props = {
  activities: WorkspaceActivity[];
};

const IMPORTANCE_DOT: Record<MemoryImportance, string> = {
  critical: "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.5)]",
  high: "bg-violet-400",
  normal: "bg-zinc-500",
  low: "bg-zinc-700",
};

const IMPORTANCE_BADGE: Record<MemoryImportance, string> = {
  critical: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  high: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  normal: "border-white/[0.06] bg-white/[0.03] text-zinc-400",
  low: "border-white/[0.04] bg-white/[0.02] text-zinc-600",
};

const IMPORTANCE_LABEL_KEY: Record<MemoryImportance, string> = {
  critical: "importanceCritical",
  high: "importanceHigh",
  normal: "importanceNormal",
  low: "importanceLow",
};

function ActivityIcon({
  type,
  size,
  className,
}: {
  type: string;
  size: number;
  className: string;
}) {
  const props = { size, className };
  if (type.startsWith("deal")) return <TrendingUp {...props} />;
  if (type.startsWith("company")) return <Building2 {...props} />;
  if (type.startsWith("contact")) return <User {...props} />;
  if (type.startsWith("note")) return <FileText {...props} />;
  if (type.startsWith("task")) return <CheckSquare {...props} />;
  if (type === "automation_execution") return <Zap {...props} />;
  if (type === "ai") return <Sparkles {...props} />;
  if (type.startsWith("email")) return <Mail {...props} />;
  if (type.startsWith("calendar")) return <CalendarDays {...props} />;
  if (type.includes("import")) return <Upload {...props} />;
  if (
    type.startsWith("member") ||
    type.startsWith("workspace") ||
    type === "invite_sent"
  )
    return <Users {...props} />;
  return <Activity {...props} />;
}

export default function EntityMemoryPanel({ activities }: Props) {
  const t = useTranslations("memory");

  const milestones = activities.filter((a) => isMilestone(a.type ?? ""));

  if (milestones.length === 0) return null;

  return (
    <GunimiCard className="flex flex-col">
      <div className="border-b border-white/[0.06] px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
          {t("entityBadge")}
        </p>
        <p className="mt-0.5 text-sm font-semibold">{t("entityTitle")}</p>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {milestones.slice(0, 5).map((item) => {
          const type = item.type ?? "";
          const importance = getImportance(type);
          return (
            <div key={item.id} className="flex items-start gap-3 px-5 py-3">
              <div className="flex flex-col items-center pt-1.5">
                <div
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${IMPORTANCE_DOT[importance]}`}
                />
              </div>

              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                <ActivityIcon type={type} size={11} className="text-zinc-500" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium leading-snug text-white/80">
                    {item.title}
                  </p>
                  <span
                    className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${IMPORTANCE_BADGE[importance]}`}
                  >
                    {t(IMPORTANCE_LABEL_KEY[importance])}
                  </span>
                </div>

                <p className="mt-0.5 text-[10px] text-white/25">
                  {new Date(item.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </GunimiCard>
  );
}
