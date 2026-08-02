"use client";

import Link from "next/link";
import { AlertCircle, CalendarCheck, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTaskFocusStore } from "@/lib/store/task-focus-store";

export default function TaskFocusStrip() {
  const t = useTranslations("taskFocus");
  const { today, overdue, loaded, dismissed, dismiss } = useTaskFocusStore();

  if (!loaded || dismissed) return null;
  if (today === 0 && overdue === 0) return null;

  const hasOverdue = overdue > 0;
  const hasToday = today > 0;

  return (
    <div
      className={`relative flex items-center gap-3 border-b px-5 py-2 text-xs transition-all lg:px-8 ${
        hasOverdue
          ? "border-rose-500/15 bg-rose-500/[0.04]"
          : "border-amber-500/15 bg-amber-500/[0.04]"
      }`}
    >
      {/* Left icon */}
      {hasOverdue ? (
        <AlertCircle size={12} className="shrink-0 text-rose-400/70" />
      ) : (
        <CalendarCheck size={12} className="shrink-0 text-amber-400/70" />
      )}

      {/* Message */}
      <p className={`flex-1 ${hasOverdue ? "text-rose-300/70" : "text-amber-300/70"}`}>
        {hasOverdue && hasToday
          ? t("bothMessage", { today, overdue })
          : hasOverdue
          ? t("overdueMessage", { overdue })
          : t("todayMessage", { today })}
      </p>

      {/* Link */}
      <Link
        href="/dashboard/tasks"
        className={`flex shrink-0 items-center gap-0.5 font-medium transition-opacity hover:opacity-80 ${
          hasOverdue ? "text-rose-400/80" : "text-amber-400/80"
        }`}
      >
        {t("viewTasks")}
        <ChevronRight size={10} />
      </Link>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-white/20 transition-colors hover:text-white/50"
        aria-label={t("dismiss")}
      >
        <X size={10} />
      </button>
    </div>
  );
}
