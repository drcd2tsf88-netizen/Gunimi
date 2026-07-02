"use client";

import { useState, useTransition } from "react";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { updateNote } from "@/server/actions/notes/updateNote";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

import OrbitButton from "@/components/ui/OrbitButton";
import OrbitField from "@/components/ui/OrbitField";
import OrbitInput from "@/components/ui/OrbitInput";
import OrbitTextarea from "@/components/ui/OrbitTextarea";

type Note = {
  id: string;
  title: string;
  content?: string;
};

type Props = {
  note: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

export default function EditNoteSheet({
  note,
  open,
  onOpenChange,
  onSaved,
}: Props) {
  const t = useTranslations("notes");
  const tc = useTranslations("common");

  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(note.title ?? "");
  const [content, setContent] = useState(note.content ?? "");

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevNoteId, setPrevNoteId] = useState(note.id);

  if (open !== prevOpen || note.id !== prevNoteId) {
    setPrevOpen(open);
    setPrevNoteId(note.id);
    if (open) {
      setTitle(note.title ?? "");
      setContent(note.content ?? "");
    }
  }

  function handleClose() {
    onOpenChange(false);
  }

  function handleSave() {
    if (!title.trim()) {
      toast.error(t("titleRequired"));
      return;
    }

    startTransition(async () => {
      const result = await updateNote({
        noteId: note.id,
        title,
        content,
      });

      if (result) {
        toast.success(t("noteUpdated"));
        onSaved();
        onOpenChange(false);
      } else {
        toast.error(t("failedToUpdateNote"));
      }
    });
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
        else onOpenChange(next);
      }}
    >
      <SheetContent className="max-w-md">
        <SheetHeader>
          <SheetTitle>{t("editNote")}</SheetTitle>
          <SheetDescription>{t("editNoteSubtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          <OrbitField label={t("noteTitlePlaceholder")}>
            <OrbitInput
              value={title}
              disabled={isPending}
              placeholder={t("noteTitlePlaceholder")}
              onChange={(e) => setTitle(e.target.value)}
            />
          </OrbitField>

          <OrbitField label={t("writePlaceholder")}>
            <OrbitTextarea
              value={content}
              disabled={isPending}
              placeholder={t("writePlaceholder")}
              className="min-h-[200px]"
              onChange={(e) => setContent(e.target.value)}
            />
          </OrbitField>
        </div>

        <SheetFooter>
          <OrbitButton variant="secondary" disabled={isPending} onClick={handleClose}>
            {tc("cancel")}
          </OrbitButton>
          <OrbitButton loading={isPending} onClick={handleSave}>
            {tc("save")}
          </OrbitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
