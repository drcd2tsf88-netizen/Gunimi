"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { useTranslations } from "next-intl";

import { Mail, UserPlus, Users } from "lucide-react";

import toast from "react-hot-toast";

import { removeMember } from "@/server/actions/workspace/removeMember";
import { revokeInvite } from "@/server/actions/workspace/revokeInvite";

import { WorkspaceInvite } from "@/server/actions/workspace/getWorkspaceInvites";

import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import MemberRow, { MemberRowData } from "./MemberRow";
import InviteMemberSheet from "./InviteMemberSheet";

type Props = {
  members: MemberRowData[];
  invites: WorkspaceInvite[];
  currentUserId: string;
  currentUserRole: string;
};

export default function MembersSection({ members, invites, currentUserId, currentUserRole }: Props) {
  const t = useTranslations("settings");
  const router = useRouter();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removingName, setRemovingName] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleRemoveRequest(memberId: string, name: string) {
    setRemovingId(memberId);
    setRemovingName(name);
  }

  function handleRemoveConfirm() {
    if (!removingId) return;
    const id = removingId;
    setRemovingId(null);

    startTransition(async () => {
      const ok = await removeMember(id);
      if (ok) {
        toast.success(t("memberRemoved"));
        router.refresh();
      } else {
        toast.error(t("failedToRemoveMember"));
      }
    });
  }

  function handleRevoke(inviteId: string) {
    startTransition(async () => {
      const ok = await revokeInvite(inviteId);
      if (ok) {
        toast.success(t("inviteRevoked"));
        router.refresh();
      } else {
        toast.error(t("failedToRevoke"));
      }
    });
  }

  const canInvite = ["owner", "admin"].includes(currentUserRole);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {t("nav_members")}
          </p>
          <h2 className="mt-1.5 text-xl font-semibold">{t("membersTitle")}</h2>
          <p className="mt-1 text-sm text-white/40">
            {members.length} {t("membersCount")}
          </p>
        </div>

        {canInvite && (
          <GunimiButton onClick={() => setInviteOpen(true)}>
            <UserPlus size={14} />
            {t("inviteMember")}
          </GunimiButton>
        )}
      </div>

      {/* MEMBERS LIST */}
      <GunimiCard className="p-5">
        {members.length === 0 ? (
          <GunimiEmptyState
            icon={Users}
            title={t("noMembers")}
            description={t("noMembersDescription")}
          />
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                currentUserId={currentUserId}
                currentUserRole={currentUserRole}
                onRemoveRequest={handleRemoveRequest}
              />
            ))}
          </div>
        )}
      </GunimiCard>

      {/* PENDING INVITES */}
      {invites.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {t("pendingInvites")} · {invites.length}
          </p>

          <GunimiCard className="divide-y divide-white/[0.05] p-0 overflow-hidden">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center gap-4 px-5 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02]">
                  <Mail size={13} className="text-white/35" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/80">{invite.email}</p>
                  <p className="mt-0.5 text-xs text-white/30">
                    {t("invited")}{" "}
                    {new Date(invite.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-300">
                  {t("pending")}
                </span>

                {canInvite && (
                  <GunimiButton
                    variant="secondary"
                    className="h-8 px-3 text-xs"
                    disabled={isPending}
                    onClick={() => handleRevoke(invite.id)}
                  >
                    {t("revokeInvite")}
                  </GunimiButton>
                )}
              </div>
            ))}
          </GunimiCard>
        </div>
      )}

      {/* INVITE SHEET */}
      <InviteMemberSheet
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvited={() => router.refresh()}
      />

      {/* REMOVE CONFIRM DIALOG */}
      <Dialog open={!!removingId} onOpenChange={(open) => { if (!open) setRemovingId(null); }}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{t("removeMemberTitle")}</DialogTitle>
            <DialogDescription>
              {t("removeMemberConfirm", { name: removingName })}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6">
            <GunimiButton variant="secondary" onClick={() => setRemovingId(null)}>
              {t("cancel")}
            </GunimiButton>
            <GunimiButton variant="danger" loading={isPending} onClick={handleRemoveConfirm}>
              {t("remove")}
            </GunimiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
