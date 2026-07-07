"use client";

import { useState, useTransition } from "react";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { createWorkspace } from "@/server/actions/workspace/createWorkspace";
import { setActiveWorkspace } from "@/server/actions/workspace/setActiveWorkspace";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";

import GunimiButton from "@/components/ui/GunimiButton";
import GunimiField from "@/components/ui/GunimiField";
import GunimiInput from "@/components/ui/GunimiInput";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateWorkspaceSheet({ open, onOpenChange }: Props) {
  const t = useTranslations("workspace");
  const tc = useTranslations("common");

  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");

  function handleClose() {
    setName("");
    onOpenChange(false);
  }

  function handleCreate() {
    if (!name.trim()) return;

    startTransition(async () => {
      const workspace = await createWorkspace({ name: name.trim() });

      if (!workspace) {
        toast.error(t("failedToCreate"));
        return;
      }

      await setActiveWorkspace(workspace.id);

      toast.success(t("workspaceCreated"));
      handleClose();
      window.location.href = "/dashboard";
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
          <SheetTitle>{t("createWorkspace")}</SheetTitle>
          <SheetDescription>{t("newWorkspaceSubtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          <GunimiField label={t("workspaceName")}>
            <GunimiInput
              value={name}
              disabled={isPending}
              placeholder={t("workspaceNamePlaceholder")}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </GunimiField>
        </div>

        <SheetFooter>
          <GunimiButton variant="secondary" disabled={isPending} onClick={handleClose}>
            {tc("cancel")}
          </GunimiButton>
          <GunimiButton loading={isPending} disabled={!name.trim()} onClick={handleCreate}>
            {t("createWorkspace")}
          </GunimiButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
