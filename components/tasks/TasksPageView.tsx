"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import {
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
  ListTodo,
  Clock,
  CheckCircle2,
  Search,
  X,
} from "lucide-react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import OrbitHeading from "@/components/ui/OrbitHeading";
import OrbitButton from "@/components/ui/OrbitButton";
import OrbitEmptyState from "@/components/ui/OrbitEmptyState";
import OrbitInput from "@/components/ui/OrbitInput";
import OrbitStatCard from "@/components/ui/OrbitStatCard";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CreateTaskSheet from "@/components/tasks/CreateTaskSheet";

import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import { updateTask } from "@/server/actions/tasks/updateTask";
import { deleteTask } from "@/server/actions/tasks/deleteTask";

import { Task, WorkspaceMember } from "@/types/task";

import { createClient } from "@/lib/supabase/client";

type Props = {
  initialTasks: Task[];
  members: WorkspaceMember[];
  workspaceId: string;
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

function dueDateInfo(date?: string | null): { label: string; className: string } {
  if (!date) return { label: "–", className: "text-zinc-500" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(date);
  due.setHours(0, 0, 0, 0);

  const label = due.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (due < today) return { label, className: "text-red-400 font-medium" };
  if (due.getTime() === today.getTime()) return { label, className: "text-amber-400 font-medium" };
  return { label, className: "text-zinc-400" };
}

function statusLabel(status: string, t: (key: string) => string): string {
  if (status === "in_progress") return t("statusInProgress");
  if (status === "done") return t("statusDone");
  return t("statusTodo");
}

function priorityLabel(priority: string, t: (key: string) => string): string {
  if (priority === "high") return t("priorityHigh");
  if (priority === "medium") return t("priorityMedium");
  return t("priorityLow");
}

function getAssigneeName(userId: string | null | undefined, members: WorkspaceMember[]): string {
  if (!userId) return "–";
  const member = members.find((m) => m.user_id === userId);
  if (!member?.profiles) return "–";
  return member.profiles.full_name || member.profiles.email || "–";
}

export default function TasksPageView({ initialTasks, members, workspaceId }: Props) {
  const t = useTranslations("tasks");
  const tc = useTranslations("common");

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  // Search + filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");

  const reload = useCallback(async () => {
    const fresh = await getWorkspaceTasks();
    setTasks(fresh as Task[]);
  }, []);

  // Realtime subscription
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  useEffect(() => {
    if (!workspaceId) return;

    const supabase = createClient();

    channelRef.current = supabase
      .channel(`tasks:${workspaceId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workspace_tasks",
          filter: `workspace_id=eq.${workspaceId}`,
        },
        () => {
          reload();
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [workspaceId, reload]);

  // Metrics (always from full task list)
  const metrics = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  }), [tasks]);

  // Filtered list
  const filteredTasks = useMemo(() => {
    const q = search.toLowerCase();

    return tasks.filter((task) => {
      if (q) {
        const inTitle = task.title.toLowerCase().includes(q);
        const inDesc = task.description?.toLowerCase().includes(q) ?? false;
        if (!inTitle && !inDesc) return false;
      }
      if (filterStatus !== "all" && task.status !== filterStatus) return false;
      if (filterPriority !== "all" && task.priority !== filterPriority) return false;
      if (filterAssignee !== "all" && task.assigned_to !== filterAssignee) return false;
      return true;
    });
  }, [tasks, search, filterStatus, filterPriority, filterAssignee]);

  const hasActiveFilters =
    search !== "" ||
    filterStatus !== "all" ||
    filterPriority !== "all" ||
    filterAssignee !== "all";

  function clearFilters() {
    setSearch("");
    setFilterStatus("all");
    setFilterPriority("all");
    setFilterAssignee("all");
  }

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

      {/* METRICS STRIP */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <OrbitStatCard
          title={t("tasks")}
          value={metrics.total}
          icon={ListTodo}
          animated
        />
        <OrbitStatCard
          title={t("statusTodo")}
          value={metrics.todo}
          icon={CheckSquare}
          animated
        />
        <OrbitStatCard
          title={t("statusInProgress")}
          value={metrics.inProgress}
          icon={Clock}
          animated
        />
        <OrbitStatCard
          title={t("statusDone")}
          value={metrics.done}
          icon={CheckCircle2}
          animated
        />
      </div>

      {/* SEARCH + FILTERS TOOLBAR */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
          />
          <OrbitInput
            value={search}
            placeholder={t("searchPlaceholder")}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status filter */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px] shrink-0">
            <SelectValue placeholder={t("taskStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatuses")}</SelectItem>
            <SelectItem value="todo">{t("statusTodo")}</SelectItem>
            <SelectItem value="in_progress">{t("statusInProgress")}</SelectItem>
            <SelectItem value="done">{t("statusDone")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority filter */}
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[140px] shrink-0">
            <SelectValue placeholder={t("taskPriority")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allPriorities")}</SelectItem>
            <SelectItem value="low">{t("priorityLow")}</SelectItem>
            <SelectItem value="medium">{t("priorityMedium")}</SelectItem>
            <SelectItem value="high">{t("priorityHigh")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Assignee filter */}
        {members.length > 0 && (
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-[160px] shrink-0">
              <SelectValue placeholder={t("assignee")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allAssignees")}</SelectItem>
              {members.map((member) => (
                <SelectItem key={member.user_id} value={member.user_id}>
                  {member.profiles?.full_name || member.profiles?.email || member.user_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Clear filters */}
        {hasActiveFilters && (
          <OrbitButton
            variant="secondary"
            className="shrink-0 h-9 px-3 gap-1.5"
            onClick={clearFilters}
          >
            <X size={12} />
            {t("clearFilters")}
          </OrbitButton>
        )}
      </div>

      {/* CONTENT */}
      <section className="mt-4 space-y-6">
        {tasks.length === 0 ? (
          <OrbitEmptyState
            icon={CheckSquare}
            title={t("noTasks")}
            description={t("noTasksDescription")}
          />
        ) : filteredTasks.length === 0 ? (
          <OrbitEmptyState
            icon={Search}
            title={t("noResults")}
            description={t("clearFilters")}
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
                    {t("assignee")}
                  </th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-white/[0.04]">
                {filteredTasks.map((task) => {
                  const due = dueDateInfo(task.due_date);

                  return (
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

                      {/* DUE DATE — with intelligence coloring */}
                      <td className={`px-4 py-4 text-xs ${due.className}`}>
                        {due.label}
                      </td>

                      {/* ASSIGNEE */}
                      <td className="px-4 py-4 text-xs text-zinc-400">
                        {getAssigneeName(task.assigned_to, members)}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE / EDIT SHEET */}
      <CreateTaskSheet
        open={sheetOpen}
        task={editTask}
        members={members}
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
