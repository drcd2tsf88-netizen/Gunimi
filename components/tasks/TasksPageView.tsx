"use client";

import { useState, useCallback } from "react";

import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitButton from "@/components/ui/OrbitButton";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import CreateTaskSheet from "@/components/tasks/CreateTaskSheet";

import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import { updateTask } from "@/server/actions/tasks/updateTask";
import { deleteTask } from "@/server/actions/tasks/deleteTask";

import { Task } from "@/types/task";

type Props = {
  initialTasks: Task[];
};

const NEXT_STATUS: Record<string, string> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

function statusBadge(status: string) {
  if (status === "in_progress")
    return "text-violet-300 border-violet-500/20 bg-violet-500/10";
  if (status === "done")
    return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
  return "text-zinc-400 border-zinc-400/20 bg-zinc-400/10";
}

function priorityBadge(priority: string) {
  if (priority === "high")
    return "text-red-300 border-red-500/20 bg-red-500/10";
  if (priority === "medium")
    return "text-amber-300 border-amber-500/20 bg-amber-500/10";
  return "text-zinc-500 border-zinc-500/20 bg-zinc-500/10";
}

function formatDueDate(date?: string | null): string {
  if (!date) return "–";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusLabel(
  status: string,
  t: (key: string) => string
): string {
  if (status === "in_progress") return t("statusInProgress");
  if (status === "done") return t("statusDone");
  return t("statusTodo");
}

function priorityLabel(
  priority: string,
  t: (key: string) => string
): string {
  if (priority === "high") return t("priorityHigh");
  if (priority === "medium") return t("priorityMedium");
  return t("priorityLow");
}

export default function TasksPageView({ initialTasks }: Props) {
  const t = useTranslations("tasks");
  const tc = useTranslations("common");

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const fresh = await getWorkspaceTasks();
    setTasks(fresh as Task[]);
  }, []);

  function handleCreate() {
    setEditTask(null);
    setSheetOpen(true);
  }

  function handleEdit(task: Task) {
    setEditTask(task);
    setSheetOpen(true);
  }

  async function handleCycleStatus(task: Task) {
    if (toggling === task.id) return;

    const next = NEXT_STATUS[task.status] ?? "todo";

    setToggling(task.id);
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: next } : t))
    );

    const ok = await updateTask({ id: task.id, status: next });

    setToggling(null);

    if (!ok) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: task.status } : t
        )
      );
      toast.error(t("failedToUpdate"));
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    const ok = await deleteTask(deleteTarget.id);
    setDeleteLoading(false);

    if (ok) {
      toast.success(t("taskDeleted"));
      setDeleteTarget(null);
      await reload();
    } else {
      toast.error(t("failedToDelete"));
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <OrbitHeading
          badge={t("workspace")}
          title={t("tasks")}
          subtitle={t("tasksSubtitle")}
        />

        <OrbitButton
          onClick={handleCreate}
          className="mt-1 shrink-0"
        >
          <Plus size={14} />
          {t("newTask")}
        </OrbitButton>
      </div>

      {/* TASK COUNT */}
      {tasks.length > 0 && (
        <p className="mt-1 text-xs text-zinc-500">
          {tasks.length}{" "}
          {tasks.length === 1 ? t("tasks").slice(0, -1) : t("tasks").toLowerCase()}
        </p>
      )}

      {/* CONTENT */}
      <section className="mt-6 space-y-6">
        {tasks.length === 0 ? (
          <OrbitEmptyState
            icon={CheckSquare}
            title={t("noTasks")}
            description={t("noTasksDescription")}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
            <table className="w-full text-sm">
              {/* HEAD */}
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    {t("taskTitle")}
                  </th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    {t("taskStatus")}
                  </th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    {t("taskPriority")}
                  </th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    {t("dueDate")}
                  </th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    {t("owner")}
                  </th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-white/[0.04]">
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="group transition-colors hover:bg-white/[0.02]"
                  >
                    {/* TITLE */}
                    <td className="px-5 py-4">
                      <p
                        className={
                          task.status === "done"
                            ? "font-medium text-zinc-500 line-through"
                            : "font-medium text-white/90"
                        }
                      >
                        {task.title}
                      </p>

                      {task.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                          {task.description}
                        </p>
                      )}
                    </td>

                    {/* STATUS — clickable cycle */}
                    <td className="px-4 py-4">
                      <button
                        disabled={toggling === task.id}
                        onClick={() => handleCycleStatus(task)}
                        title="Click to cycle status"
                        className={[
                          "inline-flex items-center rounded-full border px-2.5 py-0.5",
                          "text-[10px] font-medium uppercase tracking-wide",
                          "transition-opacity hover:opacity-70 disabled:cursor-wait",
                          statusBadge(task.status),
                        ].join(" ")}
                      >
                        {statusLabel(task.status, t)}
                      </button>
                    </td>

                    {/* PRIORITY */}
                    <td className="px-4 py-4">
                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-2.5 py-0.5",
                          "text-[10px] font-medium uppercase tracking-wide",
                          priorityBadge(task.priority),
                        ].join(" ")}
                      >
                        {priorityLabel(task.priority, t)}
                      </span>
                    </td>

                    {/* DUE DATE */}
                    <td className="px-4 py-4 text-xs text-zinc-400">
                      {formatDueDate(task.due_date)}
                    </td>

                    {/* OWNER */}
                    <td className="px-4 py-4 text-xs text-zinc-500">
                      {"–"}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <OrbitButton
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEdit(task)}
                        >
                          <Pencil size={12} />
                        </OrbitButton>

                        <OrbitButton
                          variant="danger"
                          className="h-8 w-8 p-0"
                          onClick={() => setDeleteTarget(task)}
                        >
                          <Trash2 size={12} />
                        </OrbitButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE / EDIT SHEET */}
      <CreateTaskSheet
        open={sheetOpen}
        task={editTask}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditTask(null);
        }}
        onSaved={() => {
          setSheetOpen(false);
          setEditTask(null);
          reload();
        }}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>{t("deleteDescription")}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <OrbitButton
              variant="secondary"
              disabled={deleteLoading}
              onClick={() => setDeleteTarget(null)}
            >
              {tc("cancel")}
            </OrbitButton>

            <OrbitButton
              variant="danger"
              loading={deleteLoading}
              onClick={confirmDelete}
            >
              {tc("delete")}
            </OrbitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
