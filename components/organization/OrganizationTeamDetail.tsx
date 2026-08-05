"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, Plus, Trash2, UsersRound } from "lucide-react";
import toast from "react-hot-toast";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import TeamSheet from "@/components/organization/TeamSheet";
import AddMemberSheet from "@/components/organization/AddMemberSheet";

import { deleteTeam } from "@/server/actions/organization/deleteTeam";
import { removeTeamMember } from "@/server/actions/organization/removeTeamMember";
import { updateMemberRole } from "@/server/actions/organization/updateMemberRole";
import type { WorkspaceTeamWithMembers, WorkspaceTeam, WorkspaceTeamMember } from "@/types/organization";

type MemberRow = {
  id: string;
  user_id: string;
  role: string;
  profile: { full_name: string | null; avatar_url: string | null; email: string | null } | null;
};

type Props = {
  team: WorkspaceTeamWithMembers;
  allMembers: MemberRow[];
};

export default function OrganizationTeamDetail({ team: initialTeam, allMembers }: Props) {
  const t = useTranslations("organization");
  const tc = useTranslations("common");
  const router = useRouter();

  const [team, setTeam] = useState(initialTeam);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleTeamUpdated(updated: WorkspaceTeam) {
    setTeam((prev) => ({ ...prev, ...updated }));
  }

  function handleMemberAdded(membership: WorkspaceTeamMember) {
    setTeam((prev) => ({
      ...prev,
      memberships: [...prev.memberships, membership],
      member_count: prev.member_count + 1,
    }));
  }

  function handleRemoveMember(membershipId: string) {
    startTransition(async () => {
      const ok = await removeTeamMember(membershipId);
      if (ok) {
        setTeam((prev) => ({
          ...prev,
          memberships: prev.memberships.filter((m) => m.id !== membershipId),
          member_count: prev.member_count - 1,
        }));
        toast.success(t("memberRemoved"), { id: "remove-member" });
      } else {
        toast.error(t("memberRemoveFailed"), { id: "remove-member" });
      }
    });
  }

  function handleToggleLead(membershipId: string, currentRole: string) {
    const newRole = currentRole === "lead" ? "member" : "lead";
    startTransition(async () => {
      const ok = await updateMemberRole(membershipId, newRole as "lead" | "member");
      if (ok) {
        setTeam((prev) => ({
          ...prev,
          memberships: prev.memberships.map((m) =>
            m.id === membershipId ? { ...m, role: newRole as "lead" | "member" } : m
          ),
          lead: newRole === "lead"
            ? prev.memberships.find((m) => m.id === membershipId) ?? null
            : prev.lead?.id === membershipId ? null : prev.lead,
        }));
        toast.success(t("roleUpdated"), { id: "role-update" });
      }
    });
  }

  function handleDelete() {
    if (!confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      const ok = await deleteTeam(team.id);
      if (ok) {
        toast.success(t("teamDeleted"), { id: "delete-team" });
        router.push("/dashboard/organization");
        router.refresh();
      } else {
        toast.error(t("teamDeleteFailed"), { id: "delete-team" });
      }
    });
  }

  const existingMemberIds = team.memberships.map((m) => m.actor_id);

  return (
    <GunimiSection>
      {/* Back link */}
      <Link
        href="/dashboard/organization"
        className="inline-flex items-center gap-1.5 text-[12px] text-white/40 transition-colors hover:text-white/70"
      >
        <ArrowLeft size={12} />
        {t("allTeams")}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${team.color}22`, border: `1px solid ${team.color}44` }}
          >
            <UsersRound size={20} style={{ color: team.color }} />
          </div>
          <GunimiHeading
            badge={t("badge")}
            title={team.name}
            subtitle={team.description ?? undefined}
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <GunimiButton
            variant="secondary"
            onClick={() => setEditOpen(true)}
            className="gap-1.5 px-3 py-2 text-xs"
          >
            <Pencil size={12} />
            {tc("edit")}
          </GunimiButton>
          <GunimiButton
            variant="secondary"
            onClick={handleDelete}
            disabled={isPending}
            className="gap-1.5 px-3 py-2 text-xs text-red-400 hover:border-red-500/20 hover:bg-red-500/[0.05] hover:text-red-400"
          >
            <Trash2 size={12} />
            {tc("delete")}
          </GunimiButton>
        </div>
      </div>

      {/* Members section */}
      <GunimiCard className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-white/50">
            {t("members")} ({team.member_count})
          </h2>
          <GunimiButton
            variant="secondary"
            onClick={() => setAddOpen(true)}
            className="gap-1.5 px-3 py-1.5 text-[12px]"
          >
            <Plus size={12} />
            {t("addMember")}
          </GunimiButton>
        </div>

        {team.memberships.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-white/25">{t("noMembers")}</p>
        ) : (
          <div className="space-y-1">
            {team.memberships.map((membership) => {
              const profile = membership.member?.profile;
              return (
                <div
                  key={membership.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.02]"
                >
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#6D5BFF]/15 text-[11px] font-semibold text-[#8B7DFF]">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="" fill className="object-cover" />
                    ) : (
                      (profile?.full_name?.[0] ?? "?").toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-white/80">
                      {profile?.full_name ?? profile?.email ?? "—"}
                    </p>
                    {profile?.email && profile?.full_name && (
                      <p className="truncate text-[11px] text-white/30">{profile.email}</p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleLead(membership.id, membership.role)}
                      disabled={isPending}
                      className="rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors"
                      style={
                        membership.role === "lead"
                          ? { backgroundColor: `${team.color}22`, color: team.color }
                          : { backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }
                      }
                    >
                      {t(membership.role === "lead" ? "roleLead" : "roleMember")}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember(membership.id)}
                      disabled={isPending}
                      className="rounded-md px-2 py-0.5 text-[10px] text-white/25 transition-colors hover:text-red-400/70"
                    >
                      {tc("remove")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GunimiCard>

      <TeamSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        editTeam={team}
        onSuccess={handleTeamUpdated}
      />

      <AddMemberSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        teamId={team.id}
        existingMemberIds={existingMemberIds}
        allMembers={allMembers as MemberRow[]}
        onAdded={handleMemberAdded}
      />
    </GunimiSection>
  );
}
