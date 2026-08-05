"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

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

import { createTeam } from "@/server/actions/organization/createTeam";
import { updateTeam } from "@/server/actions/organization/updateTeam";
import type { WorkspaceTeam } from "@/types/organization";

const TEAM_COLORS = [
  "#6D5BFF", "#3B82F6", "#10B981", "#F59E0B",
  "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6",
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTeam?: WorkspaceTeam | null;
  onSuccess: (team: WorkspaceTeam) => void;
};

export default function TeamSheet({ open, onOpenChange, editTeam, onSuccess }: Props) {
  const t = useTranslations("organization");
  const tc = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(TEAM_COLORS[0]);

  useEffect(() => {
    if (editTeam) {
      setName(editTeam.name);
      setDescription(editTeam.description ?? "");
      setColor(editTeam.color);
    } else {
      setName("");
      setDescription("");
      setColor(TEAM_COLORS[0]);
    }
  }, [editTeam, open]);

  function handleClose() {
    onOpenChange(false);
  }

  function handleSubmit() {
    if (!name.trim()) {
      toast.error(t("teamNameRequired"), { id: "team-sheet" });
      return;
    }

    startTransition(async () => {
      if (editTeam) {
        const ok = await updateTeam({ teamId: editTeam.id, name, description: description || null, color });
        if (ok) {
          toast.success(t("teamUpdated"), { id: "team-sheet" });
          onSuccess({ ...editTeam, name: name.trim(), description: description || null, color });
          handleClose();
        } else {
          toast.error(t("teamUpdateFailed"), { id: "team-sheet" });
        }
      } else {
        const team = await createTeam({ name, description: description || undefined, color });
        if (team) {
          toast.success(t("teamCreated"), { id: "team-sheet" });
          onSuccess(team);
          handleClose();
        } else {
          toast.error(t("teamCreateFailed"), { id: "team-sheet" });
        }
      }
    });
  }

  const isEdit = !!editTeam;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 border-l border-white/[0.06] bg-[#080C14] p-0 sm:max-w-md">
        <SheetHeader className="border-b border-white/[0.06] px-6 py-5">
          <SheetTitle className="text-[15px] font-semibold text-[#F7F8FC]">
            {isEdit ? t("editTeam") : t("createTeam")}
          </SheetTitle>
          <SheetDescription className="text-[12px] text-white/35">
            {isEdit ? t("editTeamDescription") : t("createTeamDescription")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <GunimiField label={t("teamName")} required>
            <GunimiInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("teamNamePlaceholder")}
              autoFocus
            />
          </GunimiField>

          <GunimiField label={t("teamDescription")}>
            <GunimiInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("teamDescriptionPlaceholder")}
            />
          </GunimiField>

          <GunimiField label={t("teamColor")}>
            <div className="flex flex-wrap gap-2 pt-1">
              {TEAM_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-7 w-7 rounded-lg border-2 transition-all duration-150"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "#fff" : "transparent",
                    opacity: color === c ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          </GunimiField>
        </div>

        <SheetFooter className="border-t border-white/[0.06] px-6 py-4">
          <div className="flex w-full gap-3">
            <GunimiButton variant="secondary" onClick={handleClose} className="flex-1">
              {tc("cancel")}
            </GunimiButton>
            <GunimiButton
              onClick={handleSubmit}
              loading={isPending}
              disabled={!name.trim() || isPending}
              className="flex-1"
            >
              {isEdit ? tc("save") : t("createTeam")}
            </GunimiButton>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
