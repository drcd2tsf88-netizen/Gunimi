"use client";

import { useState, useEffect, useTransition } from "react";
import { AlertCircle, CheckSquare2, Clock, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiButton from "@/components/ui/GunimiButton";
import TaskDetailPanel from "@/components/tasks/TaskDetailPanel";

import { createTask } from "@/server/actions/tasks/createTask";
import { createClient } from "@/lib/supabase/client";
import type { ContactTask } from "@/server/actions/crm/getContactTasks";
import type { WorkspaceMember } from "@/types/task";

type Props = {
  tasks: ContactTask[];
  contactId: string;
  members: WorkspaceMember[];
  onTaskCreated?: (task: ContactTask) => void;
};

function getStatusStyles(status: string) {
  switch (status) {
    case "done":      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "in_progress": return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    case "blocked":   return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    default:          return "border-white/10 bg-white/[0.03] text-zinc-300";
  }
}

export default function ContactTasks({ tasks: initialTasks, contactId, members, onTaskCreated }: Props) {
  const t = useTranslations("contacts");
  const tTasks = useTranslations("tasks");
  const tFocus = useTranslations("taskFocus");

  const [localTasks, setLocalTasks] = useState(initialTasks);
  const [prevInitial, setPrevInitial] = useState(initialTasks);
  if (prevInitial !== initialTasks) { setPrevInitial(initialTasks); setLocalTasks(initialTasks); }

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isPending, startCreate] = useTransition();

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });
  }, []);

  function handleCreate() {
    const title = newTitle.trim();
    if (!title) return;
    startCreate(async () => {
      const result = await createTask({ title, contactId });
      if (result) {
        const newTask: ContactTask = {
          id: result.id as string,
          title: result.title as string,
          status: result.status as string,
          priority: result.priority as string | null,
          due_date: result.due_date as string | null,
          created_at: result.created_at as string,
          description: null,
        };
        setLocalTasks((prev) => [newTask, ...prev]);
        onTaskCreated?.(newTask);
        setNewTitle("");
        setAdding(false);
        toast.success(tFocus("taskCreated"), { id: "contact-task-create" });
      } else {
        toast.error(tFocus("taskCreateFailed"), { id: "contact-task-create" });
      }
    });
  }

  return (
    <GunimiSection>
      <div className="flex items-start justify-between gap-4">
        <GunimiHeading
          badge={t("tasksBadge")}
          title={t("tasks")}
          subtitle={t("tasksSubtitle")}
        />
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[12px] text-white/40 transition-all hover:border-white/[0.12] hover:text-violet-400"
        >
          {adding ? <X size={11} /> : <Plus size={11} />}
          {adding ? tFocus("cancel") : tFocus("quickAdd")}
        </button>
      </div>

      {adding && (
        <div className="flex items-center gap-2">
          <GunimiInput
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") { setAdding(false); setNewTitle(""); }
            }}
            placeholder={tFocus("taskTitlePlaceholder")}
            className="h-8 text-xs"
          />
          <GunimiButton
            onClick={handleCreate}
            disabled={isPending || !newTitle.trim()}
            loading={isPending}
            className="shrink-0 px-3 py-1.5 text-[11px]"
          >
            {tFocus("add")}
          </GunimiButton>
        </div>
      )}

      {localTasks.length === 0 && !adding ? (
        <GunimiEmptyState
          title={t("noTasks")}
          description={t("noTasksDescription")}
          icon={CheckSquare2}
        />
      ) : (
        <div className="space-y-3">
          {localTasks.map((task) => {
            const isOverdue =
              task.status !== "done" &&
              task.due_date &&
              new Date(task.due_date) < new Date();

            return (
              <GunimiCard
                key={task.id}
                className="cursor-pointer p-4 transition-colors hover:border-violet-500/25 hover:bg-violet-500/[0.03]"
                onClick={() => setSelectedTaskId(task.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-2.5">
                    {task.priority === "high" && (
                      <AlertCircle size={12} className="mt-0.5 shrink-0 text-rose-400" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{task.title}</p>
                      {task.description && (
                        <p className="mt-1 truncate text-xs text-white/50">
                          {task.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}
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
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wide ${getStatusStyles(task.status)}`}>
                      {tTasks(
                        task.status === "done" ? "statusDone"
                          : task.status === "in_progress" ? "statusInProgress"
                          : "statusTodo"
                      )}
                    </span>
                  </div>
                </div>
              </GunimiCard>
            );
          })}
        </div>
      )}

      <TaskDetailPanel
        taskId={selectedTaskId}
        currentUserId={currentUserId}
        members={members}
        onClose={() => setSelectedTaskId(null)}
        onNavigateToTask={(subId) => setSelectedTaskId(subId)}
      />
    </GunimiSection>
  );
}
