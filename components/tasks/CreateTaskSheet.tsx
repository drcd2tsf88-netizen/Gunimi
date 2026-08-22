"use client";

import { useState, useRef } from "react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { createTask } from "@/server/actions/tasks/createTask";
import { updateTask } from "@/server/actions/tasks/updateTask";

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import GunimiTextarea from "@/components/ui/GunimiTextarea";
import GunimiField from "@/components/ui/GunimiField";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RefreshCw } from "lucide-react";
import { Task, WorkspaceMember } from "@/types/task";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSaved: (saved: Task, isEdit: boolean) => void;
  members: WorkspaceMember[];
};

const STATUSES = ["todo", "in_progress", "done"] as const;
const PRIORITIES = ["low", "medium", "high"] as const;

export default function CreateTaskSheet({
  open,
  onOpenChange,
  task,
  onSaved,
  members,
}: Props) {
  const t = useTranslations("tasks");
  const tc = useTranslations("common");

  const isEdit = !!task;

  const descRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState(task?.priority ?? "medium");
  const [status, setStatus] = useState(task?.status ?? "todo");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to ?? "none");
  const [isRecurring, setIsRecurring] = useState(task?.is_recurring ?? false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(
    task?.recurrence_frequency ?? "weekly"
  );

  function resetForm() {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setPriority(task?.priority ?? "medium");
    setStatus(task?.status ?? "todo");
    setDueDate(task?.due_date ?? "");
    setAssignedTo(task?.assigned_to ?? "none");
    setIsRecurring(task?.is_recurring ?? false);
    setRecurrenceFrequency(task?.recurrence_frequency ?? "weekly");
  }

  function handleClose() {
    resetForm();
    onOpenChange(false);
  }

  async function handleSubmit() {
    if (!title.trim()) {
      toast.error(t("titleRequired"));
      return;
    }

    const toastId = "orbit-task-save";

    try {
      setLoading(true);
      toast.loading(isEdit ? t("saving") : t("creating"), { id: toastId });

      if (isEdit && task) {
        const ok = await updateTask({
          id: task.id,
          title: title.trim(),
          description: description || null,
          priority,
          status,
          due_date: dueDate || null,
          assigned_to: assignedTo !== "none" ? assignedTo : null,
          is_recurring: isRecurring,
          recurrence_frequency: isRecurring ? recurrenceFrequency : null,
          recurrence_interval: 1,
        });

        if (!ok) {
          toast.error(t("failedToUpdate"), { id: toastId });
          return;
        }

        toast.success(t("taskUpdated"), { id: toastId });
        resetForm();
        onSaved(
          {
            ...task,
            title: title.trim(),
            description: description || null,
            priority,
            status,
            due_date: dueDate || null,
            assigned_to: assignedTo !== "none" ? assignedTo : null,
            is_recurring: isRecurring,
            recurrence_frequency: isRecurring ? recurrenceFrequency : null,
          },
          true,
        );
      } else {
        const result = await createTask({
          title: title.trim(),
          description,
          priority,
          status,
          due_date: dueDate || null,
          assigned_to: assignedTo !== "none" ? assignedTo : null,
          is_recurring: isRecurring,
          recurrence_frequency: isRecurring ? recurrenceFrequency : null,
          recurrence_interval: 1,
        });

        if (!result) {
          toast.error(t("failedToCreate"), { id: toastId });
          return;
        }

        toast.success(t("taskCreated"), { id: toastId });
        resetForm();
        onSaved(result as Task, false);
      }
    } catch {
      toast.error(isEdit ? t("failedToUpdate") : t("failedToCreate"), { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  const statusLabels: Record<string, string> = {
    todo: t("statusTodo"),
    in_progress: t("statusInProgress"),
    done: t("statusDone"),
  };

  const priorityLabels: Record<string, string> = {
    low: t("priorityLow"),
    medium: t("priorityMedium"),
    high: t("priorityHigh"),
  };

  function getMemberLabel(member: WorkspaceMember): string {
    return member.profiles?.full_name || member.profiles?.email || member.user_id;
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
        else onOpenChange(next);
      }}
    >
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isEdit ? t("editTask") : t("createTask")}
          </SheetTitle>

          <SheetDescription>
            {isEdit ? t("editTaskSubtitle") : t("createTaskSubtitle")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <GunimiField label={t("taskTitle")}>
            <GunimiInput
              value={title}
              disabled={loading}
              placeholder={t("titlePlaceholder")}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  descRef.current?.focus();
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  descRef.current?.focus();
                }
              }}
            />
          </GunimiField>

          <GunimiField label={t("description")}>
            <GunimiTextarea
              ref={descRef}
              value={description}
              disabled={loading}
              placeholder={t("descriptionPlaceholder")}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </GunimiField>

          <div className="grid gap-4 sm:grid-cols-2">
            <GunimiField label={t("taskStatus")}>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GunimiField>

            <GunimiField label={t("taskPriority")}>
              <Select
                value={priority}
                onValueChange={setPriority}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {priorityLabels[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </GunimiField>
          </div>

          <GunimiField label={t("dueDate")}>
            <GunimiInput
              type="date"
              value={dueDate}
              disabled={loading}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </GunimiField>

          <GunimiField label={t("assignee")}>
            <Select
              value={assignedTo}
              onValueChange={setAssignedTo}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("unassigned")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">{t("unassigned")}</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.user_id} value={member.user_id}>
                    {getMemberLabel(member)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GunimiField>

          {/* RECURRING */}

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsRecurring((v) => !v)}
              className="flex w-full items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <RefreshCw
                  size={14}
                  className={isRecurring ? "text-violet-400" : "text-zinc-600"}
                />
                <span className="text-sm text-white/70">{t("recurring")}</span>
              </div>

              <div
                className={`
                  h-5 w-9 rounded-full transition-colors
                  ${isRecurring ? "bg-violet-500" : "bg-white/10"}
                `}
              >
                <div
                  className={`
                    mt-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform
                    ${isRecurring ? "translate-x-4.5" : "translate-x-0.5"}
                  `}
                />
              </div>
            </button>

            {isRecurring && (
              <div className="mt-4">
                <Select
                  value={recurrenceFrequency}
                  onValueChange={setRecurrenceFrequency}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="daily">{t("freqDaily")}</SelectItem>
                    <SelectItem value="weekly">{t("freqWeekly")}</SelectItem>
                    <SelectItem value="monthly">{t("freqMonthly")}</SelectItem>
                    <SelectItem value="yearly">{t("freqYearly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <SheetFooter>
          <GunimiButton
            variant="secondary"
            disabled={loading}
            onClick={handleClose}
          >
            {tc("cancel")}
          </GunimiButton>

          <GunimiButton loading={loading} onClick={handleSubmit}>
            {isEdit ? tc("save") : t("createTask")}
          </GunimiButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
