"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  Calendar,
  User,
  Flag,
  CheckSquare,
  Square,
  Circle,
  CheckCircle2,
  Plus,
  Trash2,
  Download,
  MessageSquare,
  ChevronRight,
  Clock,
  Check,
  Loader2,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import GunimiCard from "@/components/ui/GunimiCard";
import TagPicker from "@/components/ui/TagPicker";
import NoteEditor from "@/components/notes/NoteEditor";
import CommentEditor from "@/components/tasks/CommentEditor";
import CommentContent from "@/components/tasks/CommentContent";
import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";
import { getTaskDetail } from "@/server/actions/tasks/getTaskDetail";
import { createTaskComment } from "@/server/actions/tasks/createTaskComment";
import { deleteTaskComment } from "@/server/actions/tasks/deleteTaskComment";
import { createSubtask } from "@/server/actions/tasks/createSubtask";
import { updateTask } from "@/server/actions/tasks/updateTask";
import { getTags } from "@/server/actions/tags/getTags";
import { getEntityTags } from "@/server/actions/tags/getEntityTags";
import type { TaskDetail, TaskComment, SubTask } from "@/server/actions/tasks/getTaskDetail";
import type { WorkspaceMember } from "@/types/task";
import type { WorkspaceTag } from "@/types/tag";

type Props = {
  taskId: string | null;
  currentUserId: string;
  members: WorkspaceMember[];
  onClose: () => void;
  onTaskUpdated?: (taskId: string, changes: Record<string, unknown>) => void;
  onSubtaskCreated?: (parentId: string, subtask: SubTask) => void;
  onNavigateToTask?: (taskId: string) => void;
};

const PRIORITY_CONFIG = {
  high: { color: "text-red-400", dot: "bg-red-500" },
  medium: { color: "text-amber-400", dot: "bg-amber-400" },
  low: { color: "text-zinc-500", dot: "bg-zinc-600" },
} as const;

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Avatar({ name, size = 28 }: { name: string | null; size?: number }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-violet-500/20 font-medium text-violet-300"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

export default function TaskDetailPanel({ taskId, currentUserId, members, onClose, onTaskUpdated, onSubtaskCreated, onNavigateToTask }: Props) {
  const t = useTranslations("tasks");
  const currentUserName = members.find(m => m.user_id === currentUserId)?.profiles?.full_name ?? null;

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [allTags, setAllTags] = useState<WorkspaceTag[]>([]);
  const [taskTags, setTaskTags] = useState<WorkspaceTag[]>([]);
  const [loading, startFetch] = useTransition();
  const [commentResetKey, setCommentResetKey] = useState(0);
  const [subtaskText, setSubtaskText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [, startTransition] = useTransition();
  const subtaskRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const assigneeRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!taskId) return;
    let cancelled = false;
    startFetch(async () => {
      const [data, tags, entityTags] = await Promise.all([
        getTaskDetail(taskId),
        getTags(),
        getEntityTags("task", taskId),
      ]);
      if (!cancelled) {
        setTask(data);
        setAllTags(tags);
        setTaskTags(entityTags);
        setDescriptionHtml(data?.description ?? "");
        setTitleValue(data?.title ?? "");
        setEditingDescription(false);
        setEditingTitle(false);
      }
    });
    return () => { cancelled = true; };
  }, [taskId]);

  useEffect(() => {
    if (showSubtaskInput) subtaskRef.current?.focus();
  }, [showSubtaskInput]);

  useEffect(() => {
    if (!showAssigneePicker && !showDatePicker) return;
    function handleClick(e: MouseEvent) {
      if (assigneeRef.current && !assigneeRef.current.contains(e.target as Node)) {
        setShowAssigneePicker(false);
      }
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showAssigneePicker, showDatePicker]);

  async function handleToggleStatus() {
    if (!task) return;
    const next = task.status === "done" ? "todo" : task.status === "todo" ? "in_progress" : "done";
    setTask((prev) => prev ? { ...prev, status: next } : prev);
    startTransition(async () => {
      await updateTask({ id: task.id, status: next });
      onTaskUpdated?.(task.id, { status: next });
    });
  }

  async function handleAssigneeChange(userId: string | null) {
    if (!task) return;
    const member = members.find((m) => m.user_id === userId);
    const name = member?.profiles?.full_name ?? null;
    setTask((prev) => prev ? { ...prev, assigned_to: userId, assignee_name: name } : prev);
    setShowAssigneePicker(false);
    toast.success(t("assigneeChanged"));
    startTransition(async () => {
      await updateTask({ id: task.id, assigned_to: userId });
      onTaskUpdated?.(task.id, { assigned_to: userId });
    });
  }

  async function handleDueDateChange(date: string) {
    if (!task) return;
    const iso = date ? new Date(date).toISOString() : null;
    setTask((prev) => prev ? { ...prev, due_date: iso } : prev);
    setShowDatePicker(false);
    toast.success(t("dueDateChanged"));
    startTransition(async () => {
      await updateTask({ id: task.id, due_date: iso ?? undefined });
      onTaskUpdated?.(task.id, { due_date: iso });
    });
  }

  async function handlePostComment(html: string) {
    if (!task || !html || html.replace(/<[^>]*>/g, "").trim() === "") return;
    setSubmittingComment(true);
    const result = await createTaskComment(task.id, html);
    if (result.success) {
      const newComment: TaskComment = {
        id: result.id!,
        user_id: currentUserId,
        content: html,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_name: currentUserName,
        author_avatar: null,
      };
      setTask((prev) => prev ? { ...prev, comments: [...prev.comments, newComment] } : prev);
      setCommentResetKey((k) => k + 1);
      toast.success(t("commentAdded"));
    } else {
      toast.error(t("failedToComment"));
    }
    setSubmittingComment(false);
  }

  async function handleDeleteComment(commentId: string) {
    if (!task) return;
    const ok = await deleteTaskComment(commentId);
    if (ok) {
      setTask((prev) => prev ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) } : prev);
      toast.success(t("commentDeleted"));
    }
  }

  async function handleAddSubtask() {
    if (!task || !subtaskText.trim()) return;
    setAddingSubtask(true);
    const result = await createSubtask(task.id, subtaskText.trim());
    if (result.success) {
      const newSub: SubTask = {
        id: result.id!,
        title: subtaskText.trim(),
        status: "todo",
        priority: "medium",
        assigned_to: null,
        due_date: null,
        created_at: new Date().toISOString(),
      };
      setTask((prev) => prev ? { ...prev, subtasks: [...prev.subtasks, newSub] } : prev);
      onSubtaskCreated?.(task.id, newSub);
      setSubtaskText("");
      setShowSubtaskInput(false);
      toast.success(t("subtaskAdded"));
    } else {
      toast.error(t("failedToAddSubtask"));
    }
    setAddingSubtask(false);
  }

  async function handleToggleSubtask(subId: string, current: string) {
    const next = current === "done" ? "todo" : "done";
    setTask((prev) =>
      prev
        ? { ...prev, subtasks: prev.subtasks.map((s) => s.id === subId ? { ...s, status: next } : s) }
        : prev
    );
    await updateTask({ id: subId, status: next });
    onTaskUpdated?.(subId, { status: next });
  }

  function handleDescriptionSave() {
    if (!task) return;
    setEditingDescription(false);
    startTransition(async () => {
      await updateTask({ id: task.id, description: descriptionHtml || null });
      setTask((prev) => prev ? { ...prev, description: descriptionHtml || null } : prev);
    });
  }

  function handleTitleSave() {
    if (!task) return;
    const trimmed = titleValue.trim();
    setEditingTitle(false);
    if (!trimmed || trimmed === task.title) {
      setTitleValue(task.title);
      return;
    }
    setTask((prev) => prev ? { ...prev, title: trimmed } : prev);
    startTransition(async () => {
      await updateTask({ id: task.id, title: trimmed });
      onTaskUpdated?.(task.id, { title: trimmed });
    });
  }

  function handleDownload() {
    if (!task) return;
    window.open(`/api/tasks/${task.id}/export?print=1`, "_blank");
  }

  if (!taskId) return null;

  const priorityCfg = PRIORITY_CONFIG[task?.priority as keyof typeof PRIORITY_CONFIG] ?? PRIORITY_CONFIG.medium;
  const doneCount = task?.subtasks.filter((s) => s.status === "done").length ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[520px] flex-col border-l border-white/[0.07] bg-[#080C14] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <CheckSquare size={15} className="text-violet-400" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {t("detailPanelTitle")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {task && (
              <button
                onClick={handleDownload}
                title={t("downloadReport")}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white/70"
              >
                <Download size={13} />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 size={20} className="animate-spin text-violet-400" />
            </div>
          ) : !task ? (
            <div className="flex h-64 items-center justify-center text-sm text-zinc-600">
              {t("taskNotFound")}
            </div>
          ) : (
            <div className="space-y-0">
              {/* Title + prominent completion toggle */}
              <div className="flex items-start gap-3 px-5 pb-3 pt-5">
                <button
                  onClick={handleToggleStatus}
                  title={t("cycleStatusTooltip")}
                  className={`mt-0.5 shrink-0 transition-colors ${
                    task.status === "done"
                      ? "text-emerald-400"
                      : "text-zinc-600 hover:text-emerald-400"
                  }`}
                >
                  {task.status === "done"
                    ? <CheckCircle2 size={20} />
                    : <Circle size={20} />}
                </button>
                {editingTitle ? (
                  <input
                    ref={titleInputRef}
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleTitleSave(); }
                      if (e.key === "Escape") { setEditingTitle(false); setTitleValue(task.title); }
                    }}
                    className="flex-1 rounded-lg bg-white/[0.05] px-2 py-0.5 text-base font-semibold text-white/90 outline-none ring-1 ring-violet-500/40"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => { setEditingTitle(true); setTitleValue(task.title); }}
                    className={`group flex-1 text-left text-base font-semibold leading-snug transition-colors ${task.status === "done" ? "text-white/40 line-through" : "text-white/90 hover:text-white"}`}
                    title={t("edit")}
                  >
                    {task.title}
                  </button>
                )}
              </div>

              {/* Status + Priority row */}
              <div className="flex flex-wrap items-center gap-2 px-5 pb-4 pl-14">
                {/* Clickable status cycle */}
                <button
                  onClick={handleToggleStatus}
                  title={t("cycleStatusTooltip")}
                  className={[
                    "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all hover:opacity-75",
                    task.status === "done"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : task.status === "in_progress"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      : "border-white/[0.10] bg-white/[0.05] text-zinc-400",
                  ].join(" ")}
                >
                  {task.status === "done"
                    ? <Check size={10} />
                    : task.status === "in_progress"
                    ? <Clock size={10} />
                    : <Square size={10} />}
                  {task.status === "done" ? t("statusDone") : task.status === "in_progress" ? t("statusInProgress") : t("statusTodo")}
                </button>
                <span className={`flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium ${priorityCfg.color}`}>
                  <Flag size={9} />
                  {task.priority === "high" ? t("priorityHigh") : task.priority === "medium" ? t("priorityMedium") : t("priorityLow")}
                </span>
              </div>

              {/* Meta */}
              <div className="border-t border-white/[0.05] px-5 py-4">
                <div className="grid grid-cols-2 gap-3">

                  {/* Assignee — clickable */}
                  <div ref={assigneeRef} className="relative">
                    <button
                      onClick={() => { setShowAssigneePicker((v) => !v); setShowDatePicker(false); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.05]"
                    >
                      <User size={13} className="shrink-0 text-zinc-600" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">{t("assignee")}</p>
                        <p className="mt-0.5 truncate text-xs text-white/70">{task.assignee_name ?? t("unassigned")}</p>
                      </div>
                    </button>
                    {showAssigneePicker && (
                      <div className="absolute left-0 top-full z-20 mt-1 w-52 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0D1117] shadow-2xl">
                        <button
                          onClick={() => handleAssigneeChange(null)}
                          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-white/70"
                        >
                          {t("unassigned")}
                        </button>
                        <div className="h-px bg-white/[0.06]" />
                        {members.map((m) => (
                          <button
                            key={m.user_id}
                            onClick={() => handleAssigneeChange(m.user_id)}
                            className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors hover:bg-white/[0.05] ${task.assigned_to === m.user_id ? "text-violet-300" : "text-white/70"}`}
                          >
                            <Avatar name={m.profiles?.full_name ?? null} size={20} />
                            <span className="truncate">{m.profiles?.full_name ?? m.profiles?.email ?? "—"}</span>
                            {task.assigned_to === m.user_id && <Check size={11} className="ml-auto shrink-0 text-violet-400" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Due date — clickable */}
                  <div ref={dateRef} className="relative">
                    <button
                      onClick={() => { setShowDatePicker((v) => !v); setShowAssigneePicker(false); }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.05]"
                    >
                      <Calendar size={13} className="shrink-0 text-zinc-600" />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">{t("dueDate")}</p>
                        <p className={`mt-0.5 text-xs ${task.due_date && new Date(task.due_date) < new Date() && task.status !== "done" ? "text-red-400" : "text-white/70"}`}>
                          {formatDate(task.due_date)}
                        </p>
                      </div>
                    </button>
                    {showDatePicker && (
                      <div className="absolute left-0 top-full z-20 mt-1 rounded-xl border border-white/[0.08] bg-[#0D1117] p-3 shadow-2xl">
                        <input
                          type="date"
                          defaultValue={task.due_date ? task.due_date.slice(0, 10) : ""}
                          onChange={(e) => { if (e.target.value) handleDueDateChange(e.target.value); }}
                          className="block rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white/80 outline-none focus:border-violet-500/40 [color-scheme:dark]"
                          autoFocus
                        />
                        {task.due_date && (
                          <button
                            onClick={() => handleDueDateChange("")}
                            className="mt-2 w-full rounded-lg px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-white/[0.04] hover:text-red-400"
                          >
                            {t("clearDueDate")}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Created — read only */}
                  <div className="flex items-center gap-2.5 px-2 py-1.5">
                    <Clock size={13} className="shrink-0 text-zinc-600" />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">{t("creating")}</p>
                      <p className="mt-0.5 text-xs text-white/70">{formatDateTime(task.created_at)}</p>
                    </div>
                  </div>

                </div>

                {/* Tags */}
                <div className="mt-3 px-2">
                  <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-zinc-600">{t("taskTags")}</p>
                  <TagPicker
                    entityType="task"
                    entityId={task.id}
                    allTags={allTags}
                    initialTags={taskTags}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-white/[0.05] px-5 py-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                    {t("description")}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {editingDescription ? (
                      <>
                        <button
                          onClick={handleDescriptionSave}
                          className="rounded-md px-2 py-0.5 text-[10px] font-medium text-violet-300 transition-colors hover:bg-violet-500/10"
                        >
                          {t("save")}
                        </button>
                        <button
                          onClick={() => { setEditingDescription(false); setDescriptionHtml(task.description ?? ""); }}
                          className="rounded-md px-2 py-0.5 text-[10px] text-zinc-500 transition-colors hover:bg-white/[0.05]"
                        >
                          {t("cancel")}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingDescription(true)}
                        className="flex items-center gap-1 text-[10px] text-zinc-600 transition-colors hover:text-violet-400"
                      >
                        <Pencil size={10} />
                        {t("edit")}
                      </button>
                    )}
                  </div>
                </div>
                {editingDescription ? (
                  <NoteEditor
                    content={descriptionHtml}
                    onChange={setDescriptionHtml}
                    placeholder={t("descriptionPlaceholder")}
                    minHeight="120px"
                  />
                ) : descriptionHtml ? (
                  <div
                    className="note-content text-sm leading-relaxed text-white/55"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(descriptionHtml) }}
                  />
                ) : (
                  <p className="text-xs text-white/20 italic">{t("noDescription")}</p>
                )}
              </div>

              {/* Subtasks */}
              <div className="border-t border-white/[0.05] px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                      {t("subtasks")}
                    </p>
                    {task.subtasks.length > 0 && (
                      <span className="text-[10px] text-zinc-600">
                        {doneCount}/{task.subtasks.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowSubtaskInput((v) => !v)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-zinc-500 transition-colors hover:bg-white/[0.05] hover:text-violet-300"
                  >
                    <Plus size={11} />
                    {t("addSubtask")}
                  </button>
                </div>

                {task.subtasks.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {task.subtasks.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => onNavigateToTask?.(sub.id)}
                        className={`group flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.05] ${onNavigateToTask ? "cursor-pointer" : ""}`}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleSubtask(sub.id, sub.status); }}
                          className={`shrink-0 transition-colors ${sub.status === "done" ? "text-emerald-400" : "text-zinc-600 hover:text-emerald-400"}`}
                        >
                          {sub.status === "done"
                            ? <Check size={14} />
                            : <Square size={14} />}
                        </button>
                        <span className={`flex-1 text-sm ${sub.status === "done" ? "text-zinc-600 line-through" : "text-white/75 group-hover:text-violet-300 transition-colors"}`}>
                          {sub.title}
                        </span>
                        <ChevronRight size={11} className="text-zinc-600 transition-colors group-hover:text-violet-400" />
                      </div>
                    ))}
                  </div>
                )}

                {task.subtasks.length === 0 && !showSubtaskInput && (
                  <p className="text-xs text-zinc-700">{t("noSubtasks")}</p>
                )}

                {showSubtaskInput && (
                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                    <input
                      ref={subtaskRef}
                      value={subtaskText}
                      onChange={(e) => setSubtaskText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddSubtask(); if (e.key === "Escape") setShowSubtaskInput(false); }}
                      placeholder={t("subtaskPlaceholder")}
                      className="flex-1 bg-transparent text-sm text-white/80 placeholder-zinc-600 outline-none"
                    />
                    <button
                      onClick={handleAddSubtask}
                      disabled={addingSubtask || !subtaskText.trim()}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-600 text-white transition-opacity disabled:opacity-40 hover:bg-violet-500"
                    >
                      {addingSubtask ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="border-t border-white/[0.05] px-5 py-4">
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare size={12} className="text-zinc-600" />
                  <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                    {t("comments")}
                    {task.comments.length > 0 && (
                      <span className="ml-1.5 text-zinc-700">({task.comments.length})</span>
                    )}
                  </p>
                </div>

                {task.comments.length === 0 && (
                  <p className="mb-3 text-xs text-zinc-700">{t("noComments")}</p>
                )}

                {task.comments.length > 0 && (
                  <div className="mb-4 space-y-3">
                    {task.comments.map((comment) => (
                      <div key={comment.id} className="group">
                        <div className="flex items-start gap-2.5">
                          <Avatar name={comment.author_name} size={26} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-white/70">
                                {comment.author_name ?? "Unknown"}
                              </span>
                              <span className="text-[10px] text-zinc-700">
                                {formatDateTime(comment.created_at)}
                              </span>
                              {comment.user_id === currentUserId && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="ml-auto hidden text-zinc-700 transition-colors hover:text-red-400 group-hover:flex"
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </div>
                            <GunimiCard className="mt-1.5 px-3 py-2.5">
                              {comment.content.trimStart().startsWith("<") ? (
                                <CommentContent
                                  html={comment.content}
                                  tags={allTags}
                                  members={members}
                                />
                              ) : (
                                <p className="text-xs leading-relaxed text-white/60 whitespace-pre-wrap">
                                  {comment.content}
                                </p>
                              )}
                            </GunimiCard>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment input */}
                <div className="flex items-start gap-2.5">
                  <Avatar name={currentUserName} size={26} />
                  <div className="flex-1">
                    <CommentEditor
                      onSubmit={handlePostComment}
                      submitting={submittingComment}
                      resetKey={commentResetKey}
                      tags={allTags}
                      members={members}
                    />
                  </div>
                </div>
              </div>

              {/* Export footer */}
              <div className="border-t border-white/[0.05] px-5 py-4">
                <button
                  onClick={handleDownload}
                  className="flex w-full items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-left transition-colors hover:bg-white/[0.05]"
                >
                  <div>
                    <p className="text-xs font-medium text-white/70">{t("downloadReport")}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-600">{t("exportDescription")}</p>
                  </div>
                  <Download size={14} className="text-zinc-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
