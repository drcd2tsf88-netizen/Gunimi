"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiInput from "@/components/ui/GunimiInput";
import NoteEditor from "@/components/notes/NoteEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { createNote } from "@/server/actions/notes/createNote";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactOptions: { id: string; name: string }[];
  companyOptions: { id: string; name: string }[];
};

export default function CreateNoteSheet({
  open,
  onOpenChange,
  contactOptions,
  companyOptions,
}: Props) {
  const t = useTranslations("notes");
  const tc = useTranslations("common");
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contactId, setContactId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [isPending, startCreate] = useTransition();

  function reset() {
    setTitle("");
    setContent("");
    setContactId("");
    setCompanyId("");
  }

  function handleClose() {
    if (!isPending) {
      reset();
      onOpenChange(false);
    }
  }

  function handleCreate() {
    if (!title.trim()) {
      toast.error(t("titleRequired"));
      return;
    }
    startCreate(async () => {
      const result = await createNote({
        title: title.trim(),
        content: content.trim(),
        contactId: contactId || undefined,
        companyId: companyId || undefined,
      });
      if (!result) {
        toast.error(t("failedToCreate"));
        return;
      }
      toast.success(t("noteCreated"));
      reset();
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!isPending) { if (!o) reset(); onOpenChange(o); } }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("newNote")}</DialogTitle>
          <DialogDescription>{t("newNoteSubtitle")}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[70vh] overflow-y-auto space-y-4 pr-1">
          <GunimiInput
            placeholder={t("noteTitlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            autoFocus
          />

          <NoteEditor
            content={content}
            onChange={setContent}
            placeholder={t("writePlaceholder")}
            disabled={isPending}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {t("linkContact")}
              </label>
              <Select
                value={contactId || "__none__"}
                onValueChange={(v) => setContactId(v === "__none__" ? "" : v)}
                disabled={isPending}
              >
                <SelectTrigger className="h-10 w-full px-3 text-sm">
                  <SelectValue placeholder={t("linkContactNone")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t("linkContactNone")}</SelectItem>
                  {contactOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {t("linkCompany")}
              </label>
              <Select
                value={companyId || "__none__"}
                onValueChange={(v) => setCompanyId(v === "__none__" ? "" : v)}
                disabled={isPending}
              >
                <SelectTrigger className="h-10 w-full px-3 text-sm">
                  <SelectValue placeholder={t("linkCompanyNone")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">{t("linkCompanyNone")}</SelectItem>
                  {companyOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <GunimiButton variant="secondary" disabled={isPending} onClick={handleClose}>
            {tc("cancel")}
          </GunimiButton>
          <GunimiButton onClick={handleCreate} loading={isPending}>
            <Plus size={13} />
            {t("createNote")}
          </GunimiButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
