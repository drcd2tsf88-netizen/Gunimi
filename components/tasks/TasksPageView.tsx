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
  AlertCircle,
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
import { TAG_COLOR_CLASSES, type WorkspaceTag } from "@/types/tag";
import type { TaskTagsMap } from "@/server/actions/tasks/getWorkspaceTaskTagsMap";
import { stripHtml } from "@/lib/utils/stripHtml";
import { useTaskFocusStore } from "@/lib/store/task-focus-store";
import { createClient } from "@/lib/supabase/client";

type Props = {
  initialTasks: Task[];
  members: WorkspaceMember[];
  workspaceId: string;
  currentUserId: string;
  initialTaskId?: string | null;
  initialTaskTagsMap?: TaskTagsMap;
};

const NEXT_STATUS: Record<string, string> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

const PRIORITY_LEFT_BORDER: Record<string, string> = {
  high: "border-l-2 border-l-red-500/60",
  medium: "border-l-2 border-l-amber-500/50",
  low: "border-l-2 border-l-zinc-700/60",
};

function statusBadge(status: string) {
  if (status === "in_progress") return "text-violet-300 border-violet-500/20 bg-violet-500/10";
  if (status === "done") return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
  return "text-zinc-400 border-zinc-400/20 bg-zinc-400/10";
}

function priorityBadge(priority: string) {
  if (priority === "high") return "text-red-300 border-red-500/20 bg-red-500/10";
  if (priority === "medium") return "text-amber-300 border-amber-500/20 bg-amber-500/10";
  return "text-zinc-500 border-zinc-500/20 bg-zinc-500/10";
}

function dueDateInfo(date?: string | null): { label: string; className: string } {
  if (!date) return { label: "–", className: "text-zinc-500" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  const label = due.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
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

function getAssigneeMember(userId: string | null | undefined, members: WorkspaceMember[]): WorkspaceMember | null {
  if (!userId) return null;
  return members.find((m) => m.user_id === userId) ?? null;
}

function AssigneeAvatar({ userId, members }: { userId?: string | null; members: WorkspaceMember[] }) {
  const member = getAssigneeMember(userId, members);
  if (!member) return <span className="text-zinc-600">–</span>;

  const name = member.profiles?.full_name || member.profiles?.email || "?";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      title={name}
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-[9px] font-semibold text-violet-300 ring-1 ring-violet-500/20"
    >
      {initials}
    </span>
  );
}

const MAX_VISIBLE_TAGS = 2;

function TaskTagChips({ tags }: { tags: WorkspaceTag[] }) {
  if (!tags || tags.length === 0) return null;
  const visible = tags.slice(0, MAX_VISIBLE_TAGS);
  const overflow = tags.length - MAX_VISIBLE_TAGS;
  return (
    <div className="mt-1 flex flex-wrap items-center gap-1">
      {visible.map((tag) => {
        const colors = TAG_COLOR_CLASSES[tag.color] ?? TAG_COLOR_CLASSES.violet;
        return (
          <span
            key={tag.id}
            className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-medium ${colors.bg} ${colors.text} ${colors.border}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${colors.bg} border ${colors.border}`} />
            {tag.name}
          </span>
        );
      })}
      {overflow > 0 && (
        <span className="text-[9px] text-zinc-600">+{overflow}</span>
      )}
    </div>
  );
}

const STATUS_GROUPS: { status: string; labelKey: string; dotClass: string }[] = [
  { status: "todo", labelKey: "groupTodo", dotClass: "bg-zinc-500" },
  { status: "in_progress", labelKey: "groupInProgress", dotClass: "bg-violet-400" },
  { status: "done", labelKey: "groupDone", dotClass: "bg-emerald-400" },
];

export default function TasksPageView({
  initialTasks,
  members,
  workspaceId,
  currentUserId,
  initialTaskId,
  initialTaskTagsMap = {},
}: Props) {
  const t = useTranslations("tasks");
  const tc = useTranslations("common");
  const { setTaskCounts } = useTaskFocusStore();

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskTagsMap] = useState<TaskTagsMap>(initialTaskTagsMap);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(() => {
    const parentIds = new Set<string>();
    initialTasks.forEach((t) => { if (t.parent_task_id) parentIds.add(t.parent_task_id); });
    return parentIds;
  });
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialTaskId ?? null);
  const [myTasksOnly, setMyTasksOnly] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");

  const reload = useCallback(async () => {
    const fresh = await getWorkspaceTasks();
    setTasks(fresh as Task[]);
  }, []);

  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  useEffect(() => {
    if (!workspaceId) return;
    const supabase = createClient();
    channelRef.current = supabase
      .channel(`tasks:${workspaceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "workspace_tasks", filter: `workspace_id=eq.${workspaceId}` }, () => { reload(); })
      .subscribe();
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [workspaceId, reload]);

  const metrics = useMemo(() => ({
    total: tasks.filter((t) => !t.parent_task_id).length,
    todo: tasks.filter((t) => t.status === "todo" && !t.parent_task_id).length,
    inProgress: tasks.filter((t) => t.status === "in_progress" && !t.parent_task_id).length,
    done: tasks.filter((t) => t.status === "done" && !t.parent_task_id).length,
  }), [tasks]);

  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter((t) => {
      if (t.status === "done" || t.parent_task_id) return false;
      if (!t.due_date) return false;
      const due = new Date(t.due_date);
      due.setHours(0, 0, 0, 0);
      return due < today;
    });
  }, [tasks]);

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

  const rootFilteredTasks = useMemo(
    () => filteredTasks.filter((t) => !t.parent_task_id),
    [filteredTasks],
  );

  const hasActiveFilters = search !== "" || filterStatus !== "all" || filterPriority !== "all" || filterAssignee !== "all";

  function clearFilters() {
    setSearch(""); setFilterStatus("all"); setFilterPriority("all"); setFilterAssignee("all");
  }

  function toggleExpand(taskId: string) {
    setExpandedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId); else next.add(taskId);
      return next;
    });
  }

  function toggleGroup(status: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status); else next.add(status);
      return next;
    });
  }

  function handleCreate() { setEditTask(null); setSheetOpen(true); }
  function handleEdit(task: Task) { setEditTask(task); setSheetOpen(true); }

  async function handleCycleStatus(task: Task) {
    if (toggling === task.id) return;
    const next = NEXT_STATUS[task.status] ?? "todo";
    setToggling(task.id);
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    const ok = await updateTask({ id: task.id, status: next });
    setToggling(null);
    if (!ok) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
      toast.error(t("failedToUpdate"));
    } else {
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
      setTasks((prev) => prev.filter((t) => t.id !== target.id && t.parent_task_id !== target.id));
      getTaskCounts().then(setTaskCounts).catch(() => {});
    } else {
      toast.error(t("failedToDelete"));
    }
  }

  // ── TASK ROW ───────────────────────────────────────────────────────────────
  function renderTaskRow(task: Task, isSubtask = false) {
    const due = dueDateInfo(task.due_date);
    const children = subtaskMap.get(task.id) ?? [];
    const hasChildren = children.length > 0;
    const isExpanded = expandedTaskIds.has(task.id);
    const taskTags = taskTagsMap[task.id] ?? [];

    return (
      <React.Fragment key={task.id}>
        <tr
          onClick={() => setSelectedTaskId(task.id)}
          className={[
            "group cursor-pointer transition-colors hover:bg-white/[0.025]",
            isSubtask ? "bg-white/[0.012]" : "",
            !isSubtask ? PRIORITY_LEFT_BORDER[task.priority] ?? PRIORITY_LEFT_BORDER.low : "",
          ].join(" ")}
        >
          {/* TITLE */}
          <td className={isSubtask ? "py-3 pl-14 pr-5" : "px-5 py-4"}>
            <div className="flex items-start gap-2">
              {!isSubtask && hasChildren && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}
                  className="mt-0.5 shrink-0 text-zinc-500 transition-colors hover:text-white/70"
                  aria-label={isExpanded ? t("collapseSubtasks") : t("expandSubtasks")}
                >
                  <ChevronRight size={14} className={`transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`} />
                </button>
              )}
              <div className="min-w-0">
                <p className={task.status === "done" ? "font-medium text-zinc-500 line-through" : "font-medium text-white/90 group-hover:text-violet-300 transition-colors"}>
                  {task.title}
                </p>
                {!isSubtask && task.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{stripHtml(task.description)}</p>
                )}
                {!isSubtask && hasChildren && (
                  <p className="mt-0.5 text-[10px] text-zinc-600">
                    {children.filter((c) => c.status === "done").length}/{children.length} {t("subtasksCompleted")}
                  </p>
                )}
                {!isSubtask && <TaskTagChips tags={taskTags} />}
              </div>
            </div>
          </td>

          {/* STATUS */}
          <td className="px-4 py-4">
            <button
              disabled={toggling === task.id}
              onClick={(e) => { e.stopPropagation(); handleCycleStatus(task); }}
              title={t("cycleStatusTooltip")}
              className={["inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide transition-opacity hover:opacity-70 disabled:cursor-wait", statusBadge(task.status)].join(" ")}
            >
              {statusLabel(task.status, t)}
            </button>
          </td>

          {/* PRIORITY */}
          <td className="hidden px-4 py-4 sm:table-cell">
            <span className={["inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide", priorityBadge(task.priority)].join(" ")}>
              {priorityLabel(task.priority, t)}
            </span>
          </td>

          {/* DUE DATE */}
          <td className={`px-4 py-4 text-xs ${due.className}`}>{due.label}</td>

          {/* ASSIGNEE AVATAR */}
          <td className="hidden px-4 py-4 md:table-cell">
            <AssigneeAvatar userId={task.assigned_to} members={members} />
          </td>

          {/* ACTIONS */}
          <td className="px-4 py-4">
            <div className="flex items-center justify-end gap-1.5 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
              <button
                onClick={(e) => { e.stopPropagation(); handleCycleStatus(task); }}
                title={t("cycleStatusTooltip")}
                disabled={toggling === task.id}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] text-zinc-500 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 disabled:cursor-wait"
              >
                <CheckCircle2 size={12} />
              </button>
              <GunimiButton variant="secondary" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); handleEdit(task); }}>
                <Pencil size={11} />
              </GunimiButton>
              <GunimiButton variant="danger" className="h-7 w-7 p-0" onClick={(e) => { e.stopPropagation(); setDeleteTarget(task); }}>
                <Trash2 size={11} />
              </GunimiButton>
            </div>
          </td>
        </tr>

        {/* SUBTASK ROWS */}
        {!isSubtask && isExpanded && children.map((sub) => renderTaskRow(sub, true))}
      </React.Fragment>
    );
  }

  // ── LIST VIEW — grouped by status ─────────────────────────────────────────
  function renderGroupedList() {
    const isFiltered = filterStatus !== "all";

    if (isFiltered) {
      // When status filter is active, render flat (no groups)
      return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
          <table className="w-full text-sm">
            <TableHead />
            <tbody className="divide-y divide-white/[0.04]">
              {rootFilteredTasks.map((task) => renderTaskRow(task))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {STATUS_GROUPS.map(({ status, labelKey, dotClass }) => {
          const groupTasks = rootFilteredTasks.filter((t) => t.status === status);
          const isCollapsed = collapsedGroups.has(status);

          return (
            <div key={status} className="overflow-hidden rounded-2xl border border-white/[0.08]">
              {/* Group header */}
              <button
                type="button"
                onClick={() => toggleGroup(status)}
                className="flex w-full items-center gap-3 border-b border-white/[0.06] bg-white/[0.015] px-5 py-3 transition-colors hover:bg-white/[0.03]"
              >
                <span className={`h-2 w-2 rounded-full ${dotClass}`} />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  {t(labelKey as "groupTodo" | "groupInProgress" | "groupDone")}
                </span>
                <span className="ml-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/30">
                  {groupTasks.length}
                </span>
                <ChevronRight
                  size={13}
                  className={`ml-auto text-zinc-600 transition-transform duration-150 ${isCollapsed ? "" : "rotate-90"}`}
                />
              </button>

              {!isCollapsed && groupTasks.length > 0 && (
                <table className="w-full text-sm">
                  <TableHead hidden />
                  <tbody className="divide-y divide-white/[0.04]">
                    {groupTasks.map((task) => renderTaskRow(task))}
                  </tbody>
                </table>
              )}

              {!isCollapsed && groupTasks.length === 0 && (
                <p className="px-5 py-4 text-xs text-zinc-600">{t("noResults")}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <GunimiHeading badge={t("workspace")} title={t("tasks")} subtitle={t("tasksSubtitle")} />
        <GunimiButton onClick={handleCreate} className="mt-1 shrink-0">
          <Plus size={14} />
          {t("newTask")}
        </GunimiButton>
      </div>

      {/* OVERDUE BANNER */}
      {overdueTasks.length > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
          <AlertCircle size={14} className="shrink-0 text-red-400" />
          <p className="flex-1 text-xs text-red-300/80">
            {overdueTasks.length === 1
              ? <><strong className="text-red-300">&ldquo;{overdueTasks[0].title}&rdquo;</strong>&nbsp;&mdash;&nbsp;{t("overdueOne")}</>
              : <><strong className="text-red-300">{overdueTasks.length}</strong>&nbsp;{t("overdueMany")}</>
            }
          </p>
          <button
            onClick={() => { setFilterStatus("all"); setSearch(""); }}
            className="shrink-0 text-[10px] text-red-400/60 transition-colors hover:text-red-300"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* METRICS STRIP */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <GunimiStatCard
          title={t("tasks")}
          value={metrics.total}
          icon={ListTodo}
          animated
          active={filterStatus === "all"}
          onClick={() => setFilterStatus("all")}
          description={metrics.total > 0 ? `${metrics.done} / ${metrics.total} ${t("completionProgress")}` : undefined}
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

      {/* Progress bar under metrics */}
      {metrics.total > 0 && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-700"
            style={{ width: `${Math.round((metrics.done / metrics.total) * 100)}%` }}
          />
        </div>
      )}

      {/* SEARCH + FILTERS TOOLBAR */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <GunimiInput value={search} placeholder={t("searchPlaceholder")} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px] shrink-0"><SelectValue placeholder={t("taskStatus")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatuses")}</SelectItem>
            <SelectItem value="todo">{t("statusTodo")}</SelectItem>
            <SelectItem value="in_progress">{t("statusInProgress")}</SelectItem>
            <SelectItem value="done">{t("statusDone")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[140px] shrink-0"><SelectValue placeholder={t("taskPriority")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allPriorities")}</SelectItem>
            <SelectItem value="low">{t("priorityLow")}</SelectItem>
            <SelectItem value="medium">{t("priorityMedium")}</SelectItem>
            <SelectItem value="high">{t("priorityHigh")}</SelectItem>
          </SelectContent>
        </Select>

        {members.length > 0 && (
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-[160px] shrink-0"><SelectValue placeholder={t("assignee")} /></SelectTrigger>
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

        {hasActiveFilters && (
          <GunimiButton variant="secondary" className="shrink-0 h-9 px-3 gap-1.5" onClick={clearFilters}>
            <X size={12} />
            {t("clearFilters")}
          </GunimiButton>
        )}

        <button
          onClick={() => setMyTasksOnly((v) => !v)}
          className={["flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors", myTasksOnly ? "border-violet-500/40 bg-violet-500/10 text-violet-300" : "border-white/[0.07] text-zinc-500 hover:text-white/70"].join(" ")}
        >
          {myTasksOnly ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {t("myTasks")}
        </button>

        <div className="ml-auto flex shrink-0 items-center rounded-lg border border-white/[0.07] p-0.5">
          <button onClick={() => setViewMode("list")} title={t("listView")} className={["flex h-7 w-7 items-center justify-center rounded-md transition-all", viewMode === "list" ? "bg-white/[0.08] text-white" : "text-zinc-500 hover:text-white/70"].join(" ")}>
            <LayoutList size={13} />
          </button>
          <button onClick={() => setViewMode("kanban")} title={t("kanbanView")} className={["flex h-7 w-7 items-center justify-center rounded-md transition-all", viewMode === "kanban" ? "bg-white/[0.08] text-white" : "text-zinc-500 hover:text-white/70"].join(" ")}>
            <Columns size={13} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <section className="mt-4 space-y-6">
        {tasks.length === 0 ? (
          <GunimiEmptyState icon={CheckSquare} title={t("noTasks")} description={t("noTasksDescription")} action={<GunimiButton onClick={handleCreate}><Plus size={14} />{t("newTask")}</GunimiButton>} />
        ) : rootFilteredTasks.length === 0 && filteredTasks.length === 0 ? (
          <GunimiEmptyState icon={Search} title={t("noResults")} description={t("noResultsDescription")} />
        ) : viewMode === "kanban" ? (
          <KanbanView
            tasks={filteredTasks}
            members={members}
            onEdit={handleEdit}
            onDelete={(task) => setDeleteTarget(task)}
            onTasksChange={(updatedFiltered) =>
              setTasks((prev) => prev.map((t) => { const found = updatedFiltered.find((u) => u.id === t.id); return found !== undefined ? found : t; }))
            }
          />
        ) : (
          renderGroupedList()
        )}
      </section>

      {/* CREATE / EDIT SHEET */}
      <CreateTaskSheet
        key={editTask?.id ?? "create"}
        open={sheetOpen}
        task={editTask}
        members={members}
        onOpenChange={(open) => { setSheetOpen(open); if (!open) setEditTask(null); }}
        onSaved={(saved, isEdit) => {
          setSheetOpen(false); setEditTask(null);
          if (isEdit) {
            setTasks((prev) => prev.map((t) => (t.id === saved.id ? { ...t, ...saved } : t)));
          } else {
            setTasks((prev) => [saved, ...prev]);
            setExpandedTaskIds((prev) => { if (!saved.parent_task_id) return prev; const next = new Set(prev); next.add(saved.parent_task_id); return next; });
          }
          getTaskCounts().then(setTaskCounts).catch(() => {});
        }}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>{t("deleteDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <GunimiButton variant="secondary" disabled={deleteLoading} onClick={() => setDeleteTarget(null)}>{tc("cancel")}</GunimiButton>
            <GunimiButton variant="danger" loading={deleteLoading} onClick={confirmDelete}>{tc("delete")}</GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* TASK DETAIL PANEL */}
      <TaskDetailPanel
        taskId={selectedTaskId}
        currentUserId={currentUserId}
        members={members}
        onClose={() => {
          setSelectedTaskId(null);
          // Return keyboard focus to page so arrow keys scroll the task list
          requestAnimationFrame(() => (document.activeElement as HTMLElement)?.blur());
        }}
        onNavigateToTask={(id) => setSelectedTaskId(id)}
        onSubtaskCreated={(parentId, sub) => {
          setTasks((prev) => [...prev, { id: sub.id, title: sub.title, status: sub.status, priority: sub.priority, parent_task_id: parentId, created_at: sub.created_at, due_date: sub.due_date, assigned_to: sub.assigned_to } as Task]);
          setExpandedTaskIds((prev) => { const next = new Set(prev); next.add(parentId); return next; });
        }}
        onTaskUpdated={(taskId, changes) => {
          setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...changes } : t)));
        }}
      />
    </>
  );
}

function TableHead({ hidden = false }: { hidden?: boolean }) {
  const t = useTranslations("tasks");
  if (hidden) return <thead className="sr-only"><tr><th>{t("taskTitle")}</th><th>{t("taskStatus")}</th><th>{t("taskPriority")}</th><th>{t("dueDate")}</th><th>{t("assignee")}</th><th /></tr></thead>;
  return (
    <thead>
      <tr className="border-b border-white/[0.06]">
        <th className="px-5 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">{t("taskTitle")}</th>
        <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">{t("taskStatus")}</th>
        <th className="hidden px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 sm:table-cell">{t("taskPriority")}</th>
        <th className="px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">{t("dueDate")}</th>
        <th className="hidden px-4 py-3.5 text-left text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 md:table-cell">{t("assignee")}</th>
        <th className="px-4 py-3.5" />
      </tr>
    </thead>
  );
}
