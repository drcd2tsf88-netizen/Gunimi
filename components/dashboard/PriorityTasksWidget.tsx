"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { CheckSquare2, AlertCircle, Clock, Flame } from "lucide-react";
import OrbitCard from "@/components/ui/OrbitCard";

export type DashboardTask = {
  id: string;
  title: string;
  status: string | null;
  priority: string | null;
  due_date: string | null;
};

type Props = {
  tasks: DashboardTask[];
};

type TaggedTask = DashboardTask & { tag: "overdue" | "today" | "high" };

export default function PriorityTasksWidget({ tasks }: Props) {
  const t = useTranslations("dashboard");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const tagged: TaggedTask[] = [];
  const seen = new Set<string>();

  for (const task of tasks) {
    if (task.status === "done") continue;

    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const dueDateStr = task.due_date?.split("T")[0];

    if (dueDate && dueDate < today && !seen.has(task.id)) {
      tagged.push({ ...task, tag: "overdue" });
      seen.add(task.id);
    } else if (dueDateStr === todayStr && !seen.has(task.id)) {
      tagged.push({ ...task, tag: "today" });
      seen.add(task.id);
    }
  }

  for (const task of tasks) {
    if (task.status === "done") continue;
    if (task.priority === "high" && !seen.has(task.id)) {
      tagged.push({ ...task, tag: "high" });
      seen.add(task.id);
    }
  }

  const visible = tagged.slice(0, 6);

  const TAG_STYLE = {
    overdue: "border-red-500/20 bg-red-500/10 text-red-300",
    today: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    high: "border-orange-500/20 bg-orange-500/10 text-orange-300",
  };

  const TAG_ICON = {
    overdue: AlertCircle,
    today: Clock,
    high: Flame,
  };

  const TAG_LABEL = {
    overdue: t("overdueBadge"),
    today: t("dueTodayBadge"),
    high: t("highPriorityBadge"),
  };

  return (
    <OrbitCard className="flex flex-col p-5">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t("priorityTasks")}
          </p>
          <p className="mt-0.5 text-xs text-white/30">{t("priorityTasksSubtitle")}</p>
        </div>
        <Link
          href="/dashboard/tasks"
          className="text-[10px] uppercase tracking-[0.14em] text-violet-400/70 transition-colors hover:text-violet-300"
        >
          {t("viewAll")}
        </Link>
      </div>

      <div className="mt-4 flex-1 space-y-2">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckSquare2 className="h-6 w-6 text-emerald-400/60" />
            <p className="mt-3 text-sm font-medium text-white/60">{t("noPriorityTasks")}</p>
            <p className="mt-1 text-xs text-white/30">{t("noPriorityTasksDescription")}</p>
          </div>
        ) : (
          visible.map((task) => {
            const Icon = TAG_ICON[task.tag];
            return (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5"
              >
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wide font-medium ${TAG_STYLE[task.tag]}`}
                >
                  <Icon size={9} />
                  {TAG_LABEL[task.tag]}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-white/80">{task.title}</p>
              </div>
            );
          })
        )}
      </div>
    </OrbitCard>
  );
}
