"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Plus, UsersRound, ChevronRight, Mail, X, UserCircle2 } from "lucide-react";

import GunimiSection from "@/components/layout/GunimiSection";
import GunimiHeading from "@/components/ui/GunimiHeading";
import GunimiCard from "@/components/ui/GunimiCard";
import GunimiButton from "@/components/ui/GunimiButton";
import GunimiEmptyState from "@/components/ui/GunimiEmptyState";
import TeamSheet from "@/components/organization/TeamSheet";
import InviteMemberSheet from "@/components/settings/members/InviteMemberSheet";

import { revokeInvite } from "@/server/actions/workspace/revokeInvite";

import type { WorkspaceTeamWithMembers, WorkspaceTeam } from "@/types/organization";
import type { WorkspaceInvite } from "@/server/actions/workspace/getWorkspaceInvites";

type MemberRow = {
  id: string;
  user_id: string;
  role: string;
  profile: { full_name: string | null; avatar_url: string | null; email: string | null } | null;
};

type Props = {
  teams: WorkspaceTeamWithMembers[];
  members: MemberRow[];
  invites: WorkspaceInvite[];
};

const ROLE_ORDER: Record<string, number> = { owner: 0, admin: 1, member: 2 };

export default function OrganizationPageView({ teams: initialTeams, members, invites: initialInvites }: Props) {
  const t = useTranslations("organization");
  const router = useRouter();

  const [teams, setTeams] = useState(initialTeams);
  const [invites, setInvites] = useState(initialInvites);
  const [teamSheetOpen, setTeamSheetOpen] = useState(false);
  const [inviteSheetOpen, setInviteSheetOpen] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [, startRevoke] = useTransition();

  const sortedMembers = [...members].sort(
    (a, b) => (ROLE_ORDER[a.role] ?? 9) - (ROLE_ORDER[b.role] ?? 9)
  );

  function handleTeamCreated(team: WorkspaceTeam) {
    setTeams((prev) => [...prev, { ...team, memberships: [], member_count: 0, lead: null }]);
    router.refresh();
  }

  function handleInvited() {
    router.refresh();
  }

  function handleRevoke(invite: WorkspaceInvite) {
    setRevokingId(invite.id);
    startRevoke(async () => {
      const ok = await revokeInvite(invite.id);
      setRevokingId(null);
      if (ok) {
        setInvites((prev) => prev.filter((i) => i.id !== invite.id));
        toast.success(t("inviteRevoked"), { id: "revoke-invite" });
      } else {
        toast.error(t("inviteRevokeFailed"), { id: "revoke-invite" });
      }
    });
  }

  function roleLabel(role: string) {
    if (role === "owner") return t("roleOwner");
    if (role === "admin") return t("roleAdmin");
    return t("roleMember");
  }

  return (
    <GunimiSection>
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <GunimiHeading
          badge={t("badge")}
          title={t("heading")}
          subtitle={t("description")}
        />
        <div className="flex shrink-0 items-center gap-2">
          <GunimiButton
            variant="secondary"
            onClick={() => setInviteSheetOpen(true)}
            className="gap-1.5 px-4 py-2.5 text-[13px]"
          >
            <Mail size={13} />
            {t("inviteMember")}
          </GunimiButton>
          <GunimiButton
            onClick={() => setTeamSheetOpen(true)}
            className="gap-1.5 px-4 py-2.5 text-[13px]"
          >
            <Plus size={13} />
            {t("createTeam")}
          </GunimiButton>
        </div>
      </div>

      {/* TEAMS */}
      {teams.length === 0 ? (
        <GunimiEmptyState
          icon={UsersRound}
          title={t("noTeams")}
          description={t("noTeamsDescription")}
          action={
            <GunimiButton onClick={() => setTeamSheetOpen(true)} className="gap-1.5">
              <Plus size={13} />
              {t("createTeam")}
            </GunimiButton>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} href={`/dashboard/organization/${team.id}`}>
              <GunimiCard hoverable className="p-5 transition-all hover:border-white/[0.10]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white/90"
                      style={{ backgroundColor: `${team.color}22`, border: `1px solid ${team.color}44` }}
                    >
                      <UsersRound size={16} style={{ color: team.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-[#F7F8FC]">{team.name}</p>
                      {team.description && (
                        <p className="mt-0.5 truncate text-[11px] text-white/35">{team.description}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={14} className="mt-0.5 shrink-0 text-white/20" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {team.memberships.slice(0, 4).map((m) => (
                        <div
                          key={m.id}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#0A0E17] bg-[#6D5BFF]/20 text-[9px] font-semibold text-[#8B7DFF]"
                        >
                          {(m.member?.profile?.full_name?.[0] ?? "?").toUpperCase()}
                        </div>
                      ))}
                      {team.member_count > 4 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#0A0E17] bg-white/[0.05] text-[9px] text-white/40">
                          +{team.member_count - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-white/30">
                      {team.member_count} {t(team.member_count === 1 ? "memberSingular" : "memberPlural")}
                    </span>
                  </div>

                  {team.lead && (
                    <span
                      className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                      style={{ backgroundColor: `${team.color}18`, color: team.color }}
                    >
                      {team.lead.member?.profile?.full_name?.split(" ")[0] ?? t("roleLead")}
                    </span>
                  )}
                </div>
              </GunimiCard>
            </Link>
          ))}
        </div>
      )}

      {/* WORKSPACE MEMBERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/30">{t("workspaceMembersTitle")}</p>
          <span className="text-[11px] text-white/25">
            {sortedMembers.length} {t(sortedMembers.length === 1 ? "memberSingular" : "memberPlural")}
          </span>
        </div>

        <GunimiCard className="divide-y divide-white/[0.04] p-0 overflow-hidden">
          {sortedMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 px-5 py-3.5">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#6D5BFF]/15 text-[11px] font-semibold text-[#8B7DFF]">
                {member.profile?.avatar_url ? (
                  <Image src={member.profile.avatar_url} alt="" fill className="object-cover" />
                ) : member.profile?.full_name ? (
                  member.profile.full_name[0].toUpperCase()
                ) : (
                  <UserCircle2 size={16} className="text-white/20" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white/80">
                  {member.profile?.full_name ?? member.profile?.email ?? "—"}
                </p>
                {member.profile?.email && member.profile?.full_name && (
                  <p className="truncate text-[11px] text-white/30">{member.profile.email}</p>
                )}
              </div>
              <span className="shrink-0 rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-white/40">
                {roleLabel(member.role)}
              </span>
            </div>
          ))}
        </GunimiCard>
      </div>

      {/* PENDING INVITATIONS */}
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-white/30">{t("pendingInvitationsTitle")}</p>

        {invites.length === 0 ? (
          <p className="text-[12px] text-white/25">{t("noInvites")}</p>
        ) : (
          <GunimiCard className="divide-y divide-white/[0.04] p-0 overflow-hidden">
            {invites.map((invite) => (
              <div key={invite.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400/70">
                  <Mail size={13} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-white/70">{invite.email}</p>
                </div>
                <span className="shrink-0 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400/70">
                  {t("pendingLabel")}
                </span>
                <button
                  type="button"
                  disabled={revokingId === invite.id}
                  onClick={() => handleRevoke(invite)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/20 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </GunimiCard>
        )}
      </div>

      <TeamSheet
        open={teamSheetOpen}
        onOpenChange={setTeamSheetOpen}
        onSuccess={handleTeamCreated}
      />

      <InviteMemberSheet
        open={inviteSheetOpen}
        onOpenChange={setInviteSheetOpen}
        onInvited={handleInvited}
      />
    </GunimiSection>
  );
}
