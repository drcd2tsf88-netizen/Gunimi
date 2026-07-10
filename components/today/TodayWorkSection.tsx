"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Check, CheckSquare2 } from "lucide-react";
import toast from "react-hot-toast";
import GunimiCard from "@/components/ui/GunimiCard";
import { updateTask } from "@/server/actions/tasks/updateTask";
import type { TodayWorkItem } from "@/lib/today/types";

type Props = {
  items: TodayWorkItem[];
};

export default function TodayWorkSection({ items }: Props) {
  const t = useTranslations("today");
  const router = useRouter();
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  function handleComplete(taskId: string) {
    setCompletedIds((prev) => new Set([...prev, taskId]));
    startTransition(async () => {
      const ok = await updateTask({ id: taskId, status: "done" });
      if (!ok) {
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
        toast.error(t("workMarkDoneFailed"));
        return;
      }
      toast.success(t("workMarkDoneSuccess"));
      router.refresh();
    });
  }

  const visible = items.filter((item) => !completedIds.has(item.id));

  return (
    <GunimiCard className="p-5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {t("workSectionLabel")}
      </p>

      {visible.length === 0 ? (
        <div className="mt-4 flex items-center gap-2.5">
          <CheckSquare2 size={14} className="text-emerald-400/60" aria-hidden />
          <p className="text-sm text-white/40">{t("workEmpty")}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-1">
          {visible.map((item) => {
            const isOverdue = item.tag === "overdue";
            return (
              <div
                key={item.id}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
              >
                <span
                  className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide ${
                    isOverdue
                      ? "border-red-500/20 bg-red-500/10 text-red-300"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {isOverdue ? t("workTagOverdue") : t("workTagToday")}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-white/70 transition-colors group-hover:text-white/90">
                  {item.title}
                </span>
                <button
                  onClick={() => handleComplete(item.id)}
                  aria-label={t("workMarkDone")}
                  title={t("workMarkDone")}
                  className="shrink-0 rounded-full p-1 text-white/20 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                >
                  <Check size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </GunimiCard>
  );
}
