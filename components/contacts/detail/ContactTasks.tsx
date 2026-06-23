"use client";

import { CheckSquare2, Clock, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import OrbitSection from "@/components/layout/OrbitSection";
import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitCard from "@/components/ui/OrbitCard";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";
import { ContactTask } from "@/server/actions/crm/getContactTasks";

type Props = {
  tasks: ContactTask[];
};

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

function getPriorityIcon(priority?: string | null) {
  if (priority === "high") return <AlertCircle size={12} className="text-rose-400" />;
  return null;
}

export default function ContactTasks({ tasks }: Props) {
  const t = useTranslations("contacts");
  const tTasks = useTranslations("tasks");

  return (
    <OrbitSection>
      <OrbitHeading
        badge={t("tasksBadge")}
        title={t("tasks")}
        subtitle={t("tasksSubtitle")}
      />

      {tasks.length === 0 ? (
        <OrbitEmptyState
          title={t("noTasks")}
          description={t("noTasksDescription")}
          icon={CheckSquare2}
        />
      ) : (
        <div className="mt-6 space-y-3">
          {tasks.map((task) => {
            const isOverdue =
              task.status !== "done" &&
              task.due_date &&
              new Date(task.due_date) < new Date();

            return (
              <OrbitCard key={task.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-2.5">
                    {getPriorityIcon(task.priority)}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{task.title}</p>
                      {task.description && (
                        <p className="mt-1 truncate text-xs text-white/50">
                          {task.description}
                        </p>
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
