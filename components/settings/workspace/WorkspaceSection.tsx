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

import { WorkspaceSettings } from "@/server/actions/workspace/getWorkspaceSettings";
import { WorkspaceSummary } from "@/server/actions/workspace/getUserWorkspaceSummaries";

type Props = {
  workspace: WorkspaceSettings;
  workspaceSummaries: WorkspaceSummary[];
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

export default function WorkspaceSection({ workspace, workspaceSummaries }: Props) {
  const t = useTranslations("settings");
  const router = useRouter();

  const [name, setName] = useState(workspace.name ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    if (!name.trim()) {
      toast.error(t("workspaceNameRequired"));
      return;
    }

    startTransition(async () => {
      const ok = await updateWorkspace({
        name: name.trim(),
      });

      if (ok) {
        toast.success(t("workspaceUpdated"));
        router.refresh();
      } else {
        toast.error(t("failedToUpdate"));
      }
    });
  }

  const isDirty = name.trim() !== workspace.name;

  return (
    <div className="space-y-6">
      {/* IDENTITY */}
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

      {/* MY WORKSPACES DIRECTORY */}
      {workspaceSummaries.length > 0 && (
        <div>
          <div className="mb-3">
            <h2 className="text-xl font-semibold">{t("myWorkspaces")}</h2>
            <p className="mt-1 text-sm text-white/40">{t("myWorkspacesSubtitle")}</p>
          </div>

          <OrbitCard className="divide-y divide-white/[0.05] overflow-hidden p-0">
            {workspaceSummaries.map((ws) => {
              const isCurrent = ws.id === workspace.id;

              return (
                <div
                  key={ws.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  {/* LEFT — avatar + info */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-sm font-bold text-violet-200">
                      {ws.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{ws.name}</p>
                        {isCurrent && (
                          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                            {t("currentWorkspace")}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-white/30">{ws.slug}</p>
                    </div>
                  </div>

                  {/* RIGHT — role + date */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                        {t("yourRole")}
                      </p>
                      <p className="mt-0.5 text-xs font-medium capitalize text-white/70">
                        {ws.role}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] uppercase tracking-wide text-zinc-500">
                        {t("joinedOn")}
                      </p>
                      <p className="mt-0.5 text-xs text-white/40">
                        {new Date(ws.joined_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </OrbitCard>
        </div>
      )}
    </div>
  );
}
