"use client";

import Link from "next/link";
import { AlertCircle, CheckSquare2, Clock, User } from "lucide-react";
import { useTranslations } from "next-intl";

import OrbitSection from "@/components/layout/OrbitSection";
import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";

import type { DealRelatedTask } from "@/server/actions/deals/getDealRelatedTasks";

type Props = {
  tasks: DealRelatedTask[];
  contactId?: string | null;
};

const NOW = new Date();

function getStatusStyles(status: string) {
  switch (status) {
    case "done":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "in_progress":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    case "blocked":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/[0.03] text-zinc-300";
  }
}

export default function DealTasks({ tasks, contactId }: Props) {
  const t = useTranslations("deals");
  const tTasks = useTranslations("tasks");

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t("relatedTasksBadge")}
        title={t("relatedTasks")}
        subtitle={t("relatedTasksSubtitle")}
      />

      {tasks.length === 0 ? (
        <OrbitEmptyState
          title={t("noRelatedTasks")}
          description={t("noRelatedTasksDescription")}
          icon={CheckSquare2}
          action={
            contactId ? (
              <Link
                href={`/dashboard/crm/${contactId}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/[0.14] hover:text-white/75"
              >
                <User size={11} />
                {t("goToContact")}
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="mt-6 space-y-3">
          {tasks.map((task) => {
            const isOverdue =
              task.status !== "done" &&
              task.due_date &&
              new Date(task.due_date) < NOW;

            return (
              <OrbitCard key={task.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-2.5">
                    {task.priority === "high" && (
                      <AlertCircle size={12} className="mt-0.5 shrink-0 text-rose-400" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white/85">{task.title}</p>
                      {task.description && (
                        <p className="mt-1 truncate text-xs text-white/45">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {task.due_date && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] ${
                          isOverdue
                            ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                            : "border-white/10 bg-white/[0.03] text-zinc-400"
                        }`}
                      >
                        <Clock size={10} />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wide ${getStatusStyles(task.status)}`}
                    >
                      {tTasks(
                        task.status === "done"
                          ? "statusDone"
                          : task.status === "in_progress"
                          ? "statusInProgress"
                          : "statusTodo"
                      )}
                    </span>
                  </div>
                </div>
              </OrbitCard>
            );
          })}
        </div>
      )}
    </OrbitSection>
  );
}
