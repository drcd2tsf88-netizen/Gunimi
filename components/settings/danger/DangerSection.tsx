"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { AlertTriangle, LogOut, Trash2 } from "lucide-react";

import toast from "react-hot-toast";

import { leaveWorkspace } from "@/server/actions/workspace/leaveWorkspace";
import { deleteWorkspace } from "@/server/actions/workspace/deleteWorkspace";

import OrbitButton from "@/components/ui/OrbitButton";
import OrbitInput from "@/components/ui/OrbitInput";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Props = {
  currentUserRole: string;
  workspaceName: string;
};

export default function DangerSection({ currentUserRole, workspaceName }: Props) {
  const t = useTranslations("settings");
  const router = useRouter();

  const [leaveOpen, setLeaveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isPending, startTransition] = useTransition();

  const isOwner = currentUserRole === "owner";

  function handleLeave() {
    startTransition(async () => {
      const result = await leaveWorkspace();

      if (result.ok) {
        toast.success(t("leftWorkspace"));
        router.push("/dashboard");
        router.refresh();
      } else if (result.error === "owner_cannot_leave") {
        toast.error(t("ownerCannotLeave"));
        setLeaveOpen(false);
      } else {
        toast.error(t("failedToLeave"));
      }
    });
  }

  function handleDelete() {
    if (deleteConfirm !== t("confirmDeleteWord")) return;

    startTransition(async () => {
      const result = await deleteWorkspace();

      if (result.ok) {
        toast.success(t("workspaceDeleted"));
        router.push("/");
        router.refresh();
      } else {
        toast.error(t("failedToDelete"));
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          {t("nav_danger")}
        </p>
        <h2 className="mt-1.5 text-xl font-semibold text-red-300/80">{t("dangerZone")}</h2>
        <p className="mt-1 text-sm text-white/40">{t("dangerZoneSubtitle")}</p>
      </div>

      <div className="space-y-3 rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-5">
        {/* LEAVE WORKSPACE */}
        <div className="flex items-start justify-between gap-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
          <div className="flex items-start gap-3">
            <LogOut size={15} className="mt-0.5 shrink-0 text-white/40" />
            <div>
              <p className="text-sm font-medium text-white">{t("leaveWorkspace")}</p>
              <p className="mt-0.5 text-xs text-white/40">{t("leaveWorkspaceDescription")}</p>
            </div>
          </div>

          <OrbitButton
            variant="danger"
            className="shrink-0"
            disabled={isOwner}
            onClick={() => setLeaveOpen(true)}
            title={isOwner ? t("ownerCannotLeave") : undefined}
          >
            {t("leave")}
          </OrbitButton>
        </div>

        {/* DELETE WORKSPACE — owner only */}
        {isOwner && (
          <div className="flex items-start justify-between gap-6 rounded-xl border border-red-500/20 bg-red-500/[0.04] px-5 py-4">
            <div className="flex items-start gap-3">
              <Trash2 size={15} className="mt-0.5 shrink-0 text-red-400/70" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-red-300">{t("deleteWorkspace")}</p>
                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">
                    {t("ownerOnly")}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-white/40">{t("deleteWorkspaceDescription")}</p>
              </div>
            </div>

            <OrbitButton
              variant="danger"
              className="shrink-0"
              onClick={() => { setDeleteConfirm(""); setDeleteOpen(true); }}
            >
              {t("deleteWorkspace")}
            </OrbitButton>
          </div>
        )}
      </div>

      {/* LEAVE CONFIRM */}
      <Dialog open={leaveOpen} onOpenChange={(open) => { if (!open && !isPending) setLeaveOpen(false); }}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5">
              <AlertTriangle size={17} className="text-amber-400" />
              {t("leaveWorkspace")}
            </DialogTitle>
            <DialogDescription>{t("leaveWorkspaceConfirm")}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <OrbitButton variant="secondary" disabled={isPending} onClick={() => setLeaveOpen(false)}>
              {t("cancel")}
            </OrbitButton>
            <OrbitButton variant="danger" loading={isPending} onClick={handleLeave}>
              {t("leave")}
            </OrbitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={deleteOpen} onOpenChange={(open) => { if (!open && !isPending) { setDeleteOpen(false); setDeleteConfirm(""); } }}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-red-300">
              <AlertTriangle size={17} className="text-red-400" />
              {t("deleteWorkspace")}
            </DialogTitle>
            <DialogDescription>
              {t("deleteWorkspaceConfirm", { name: workspaceName })}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            <p className="text-xs text-white/40">{t("typeToConfirm")}</p>
            <OrbitInput
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={t("confirmDeleteWord")}
              disabled={isPending}
            />
          </div>

          <DialogFooter className="mt-6">
            <OrbitButton
              variant="secondary"
              disabled={isPending}
              onClick={() => { setDeleteOpen(false); setDeleteConfirm(""); }}
            >
              {t("cancel")}
            </OrbitButton>
            <OrbitButton
              variant="danger"
              loading={isPending}
              disabled={deleteConfirm !== t("confirmDeleteWord")}
              onClick={handleDelete}
            >
              {isPending ? t("deleting") : t("deleteWorkspace")}
            </OrbitButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
