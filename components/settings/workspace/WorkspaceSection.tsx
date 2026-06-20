"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import toast from "react-hot-toast";

import { updateWorkspace } from "@/server/actions/workspace/updateWorkspace";

import OrbitCard from "@/components/ui/OrbitCard";
import OrbitField from "@/components/ui/OrbitField";
import OrbitInput from "@/components/ui/OrbitInput";
import OrbitButton from "@/components/ui/OrbitButton";
import OrbitTextarea from "@/components/ui/OrbitTextarea";

import { WorkspaceSettings } from "@/server/actions/workspace/getWorkspaceSettings";

type Props = {
  workspace: WorkspaceSettings;
};

function WorkspaceAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "W";

  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-lg font-bold text-violet-200">
      {initials}
    </div>
  );
}

export default function WorkspaceSection({ workspace }: Props) {
  const t = useTranslations("settings");
  const router = useRouter();

  const [name, setName] = useState(workspace.name ?? "");
  const [description, setDescription] = useState(workspace.description ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!name.trim()) {
      toast.error(t("workspaceNameRequired"));
      return;
    }

    startTransition(async () => {
      const ok = await updateWorkspace({
        name: name.trim(),
        description: description.trim() || null,
      });

      if (ok) {
        toast.success(t("workspaceUpdated"));
        router.refresh();
      } else {
        toast.error(t("failedToUpdate"));
      }
    });
  }

  const isDirty =
    name.trim() !== workspace.name ||
    description.trim() !== (workspace.description ?? "");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {t("nav_workspace")}
        </p>
        <h2 className="mt-1.5 text-xl font-semibold">{t("workspaceIdentity")}</h2>
        <p className="mt-1 text-sm text-white/40">{t("workspaceIdentitySubtitle")}</p>
      </div>

      <OrbitCard className="p-6">
        {/* AVATAR + NAME ROW */}
        <div className="flex items-center gap-4">
          <WorkspaceAvatar name={name || workspace.name} />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/35">{t("generatedAvatar")}</p>
            <p className="mt-0.5 text-xs text-white/25">{t("generatedAvatarSubtitle")}</p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <OrbitField label={t("workspaceName")}>
            <OrbitInput
              value={name}
              disabled={isPending}
              placeholder={t("workspaceNamePlaceholder")}
              onChange={(e) => setName(e.target.value)}
            />
          </OrbitField>

          <OrbitField label={t("workspaceDescription")}>
            <OrbitTextarea
              value={description}
              disabled={isPending}
              placeholder={t("workspaceDescriptionPlaceholder")}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[90px]"
            />
          </OrbitField>
        </div>

        <div className="mt-6 flex justify-end">
          <OrbitButton
            onClick={handleSave}
            loading={isPending}
            disabled={!isDirty || isPending}
          >
            {isPending ? t("saving") : t("saveChanges")}
          </OrbitButton>
        </div>
      </OrbitCard>
    </div>
  );
}
