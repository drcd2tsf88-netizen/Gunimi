"use client";

import { useState, useEffect } from "react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { createTask } from "@/server/actions/tasks/createTask";
import { updateTask } from "@/server/actions/tasks/updateTask";

import OrbitButton from "@/components/ui/OrbitButton";
import OrbitInput from "@/components/ui/OrbitInput";
import OrbitTextarea from "@/components/ui/OrbitTextarea";
import OrbitField from "@/components/ui/OrbitField";

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

import { Task, WorkspaceMember } from "@/types/task";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSaved: () => void;
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

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setPriority(task?.priority ?? "medium");
      setStatus(task?.status ?? "todo");
      setDueDate(task?.due_date ?? "");
      setAssignedTo(task?.assigned_to ?? "");
    }
  }, [open, task]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setDueDate("");
    setAssignedTo("");
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

    try {
      setLoading(true);

      if (isEdit && task) {
        const ok = await updateTask({
          id: task.id,
          title: title.trim(),
          description: description || null,
          priority,
          status,
          due_date: dueDate || null,
          assigned_to: assignedTo || null,
        });

        if (!ok) {
          toast.error(t("failedToUpdate"));
          return;
        }

        toast.success(t("taskUpdated"));
      } else {
        const result = await createTask({
          title: title.trim(),
          description,
          priority,
          status,
          due_date: dueDate || null,
          assigned_to: assignedTo || null,
        });

        if (!result) {
          toast.error(t("failedToCreate"));
          return;
        }

        toast.success(t("taskCreated"));
      }

      resetForm();
      onSaved();
    } catch (err) {
      console.error(err);
      toast.error(isEdit ? t("failedToUpdate") : t("failedToCreate"));
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
          <OrbitField label={t("taskTitle")}>
            <OrbitInput
              value={title}
              disabled={loading}
              placeholder={t("titlePlaceholder")}
              onChange={(e) => setTitle(e.target.value)}
            />
          </OrbitField>

          <OrbitField label={t("description")}>
            <OrbitTextarea
              value={description}
              disabled={loading}
              placeholder={t("descriptionPlaceholder")}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </OrbitField>

          <div className="grid grid-cols-2 gap-4">
            <OrbitField label={t("taskStatus")}>
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
            </OrbitField>

            <OrbitField label={t("taskPriority")}>
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
            </OrbitField>
          </div>

          <OrbitField label={t("dueDate")}>
            <OrbitInput
              type="date"
              value={dueDate}
              disabled={loading}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </OrbitField>

          {members.length > 0 && (
            <OrbitField label={t("assignee")}>
              <Select
                value={assignedTo}
                onValueChange={setAssignedTo}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("unassigned")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="">{t("unassigned")}</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.user_id} value={member.user_id}>
                      {getMemberLabel(member)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </OrbitField>
          )}
        </div>

        <SheetFooter>
          <OrbitButton
            variant="secondary"
            disabled={loading}
            onClick={handleClose}
          >
            {tc("cancel")}
          </OrbitButton>

          <OrbitButton loading={loading} onClick={handleSubmit}>
            {isEdit ? tc("save") : t("createTask")}
          </OrbitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
