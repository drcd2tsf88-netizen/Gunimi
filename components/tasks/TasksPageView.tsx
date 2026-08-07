"use client";

import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";

import {
  CheckSquare,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  ListTodo,
  Clock,
  CheckCircle2,
  Search,
  X,
  LayoutList,
  Columns,
} from "lucide-react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiStatCard from "@/components/ui/GunimiStatCard";

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
import KanbanView from "@/components/tasks/KanbanView";
import TaskDetailPanel from "@/components/tasks/TaskDetailPanel";

import { getWorkspaceTasks } from "@/server/actions/tasks/getWorkspaceTasks";
import { updateTask } from "@/server/actions/tasks/updateTask";
import { deleteTask } from "@/server/actions/tasks/deleteTask";
import { getTaskCounts } from "@/server/actions/tasks/getTaskCounts";

import { Task, WorkspaceMember } from "@/types/task";
import { useTaskFocusStore } from "@/lib/store/task-focus-store";

import { createClient } from "@/lib/supabase/client";

type Props = {
  initialTasks: Task[];
  members: WorkspaceMember[];
  workspaceId: string;
  currentUserId: string;
  initialTaskId?: string | null;
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

  const label = due.toLocaleDateString(undefined, {
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

export default function TasksPageView({ initialTasks, members, workspaceId, currentUserId, initialTaskId }: Props) {
  const t = useTranslations("tasks");
  const tc = useTranslations("common");
  const { setTaskCounts } = useTaskFocusStore();

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(() => {
    const parentIds = new Set<string>();
    initialTasks.forEach((t) => { if (t.parent_task_id) parentIds.add(t.parent_task_id); });
    return parentIds;
  });
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialTaskId ?? null);
  const [myTasksOnly, setMyTasksOnly] = useState(false);

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
      if (myTasksOnly && task.assigned_to !== currentUserId) return false;
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
  }, [tasks, search, filterStatus, filterPriority, filterAssignee, myTasksOnly, currentUserId]);

  // Build subtask map: parentId → subtasks
  const subtaskMap = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      if (task.parent_task_id) {
        const siblings = map.get(task.parent_task_id) ?? [];
        siblings.push(task);
        map.set(task.parent_task_id, siblings);
      }
    }
    return map;
  }, [tasks]);

  // Root tasks only (no parent), after filters
  const rootFilteredTasks = useMemo(
    () => filteredTasks.filter((t) => !t.parent_task_id),
    [filteredTasks],
  );

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

  function toggleExpand(taskId: string) {
    setExpandedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
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
    } else {
      // Refresh topbar badge counts non-blockingly
      getTaskCounts().then(setTaskCounts).catch(() => {});
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    const target = deleteTarget;
    setDeleteLoading(true);
    const ok = await deleteTask(target.id);
    setDeleteLoading(false);

    if (ok) {
      toast.success(t("taskDeleted"));
      setDeleteTarget(null);
      if (selectedTaskId === target.id) setSelectedTaskId(null);
      setTasks((prev) =>
        prev.filter((t) => t.id !== target.id && t.parent_task_id !== target.id)
      );
      getTaskCounts().then(setTaskCounts).catch(() => {});
    } else {
      toast.error(t("failedToDelete"));
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <GunimiHeading
          badge={t("workspace")}
          title={t("tasks")}
          subtitle={t("tasksSubtitle")}
        />

        <GunimiButton
          onClick={handleCreate}
          className="mt-1 shrink-0"
        >
          <Plus size={14} />
          {t("newTask")}
        </GunimiButton>
      </div>

      {/* METRICS STRIP */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <GunimiStatCard
          title={t("tasks")}
          value={metrics.total}
          icon={ListTodo}
          animated
          active={filterStatus === "all"}
          onClick={() => setFilterStatus("all")}
        />
        <GunimiStatCard
          title={t("statusTodo")}
          value={metrics.todo}
          icon={CheckSquare}
          animated
          active={filterStatus === "todo"}
          onClick={() => setFilterStatus(filterStatus === "todo" ? "all" : "todo")}
        />
        <GunimiStatCard
          title={t("statusInProgress")}
          value={metrics.inProgress}
          icon={Clock}
          animated
          active={filterStatus === "in_progress"}
          onClick={() => setFilterStatus(filterStatus === "in_progress" ? "all" : "in_progress")}
        />
        <GunimiStatCard
          title={t("statusDone")}
          value={metrics.done}
          icon={CheckCircle2}
          animated
          active={filterStatus === "done"}
          onClick={() => setFilterStatus(filterStatus === "done" ? "all" : "done")}
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
          <GunimiInput
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
          <GunimiButton
            variant="secondary"
            className="shrink-0 h-9 px-3 gap-1.5"
            onClick={clearFilters}
          >
            <X size={12} />
            {t("clearFilters")}
          </GunimiButton>
        )}

        {/* My Tasks toggle */}
        <button
          onClick={() => setMyTasksOnly((v) => !v)}
          className={[
            "flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
            myTasksOnly
              ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
              : "border-white/[0.07] text-zinc-500 hover:text-white/70",
          ].join(" ")}
        >
          {myTasksOnly ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {t("myTasks")}
        </button>

        {/* View toggle */}
        <div className="ml-auto flex shrink-0 items-center rounded-lg border border-white/[0.07] p-0.5">
          <button
            onClick={() => setViewMode("list")}
            title={t("listView")}
            className={[
              "flex h-7 w-7 items-center justify-center rounded-md transition-all",
              viewMode === "list"
                ? "bg-white/[0.08] text-white"
                : "text-zinc-500 hover:text-white/70",
            ].join(" ")}
          >
            <LayoutList size={13} />
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            title={t("kanbanView")}
            className={[
              "flex h-7 w-7 items-center justify-center rounded-md transition-all",
              viewMode === "kanban"
                ? "bg-white/[0.08] text-white"
                : "text-zinc-500 hover:text-white/70",
            ].join(" ")}
          >
            <Columns size={13} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <section className="mt-4 space-y-6">
        {tasks.length === 0 ? (
          <GunimiEmptyState
            icon={CheckSquare}
            title={t("noTasks")}
            description={t("noTasksDescription")}
            action={
              <GunimiButton onClick={handleCreate}>
                <Plus size={14} />
                {t("newTask")}
              </GunimiButton>
            }
          />
        ) : rootFilteredTasks.length === 0 && filteredTasks.length === 0 ? (
          <GunimiEmptyState
            icon={Search}
            title={t("noResults")}
            description={t("noResultsDescription")}
          />
        ) : viewMode === "kanban" ? (
          <KanbanView
            tasks={filteredTasks}
            members={members}
            onEdit={handleEdit}
            onDelete={(task) => setDeleteTarget(task)}
            onTasksChange={(updatedFiltered) =>
              setTasks((prev) =>
                prev.map((t) => {
                  const found = updatedFiltered.find((u) => u.id === t.id);
                  return found !== undefined ? found : t;
                })
              )
            }
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
                  <th className="hidden px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 sm:table-cell">
                    {t("taskPriority")}
                  </th>
                  <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    {t("dueDate")}
                  </th>
                  <th className="hidden px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 md:table-cell">
                    {t("assignee")}
                  </th>
                  <th className="px-4 py-3.5" />
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-white/[0.04]">
                {rootFilteredTasks.map((task) => {
                  const due = dueDateInfo(task.due_date);
                  const children = subtaskMap.get(task.id) ?? [];
                  const hasChildren = children.length > 0;
                  const isExpanded = expandedTaskIds.has(task.id);

                  return (
                    <React.Fragment key={task.id}>
                      <tr
                        onClick={() => setSelectedTaskId(task.id)}
                        className="group cursor-pointer transition-colors hover:bg-white/[0.02]"
                      >
                        {/* TITLE */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {hasChildren && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}
                                className="shrink-0 text-zinc-500 transition-colors hover:text-white/70"
                                aria-label={isExpanded ? t("collapseSubtasks") : t("expandSubtasks")}
                              >
                                <ChevronRight
                                  size={14}
                                  className={`transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
                                />
                              </button>
                            )}
                            <div>
                              <p
                                className={
                                  task.status === "done"
                                    ? "font-medium text-zinc-500 line-through"
                                    : "font-medium text-white/90 group-hover:text-violet-300 transition-colors"
                                }
                              >
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                                  {task.description}
                                </p>
                              )}
                              {hasChildren && (
                                <p className="mt-0.5 text-[10px] text-zinc-600">
                                  {children.filter((c) => c.status === "done").length}/{children.length} {t("subtasksCompleted")}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* STATUS — clickable cycle */}
                        <td className="px-4 py-4">
                          <button
                            disabled={toggling === task.id}
                            onClick={(e) => { e.stopPropagation(); handleCycleStatus(task); }}
                            title={t("cycleStatusTooltip")}
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
                        <td className="hidden px-4 py-4 sm:table-cell">
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
                        <td className={`px-4 py-4 text-xs ${due.className}`}>
                          {due.label}
                        </td>

                        {/* ASSIGNEE */}
                        <td className="hidden px-4 py-4 text-xs text-zinc-400 md:table-cell">
                          {getAssigneeName(task.assigned_to, members)}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                            <GunimiButton
                              variant="secondary"
                              className="h-8 w-8 p-0"
                              onClick={(e) => { e.stopPropagation(); handleEdit(task); }}
                            >
                              <Pencil size={12} />
                            </GunimiButton>

                            <GunimiButton
                              variant="danger"
                              className="h-8 w-8 p-0"
                              onClick={(e) => { e.stopPropagation(); setDeleteTarget(task); }}
                            >
                              <Trash2 size={12} />
                            </GunimiButton>
                          </div>
                        </td>
                      </tr>

                      {/* SUBTASK ROWS */}
                      {isExpanded && children.map((sub) => {
                        const subDue = dueDateInfo(sub.due_date);
                        return (
                          <tr
                            key={sub.id}
                            onClick={() => setSelectedTaskId(sub.id)}
                            className="group cursor-pointer bg-white/[0.012] transition-colors hover:bg-white/[0.025]"
                          >
                            <td className="py-3 pl-14 pr-5">
                              <p
                                className={[
                                  "text-sm",
                                  sub.status === "done"
                                    ? "text-zinc-600 line-through"
                                    : "text-white/70 group-hover:text-violet-300 transition-colors",
                                ].join(" ")}
                              >
                                {sub.title}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                disabled={toggling === sub.id}
                                onClick={(e) => { e.stopPropagation(); handleCycleStatus(sub); }}
                                title={t("cycleStatusTooltip")}
                                className={[
                                  "inline-flex items-center rounded-full border px-2.5 py-0.5",
                                  "text-[10px] font-medium uppercase tracking-wide",
                                  "transition-opacity hover:opacity-70 disabled:cursor-wait",
                                  statusBadge(sub.status),
                                ].join(" ")}
                              >
                                {statusLabel(sub.status, t)}
                              </button>
                            </td>
                            <td className="hidden px-4 py-3 sm:table-cell">
                              <span
                                className={[
                                  "inline-flex items-center rounded-full border px-2.5 py-0.5",
                                  "text-[10px] font-medium uppercase tracking-wide",
                                  priorityBadge(sub.priority),
                                ].join(" ")}
                              >
                                {priorityLabel(sub.priority, t)}
                              </span>
                            </td>
                            <td className={`px-4 py-3 text-xs ${subDue.className}`}>
                              {subDue.label}
                            </td>
                            <td className="hidden px-4 py-3 text-xs text-zinc-500 md:table-cell">
                              {getAssigneeName(sub.assigned_to, members)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
                                <GunimiButton
                                  variant="secondary"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => { e.stopPropagation(); handleEdit(sub); }}
                                >
                                  <Pencil size={12} />
                                </GunimiButton>
                                <GunimiButton
                                  variant="danger"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => { e.stopPropagation(); setDeleteTarget(sub); }}
                                >
                                  <Trash2 size={12} />
                                </GunimiButton>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE / EDIT SHEET */}
      <CreateTaskSheet
        key={editTask?.id ?? "create"}
        open={sheetOpen}
        task={editTask}
        members={members}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setEditTask(null);
        }}
        onSaved={(saved, isEdit) => {
          setSheetOpen(false);
          setEditTask(null);
          if (isEdit) {
            setTasks((prev) =>
              prev.map((t) => (t.id === saved.id ? { ...t, ...saved } : t))
            );
          } else {
            setTasks((prev) => [saved, ...prev]);
            setExpandedTaskIds((prev) => {
              if (!saved.parent_task_id) return prev;
              const next = new Set(prev);
              next.add(saved.parent_task_id);
              return next;
            });
          }
          getTaskCounts().then(setTaskCounts).catch(() => {});
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

          <DialogFooter className="mt-6">
            <GunimiButton
              variant="secondary"
              disabled={deleteLoading}
              onClick={() => setDeleteTarget(null)}
            >
              {tc("cancel")}
            </GunimiButton>

            <GunimiButton
              variant="danger"
              loading={deleteLoading}
              onClick={confirmDelete}
            >
              {tc("delete")}
            </GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TASK DETAIL PANEL */}
      <TaskDetailPanel
        taskId={selectedTaskId}
        currentUserId={currentUserId}
        members={members}
        onClose={() => setSelectedTaskId(null)}
        onNavigateToTask={(id) => setSelectedTaskId(id)}
        onSubtaskCreated={(parentId, sub) => {
          setTasks((prev) => [
            ...prev,
            {
              id: sub.id,
              title: sub.title,
              status: sub.status,
              priority: sub.priority,
              parent_task_id: parentId,
              created_at: sub.created_at,
              due_date: sub.due_date,
              assigned_to: sub.assigned_to,
            } as Task,
          ]);
          setExpandedTaskIds((prev) => {
            const next = new Set(prev);
            next.add(parentId);
            return next;
          });
        }}
        onTaskUpdated={(taskId, changes) => {
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, ...changes } : t))
          );
        }}
      />
    </>
  );
}
