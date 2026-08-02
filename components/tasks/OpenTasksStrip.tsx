"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, CheckSquare2, ChevronRight, Clock, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiButton from "@/components/ui/GunimiButton";
import { createTask } from "@/server/actions/tasks/createTask";

type OpenTask = {
  id: string;
  title: string;
  status: string;
  priority?: string | null;
  due_date?: string | null;
};

type Props = {
  tasks: OpenTask[];
  contactId?: string | null;
  onTaskCreated?: (task: OpenTask) => void;
};

const NOW_STR = new Date().toISOString().slice(0, 10);

export default function OpenTasksStrip({ tasks, contactId, onTaskCreated }: Props) {
  const t = useTranslations("taskFocus");
  const open = tasks.filter((t) => t.status !== "done");
  const overdue = open.filter((t) => t.due_date && t.due_date.slice(0, 10) < NOW_STR);

  const [addingTask, setAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isPending, startCreate] = useTransition();

  if (open.length === 0 && !addingTask) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-white/25">
          <CheckSquare2 size={13} />
          <span>{t("noOpenTasks")}</span>
        </div>
        <button
          onClick={() => setAddingTask(true)}
          className="flex items-center gap-1 text-[11px] text-white/25 transition-colors hover:text-violet-400"
        >
          <Plus size={11} />
          {t("quickAdd")}
        </button>
      </div>
    );
  }

  function handleCreate() {
    const title = newTitle.trim();
    if (!title) return;
    startCreate(async () => {
      const result = await createTask({ title, contactId: contactId ?? null });
      if (result) {
        toast.success(t("taskCreated"));
        onTaskCreated?.({
          id: result.id as string,
          title: result.title as string,
          status: result.status as string,
          priority: result.priority as string | null,
          due_date: result.due_date as string | null,
        });
        setNewTitle("");
        setAddingTask(false);
      } else {
        toast.error(t("taskCreateFailed"));
      }
    });
  }

  return (
    <GunimiCard className="p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckSquare2 size={13} className="text-zinc-500" />
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            {t("openTasksLabel")}
          </span>
          {open.length > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              overdue.length > 0
                ? "bg-rose-500/15 text-rose-400"
                : "bg-white/[0.06] text-zinc-400"
            }`}>
              {open.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddingTask((v) => !v)}
            className="flex items-center gap-1 text-[11px] text-white/25 transition-colors hover:text-violet-400"
          >
            {addingTask ? <X size={11} /> : <Plus size={11} />}
            {addingTask ? t("cancel") : t("quickAdd")}
          </button>
          {open.length > 0 && (
            <Link
              href="/dashboard/tasks"
              className="flex items-center gap-0.5 text-[11px] text-white/25 transition-colors hover:text-white/60"
            >
              {t("viewAll")}
              <ChevronRight size={10} />
            </Link>
          )}
        </div>
      </div>

      {/* Quick add input */}
      {addingTask && (
        <div className="mb-3 flex items-center gap-2">
          <GunimiInput
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") { setAddingTask(false); setNewTitle(""); }
            }}
            placeholder={t("taskTitlePlaceholder")}
            className="h-8 text-xs"
          />
          <GunimiButton
            onClick={handleCreate}
            disabled={isPending || !newTitle.trim()}
            loading={isPending}
            className="shrink-0 px-3 py-1.5 text-[11px]"
          >
            {t("add")}
          </GunimiButton>
        </div>
      )}

      {/* Task list */}
      {open.length > 0 && (
        <ul className="space-y-2">
          {open.slice(0, 4).map((task) => {
            const isOverdue = task.due_date && task.due_date.slice(0, 10) < NOW_STR;
            const isToday = task.due_date && task.due_date.slice(0, 10) === NOW_STR;

            return (
              <li key={task.id} className="flex items-center gap-2.5">
                {task.priority === "high" ? (
                  <AlertCircle size={11} className="shrink-0 text-rose-400" />
                ) : (
                  <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    isOverdue ? "bg-rose-400/60" : isToday ? "bg-amber-400/60" : "bg-zinc-600"
                  }`} />
                )}
                <span className="min-w-0 flex-1 truncate text-xs text-white/70">{task.title}</span>
                {task.due_date && (
                  <span className={`shrink-0 flex items-center gap-1 text-[10px] ${
                    isOverdue ? "text-rose-400/70" : isToday ? "text-amber-400/70" : "text-zinc-600"
                  }`}>
                    <Clock size={9} />
                    {task.due_date.slice(5, 10)}
                  </span>
                )}
              </li>
            );
          })}
          {open.length > 4 && (
            <li className="pl-4 text-[11px] text-white/25">
              +{open.length - 4} {t("moreTasks")}
            </li>
          )}
        </ul>
      )}
    </GunimiCard>
  );
}
