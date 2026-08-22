"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Clock, CheckCircle2, CircleDot, GripVertical, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Task, WorkspaceMember } from "@/types/task";
import { updateTask } from "@/server/actions/tasks/updateTask";
import GunimiButton from "@/components/ui/GunimiButton";
import { stripHtml } from "@/lib/utils/stripHtml";

type Status = "todo" | "in_progress" | "done";

type Props = {
  tasks: Task[];
  members: WorkspaceMember[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onTasksChange: (tasks: Task[]) => void;
};

const COLUMNS: { id: Status; labelKey: string; icon: typeof CircleDot; color: string; border: string; bg: string; dot: string }[] = [
  {
    id: "todo",
    labelKey: "statusTodo",
    icon: CircleDot,
    color: "text-zinc-400",
    border: "border-zinc-500/20",
    bg: "bg-zinc-500/[0.06]",
    dot: "bg-zinc-500",
  },
  {
    id: "in_progress",
    labelKey: "statusInProgress",
    icon: Clock,
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/[0.06]",
    dot: "bg-violet-500",
  },
  {
    id: "done",
    labelKey: "statusDone",
    icon: CheckCircle2,
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/[0.06]",
    dot: "bg-emerald-500",
  },
];

function priorityDot(priority: string) {
  if (priority === "high") return "bg-red-500";
  if (priority === "medium") return "bg-amber-500";
  return "bg-zinc-600";
}

function dueDateColor(date?: string | null, status?: string): string {
  if (!date || status === "done") return "text-zinc-500";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  if (due < today) return "text-red-400";
  if (due.getTime() === today.getTime()) return "text-amber-400";
  return "text-zinc-500";
}

function getInitial(userId: string | null | undefined, members: WorkspaceMember[]): string {
  if (!userId) return "?";
  const m = members.find((m) => m.user_id === userId);
  const name = m?.profiles?.full_name || m?.profiles?.email || "";
  return name.charAt(0).toUpperCase() || "?";
}

export default function KanbanView({ tasks, members, onEdit, onDelete, onTasksChange }: Props) {
  const t = useTranslations("tasks");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<Status | null>(null);
  const dragTaskRef = useRef<Task | null>(null);

  function handleDragStart(task: Task) {
    setDraggingId(task.id);
    dragTaskRef.current = task;
  }

  function handleDragEnd() {
    setDraggingId(null);
    setOverColumn(null);
    dragTaskRef.current = null;
  }

  async function handleDrop(targetStatus: Status) {
    const task = dragTaskRef.current;
    if (!task || task.status === targetStatus) {
      handleDragEnd();
      return;
    }

    // Optimistic update
    onTasksChange(
      tasks.map((t) => (t.id === task.id ? { ...t, status: targetStatus } : t))
    );

    handleDragEnd();

    const ok = await updateTask({ id: task.id, status: targetStatus });
    if (!ok) {
      // Revert
      onTasksChange(
        tasks.map((t) => (t.id === task.id ? { ...t, status: task.status } : t))
      );
      toast.error(t("failedToUpdate"));
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((task) => task.status === col.id);
        const isOver = overColumn === col.id;
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            onDragOver={(e) => { e.preventDefault(); setOverColumn(col.id); }}
            onDragLeave={() => setOverColumn(null)}
            onDrop={() => handleDrop(col.id)}
            className={[
              "flex flex-col gap-2 rounded-2xl border p-3 transition-all",
              col.border,
              isOver ? col.bg : "bg-transparent",
            ].join(" ")}
          >
            {/* Column header */}
            <div className="mb-1 flex items-center gap-2 px-1">
              <div className={`h-2 w-2 rounded-full ${col.dot}`} />
              <Icon size={13} className={col.color} />
              <span className={`text-xs font-semibold uppercase tracking-widest ${col.color}`}>
                {t(col.labelKey)}
              </span>
              <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/40">
                {colTasks.length}
              </span>
            </div>

            {/* Cards */}
            {colTasks.map((task) => {
              const isDragging = draggingId === task.id;
              const dateColor = dueDateColor(task.due_date, task.status);

              return (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onDragEnd={handleDragEnd}
                  className={[
                    "group relative rounded-xl border border-white/[0.07] bg-white/[0.03]",
                    "p-3.5 transition-all cursor-grab active:cursor-grabbing",
                    isDragging ? "opacity-40 scale-95" : "hover:border-white/[0.12] hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  {/* Drag handle */}
                  <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical size={12} className="text-white/20" />
                  </div>

                  {/* Title */}
                  <p className={[
                    "pr-4 text-sm font-medium leading-snug",
                    task.status === "done" ? "text-zinc-500 line-through" : "text-white/90",
                  ].join(" ")}>
                    {task.title}
                  </p>

                  {/* Description */}
                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                      {stripHtml(task.description)}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-3 flex items-center gap-2">
                    {/* Priority dot */}
                    <div
                      className={`h-2 w-2 rounded-full ${priorityDot(task.priority)}`}
                      title={t(`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`)}
                    />

                    {/* Due date */}
                    {task.due_date && (
                      <span className={`text-[10px] font-medium ${dateColor}`}>
                        {new Date(task.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    )}

                    {/* Assignee avatar */}
                    {task.assigned_to && (
                      <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.08] text-[9px] font-bold text-white/50">
                        {getInitial(task.assigned_to, members)}
                      </div>
                    )}
                  </div>

                  {/* Actions on hover */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <GunimiButton
                      variant="secondary"
                      className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                    >
                      <Pencil size={10} />
                    </GunimiButton>
                    <GunimiButton
                      variant="danger"
                      className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); onDelete(task); }}
                    >
                      <Trash2 size={10} />
                    </GunimiButton>
                  </div>
                </div>
              );
            })}

            {/* Empty column placeholder */}
            {colTasks.length === 0 && (
              <div className={[
                "flex h-20 items-center justify-center rounded-xl border border-dashed",
                col.border,
                "text-[11px] text-white/20",
              ].join(" ")}>
                {t("kanbanEmpty")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
