"use client";

import { useState } from "react";

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

import OrbitField from "@/components/ui/OrbitField";
import OrbitInput from "@/components/ui/OrbitInput";
import OrbitButton from "@/components/ui/OrbitButton";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateWorkspaceSheet({ open, onOpenChange }: Props) {
  const t = useTranslations("workspace");
  const tc = useTranslations("common");

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  function reset() {
    setName("");
  }

  function handleClose() {
    if (loading) return;
    reset();
    onOpenChange(false);
  }

  async function handleSubmit() {
    if (!name.trim()) {
      toast.error(t("workspaceNameRequired"));
      return;
    }

    try {
      setLoading(true);

      const workspace = await createWorkspace({
        name: name.trim(),
      });

      if (!workspace) {
        toast.error(t("failedToCreate"));
        return;
      }

      // Switch to new workspace
      await setActiveWorkspace(workspace.id);

      toast.success(t("workspaceCreated"));

      reset();
      onOpenChange(false);

      // Hard redirect to pick up the new workspace cookie
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      toast.error(t("failedToCreate"));
    } finally {
      setLoading(false);
    }
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
          <SheetTitle>{t("newWorkspaceTitle")}</SheetTitle>
          <SheetDescription>{t("newWorkspaceSubtitle")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <OrbitField label={t("workspaceName")}>
            <OrbitInput
              value={name}
              disabled={loading}
              placeholder={t("workspaceNamePlaceholder")}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </OrbitField>
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
            {loading ? t("creating") : t("createWorkspace")}
          </OrbitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
